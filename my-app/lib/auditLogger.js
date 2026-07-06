import fs from 'fs/promises';
import path from 'path';

//penerapan poin no checklist no 20


const LOG_DIR = path.join(process.cwd(), 'logs');
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB per log file

//Ensure log directory exists
async function ensureLogDir(){
    try {
        await fs.access(LOG_DIR);
    } catch {
        await fs.mkdir(LOG_DIR, { recursive: true });
    }
}


//Get log file path based on type
function getLogFilePath(type) {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
return path.join(LOG_DIR, `${type}-${date}.log`);    
}

//Format log entry
function formatLogEntry(level, action, details, request = null) {
    const timestamp = new Date().toISOString();
    const ip = request?.headers?.get('x-forwarded-for') || request?.headers?.get('x-real-ip') || 'unknown';
    const userAgent = request?.headers?.get('user-agent') || 'unknown';

    return JSON.stringify({
        timestamp,
        level,
        action,
        details,
        ip,
        userAgent,
    }) + '\n';
}

//Write Log to log file
async function writeLog(type, logEntry) {
    await ensureLogDir();
    const filePath = getLogFilePath(type);

    try{
        await fs.appendFile(filePath, logEntry);
    }catch(error){
        console.error(`Failed to write log entry: ${error.message}`);
    }
}

//Main logging function
export async function logActivity(type, action, details, request = null) {
    const logEntry = formatLogEntry('INFO', action, details, request);
    await writeLog(type, logEntry);
}

//Log Authentication event
export async function logAuth(action, details, request = null) {
    await logActivity('auth', action, details, request);
}

//Log failed Login
export async function logFailedLogin(reason, request = null) {
    await logAuth('LOGIN_FAILED', { reason }, request);
}

//Log Successfull Login
export async function logSuccessfulLogin(request = null) {
    await logAuth('LOGIN_SUCCESS', {}, request);
}

//Log Logout
export async function logLogout(request = null) {
    await logAuth('LOGOUT', {}, request);
}

//Log Rate Limit
export async function logRateLimitHit(endpoint, request = null) {
    await logActivity('RATE_LIMIT_HIT', { endpoint }, request);
}

//Log Content Update
export async function logContentUpdate(file, adminUser = 'admin', request = null) {
    await logActivity('content', 'CONTENT_UPDATE', {file, adminUser}, request);
}

//Log file upload
export async function logFileUpload(fileName, fileSize, fileType, request = null) {
    await logActivity('upload', 'FILE_UPLOAD', { fileName , fileSize, fileType }, request);
}

//Log API error
export async function logApiError(endpoint, statusCode, errorMessage, request = null) {
    await logActivity('error', 'API_ERROR', [ endpoint, statusCode, errorMessage ], request);
}

//Log Backup Restore
export async function logBackupRestore(file, filename, success, request = null) {
    await logActivity('backup', 'BACKUP_RESTORE', { file, filename, success }, request);
}

//Log Backup List Access
export async function logBackupListAccess(file, request = null) {
    await logActivity('backup', 'BACKUP_LIST_ACCESS', { file }, request);
}

const auditLogger = {
    logActivity,
    logAuth,
    logFailedLogin,
    logSuccessfulLogin,
    logLogout,
    logRateLimitHit,
    logContentUpdate,
    logFileUpload,
    logApiError,
    logBackupRestore,
    logBackupListAccess,
};


export default auditLogger;
