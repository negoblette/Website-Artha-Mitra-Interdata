# Deployment Checklist - VPS

## Overview

**Project:** Artha Mitra Interdata Website  
**Platform:** VPS (Ubuntu/Debian)  
**Stack:** Next.js + Node.js + PM2 + Nginx  
**Last Updated:** June 2026

---

## Pre-Deployment Checklist

### ✅ Sudah Dilakukan (Development Stage)

- [x] Script `set-permissions.sh` sudah dibuat
- [x] `.env` files sudah di-ignore di `.gitignore`
- [x] Non-root user sudah ada di Docker (jika pakai Docker)
- [x] File ownership sudah benar (jika pakai Docker)
- [x] Security audit script sudah ada (`security-audit.js`)
- [x] PM2 ecosystem config sudah ada (`ecosystem.config.js`)
- [x] Nginx config sudah ada (`nginx/ami-website.conf`)

### ⏳ Akan Dilakukan (VPS Configuration)

#### Phase 1: Server Setup (30 menit)

- [ ] Install Node.js 20+
- [ ] Install PM2 (process manager)
- [ ] Install Nginx (reverse proxy)
- [ ] Setup firewall (UFW)
- [ ] Create deploy user (non-root)
- [ ] Setup SSH key authentication

#### Phase 2: Project Deployment (30 menit)

- [ ] Clone repository ke `/var/www/ami`
- [ ] Install dependencies: `npm install`
- [ ] Build project: `npm run build`
- [ ] Create `.env.local` dengan environment variables
- [ ] Run permission script: `sudo ./scripts/set-permissions.sh`
- [ ] Verify permissions: `ls -la data/`

#### Phase 3: Process Management (15 menit)

- [ ] Copy PM2 ecosystem config
- [ ] Start application: `pm2 start ecosystem.config.js`
- [ ] Setup PM2 startup: `pm2 startup`
- [ ] Verify application running: `pm2 status`
- [ ] Check logs: `pm2 logs ami-website`

#### Phase 4: Nginx Configuration (30 menit)

- [ ] Setup Nginx reverse proxy
- [ ] Configure SSL/TLS (Let's Encrypt)
- [ ] Setup domain/subdomain
- [ ] Test HTTPS access
- [ ] Verify security headers

#### Phase 5: Security Verification (15 menit)

- [ ] Test unauthorized access → 401/403
- [ ] Verify file permissions: `ls -la data/`
- [ ] Check application logs: `pm2 logs`
- [ ] Test CMS admin access
- [ ] Verify SSL certificate

---

## Environment Variables

### Required Variables

```bash
# .env.local (create on VPS)
ADMIN_PASSWORD=your-secure-admin-password
SESSION_SECRET=your-session-secret-key
ADMIN_TOTP_SECRET=your-totp-secret-key
ADMIN_ALLOWED_HOSTS=arthamitra.co.id,www.arthamitra.co.id
```

### Generate Secrets

```bash
# Generate SESSION_SECRET
openssl rand -hex 32

# Generate ADMIN_TOTP_SECRET (for TOTP authentication)
# Use: https://totp.danhersam.com/
# Or generate manually: base32随机生成32字符
```

---

## Permission Reference

| Type | Permission | Description |
|------|-----------|-------------|
| Folders | 755 | rwxr-xr-x (owner: rwx, group: r-x, others: r-x) |
| JSON files | 644 | rw-r--r-- (owner: rw-, group: r--, others: r--) |
| Env/Config | 600 | rw------- (owner: rw-, no access for others) |
| Scripts | 755 | rwxr-xr-x (executable) |
| Uploads | 644 | rw-r--r-- (files), 755 (directory) |

---

## VPS Requirements

### Minimum Specifications

- **OS:** Ubuntu 20.04+ or Debian 11+
- **RAM:** 1GB minimum (2GB recommended)
- **Storage:** 20GB minimum
- **CPU:** 1 vCPU minimum
- **Network:** Public IP with ports 80 & 443 open

### Software Requirements

- Node.js 20+
- npm or pnpm
- PM2
- Nginx
- Certbot (for SSL)
- Git

---

## Deployment Commands

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install pm2 -g

# Install Nginx
sudo apt install nginx -y

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Create deploy user
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo su - deploy
```

### 2. Project Deployment

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-repo/ami-website.git ami
sudo chown -R deploy:deploy ami

# Install dependencies
cd ami
npm install

# Build project
npm run build

# Create .env.local
nano .env.local
# Add environment variables (see Environment Variables section)

# Set permissions
sudo ./scripts/set-permissions.sh

# Verify permissions
ls -la data/
ls -la .env*
```

### 3. Process Management

```bash
# Copy PM2 config
cp ecosystem.config.js /var/www/ami/

# Start application
cd /var/www/ami
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup

# Verify application
pm2 status
pm2 logs ami-website
```

### 4. Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/ami-website
# Paste contents from nginx/ami-website.conf

# Enable site
sudo ln -s /etc/nginx/sites-available/ami-website /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Setup SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d arthamitra.co.id -d www.arthamitra.co.id

# Auto-renewal
sudo crontab -e
# Add: 0 0 1 * * certbot renew --post-hook "systemctl reload nginx"
```

---

## Verification Checklist

### After Deployment

- [ ] Application accessible via HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid
- [ ] Admin login works
- [ ] CMS content updates work
- [ ] File uploads work
- [ ] Backups work
- [ ] Error pages display correctly
- [ ] Security headers present
- [ ] Rate limiting active

### Test Commands

```bash
# Test HTTPS
curl -I https://arthamitra.co.id

# Test unauthorized access
curl -X GET https://arthamitra.co.id/api/content?file=homepage
# Should return: 401 Unauthorized

# Verify file permissions
ls -la /var/www/ami/data/
# Should show: -rw-r--r-- (644) for JSON files

ls -la /var/www/ami/.env*
# Should show: -rw------- (600) for .env files

# Check application logs
pm2 logs ami-website

# Check Nginx logs
sudo tail -f /var/log/ami/nginx-access.log
```

---

## Troubleshooting

### Common Issues

#### 1. Permission Denied Error

```bash
# Fix: Set correct ownership
sudo chown -R deploy:deploy /var/www/ami
sudo chmod -R 755 /var/www/ami/data
```

#### 2. Environment File Access

```bash
# Fix: Restrict permissions
chmod 600 .env.local
chmod 600 .env.production
```

#### 3. Upload Directory

```bash
# Fix: Ensure writable
chmod 755 public/uploads
chown -R deploy:deploy public/uploads
```

#### 4. PM2 Process Not Starting

```bash
# Check logs
pm2 logs ami-website

# Restart application
pm2 restart ami-website

# Check environment variables
pm2 env ami-website
```

#### 5. Nginx 502 Bad Gateway

```bash
# Check if Node.js app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## Rollback Procedure

### If Deployment Fails

```bash
# 1. Stop PM2 process
pm2 stop ami-website

# 2. Restore previous version
cd /var/www/ami
git checkout <previous-commit-hash>

# 3. Rebuild
npm install
npm run build

# 4. Set permissions
sudo ./scripts/set-permissions.sh

# 5. Restart PM2
pm2 restart ami-website
```

---

## Post-Deployment

### Monitoring

```bash
# Monitor application
pm2 monit

# Check logs
pm2 logs ami-website

# Check system resources
htop
```

### Maintenance

```bash
# Update application
cd /var/www/ami
git pull origin main
npm install
npm run build
pm2 restart ami-website

# Check for security updates
npm run security:audit
```

---

## Security Notes

1. **Never use 777 permissions** - This gives full access to everyone
2. **Keep .env files secure** - Use 600 permissions
3. **Use non-root user** - Already implemented in Dockerfile
4. **Regular audits** - Check permissions periodically
5. **Monitor logs** - Watch for suspicious activity

---

## Support

For issues or questions:
- Check PM2 logs: `pm2 logs ami-website`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Review this deployment checklist
- Contact development team

---

**Last Updated:** June 2026  
**Version:** 1.0
