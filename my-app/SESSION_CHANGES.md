# Server-Side Session Implementation

## Overview

This implementation changes the session management from client-side JWT to server-side Redis sessions. This fixes the "ghost login" issue where users remained logged in after `docker compose down -v` and rebuild.

## Changes Made

### 1. Created `lib/sessionStore.js`
New module for managing sessions in Redis:
- `createSession(sessionData)` - Create a new session in Redis
- `getSession(sessionId)` - Retrieve session from Redis
- `deleteSession(sessionId)` - Delete session from Redis
- `revokeSession(sessionId)` - Mark session as revoked
- `isSessionRevoked(sessionId)` - Check if session is revoked
- `cleanupExpiredSessions()` - Remove expired sessions

### 2. Updated `lib/adminAuth.js`
Changed from JWT-based to session-based authentication:
- `createAdminSession(ip, userAgent)` - Create session in Redis, return sessionId
- `verifyAdminSessionToken(sessionId)` - Verify session exists in Redis and is valid
- `deleteAdminSession(sessionId)` - Delete session from Redis
- `revokeAdminSession(sessionId)` - Revoke session in Redis

**Note:** OTP challenge tokens still use JWT (stored in cookie), but admin sessions now use Redis.

### 3. Updated `app/api/auth/verify/route.js`
Login flow now:
1. Verify OTP
2. Create session in Redis with user data
3. Store session ID in cookie (not JWT payload)
4. Cookie contains only: `session_id = "uuid"`

### 4. Updated `app/api/auth/logout/route.js`
Logout flow now:
1. Get session ID from cookie
2. Delete session from Redis
3. Clear cookie

### 5. Updated `app/api/auth/me/route.js`
Session check now:
1. Get session ID from cookie
2. Query Redis for session data
3. Return session info if valid

## How It Works

### Before (Client-Side JWT)
```
Cookie: JWT token (contains all session data)
↓
Server: Verify JWT signature and expiry
↓
Result: JWT valid → Allow access (even after restart!)
```

### After (Server-Side Session)
```
Cookie: Session ID only (just a UUID)
↓
Server: Query Redis for session data
↓
Result: Session found in Redis → Allow access
        Session NOT found → Reject (must re-login)
```

## Behavior with Docker Commands

### Normal Development (No -v)
```bash
docker compose down
docker compose up --build
```
- **Data:** Persists (stored in Docker volume)
- **Session:** Persists (Redis still has data)
- **User stays logged in:** Yes ✅

### Full Reset (With -v)
```bash
docker compose down -v
docker compose up --build
```
- **Data:** Lost (volume deleted)
- **Session:** Lost (Redis cleared)
- **User must re-login:** Yes ✅ (This is the fix!)

## Session Lifecycle

### Creation (Login)
```
1. User submits OTP
2. Server verifies OTP
3. Server creates session in Redis:
   Key: ami:session:{uuid}
   Value: { userId, role, ip, createdAt }
   TTL: 3600 seconds (1 hour)
4. Server sets cookie with session ID
5. User is logged in
```

### Verification (Every Request)
```
1. Request comes in with cookie
2. Server extracts session ID from cookie
3. Server queries Redis: GET ami:session:{sessionId}
4. If found and not expired → Allow
5. If not found or expired → Reject
```

### Destruction (Logout)
```
1. User clicks logout
2. Server deletes session from Redis: DEL ami:session:{sessionId}
3. Server clears cookie
4. User is logged out
```

### Invalidation (Docker -v)
```
1. docker compose down -v
2. Redis volume is deleted
3. All sessions in Redis are gone
4. docker compose up --build
5. Redis starts fresh (no sessions)
6. User's cookie has session ID, but session doesn't exist in Redis
7. Next request → Reject → Must re-login
```

## Security Benefits

1. **Server Control:** Sessions can be revoked instantly from server
2. **No Persistent Tokens:** JWT doesn't persist in browser after server restart
3. **Audit Trail:** Session data includes IP, user agent, creation time
4. **Easy Revocation:** Single Redis command to revoke session
5. **Automatic Expiry:** Sessions auto-expire via Redis TTL

## Files Modified

- `lib/sessionStore.js` (NEW) - Redis session management
- `lib/adminAuth.js` - Session creation and verification
- `app/api/auth/verify/route.js` - Login flow
- `app/api/auth/logout/route.js` - Logout flow
- `app/api/auth/me/route.js` - Session check

## Backward Compatibility

The changes are backward compatible with existing routes because:
- `verifyAdminSessionToken()` returns `null` for invalid sessions
- `verifyAdminSessionToken()` returns session object for valid sessions
- Existing code uses: `if (!await checkAuth(request))` which works with both

## Testing

### Test 1: Normal Login
1. Login to admin dashboard
2. Make changes
3. Restart: `docker compose down && docker compose up --build`
4. Verify: Still logged in, changes persist ✅

### Test 2: Full Reset
1. Login to admin dashboard
2. Make changes
3. Reset: `docker compose down -v && docker compose up --build`
4. Verify: Must re-login, changes lost ✅

### Test 3: Session Expiry
1. Login to admin
2. Wait 1 hour (or modify SESSION_MAX_AGE to 60 seconds for testing)
3. Try to access admin
4. Verify: Must re-login ✅

## Rollback

If you need to rollback to JWT-based auth:
1. Revert changes to `lib/adminAuth.js`
2. Revert changes to `app/api/auth/verify/route.js`
3. Revert changes to `app/api/auth/logout/route.js`
4. Revert changes to `app/api/auth/me/route.js`
5. Delete `lib/sessionStore.js`
6. Reinstall `lib/sessionRevocation.js` (if needed)
