# Detailed Technical Work Report
## Laqta VPS Server Deployment & Configuration

**Project:** Laqta Creative Agency Platform
**Period:** November - December 2025
**Server:** server2.leqta.com (197.140.18.185)
**OS:** Debian/Ubuntu Linux with HestiaCP

---

## Table of Contents

1. [VPS Initial Setup](#1-vps-initial-setup)
2. [HestiaCP Control Panel](#2-hestiacp-control-panel)
3. [Database Configuration](#3-database-configuration)
4. [Application Deployment](#4-application-deployment)
5. [Web Server Configuration](#5-web-server-configuration)
6. [SSL/HTTPS Implementation](#6-sslhttps-implementation)
7. [FTP Server Setup](#7-ftp-server-setup)
8. [Mail Server Configuration](#8-mail-server-configuration)
9. [Security Implementation](#9-security-implementation)
10. [Automation & Scripts](#10-automation--scripts)
11. [Troubleshooting & Fixes](#11-troubleshooting--fixes)
12. [Documentation Created](#12-documentation-created)

---

## 1. VPS Initial Setup

### Tasks Completed

#### System Updates & Prerequisites
- Updated system packages (`apt update && apt upgrade`)
- Installed build essentials for compiling native Node modules
- Installed Git for version control and deployment
- Configured system locale and timezone

#### Node.js 20.x Installation
- Installed Node.js 20.x via NodeSource repository
- Verified npm 10.x installation
- Configured npm global directory permissions

#### PM2 Process Manager
- Installed PM2 globally for process management
- Configured PM2 startup script for auto-restart on server reboot
- Set up process monitoring and logging

#### Technical Details
```bash
# Node.js installation
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 setup
sudo npm install -g pm2
pm2 startup systemd
```

---

## 2. HestiaCP Control Panel

### Tasks Completed

#### Panel Configuration
- Configured HestiaCP admin access on port 8083
- Set up user accounts with appropriate permissions
- Configured web server templates for Node.js applications

#### Services Managed
- Nginx (primary web server)
- Apache (backend processing)
- MariaDB (database server)
- Exim4 (mail transfer agent)
- Dovecot (IMAP/POP3 server)
- vsftpd (FTP server)

#### Access Configuration
- URL: https://server2.leqta.com:8083
- Alternative: https://197.140.18.185:8083
- Secured with SSL certificate

---

## 3. Database Configuration

### Tasks Completed

#### MariaDB Setup
- Created production database: `laqta_strapi`
- Created database user: `strapi_user` with limited privileges
- Configured UTF-8 encoding (utf8mb4_unicode_ci)
- Set up phpMyAdmin access via HestiaCP

#### Security Measures
- Database user restricted to localhost only
- Removed anonymous users and test database
- Root password secured
- Remote database access disabled

#### phpMyAdmin Access
- URL: https://server2.leqta.com:8083/phpmyadmin/
- Configured Apache alias for phpMyAdmin
- Added firewall rule for port 8083

---

## 4. Application Deployment

### Strapi CMS Backend

#### Installation Steps
1. Cloned repository to `/var/www/leqta/my-blog-cms`
2. Installed npm dependencies
3. Configured production environment variables:
   - Database connection (MariaDB)
   - Security keys (APP_KEYS, JWT secrets)
   - Supabase storage integration
4. Built Strapi admin panel
5. Configured PM2 process

#### Configuration
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=laqta_strapi
```

### Next.js Frontend

#### Installation Steps
1. Cloned repository to `/var/www/leqta/laqta`
2. Installed npm dependencies
3. Configured environment variables:
   - Strapi API URL
   - Odoo integration (if applicable)
4. Built production bundle
5. Configured PM2 process

#### PM2 Ecosystem Configuration
Created `ecosystem.config.js` with:
- Process names: `strapi` and `laqta`
- Auto-restart on failure
- Memory limits (1GB per process)
- Log file configuration
- Exponential backoff restart delay

---

## 5. Web Server Configuration

### Nginx Reverse Proxy

#### Frontend Configuration (leqta.com)
- Proxy pass to localhost:3000
- WebSocket support for Next.js HMR
- Static file caching (_next/static, images)
- Gzip compression enabled
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

#### Backend API Configuration (api.leqta.com)
- Proxy pass to localhost:1337
- Max upload size: 50-100MB for media
- Extended timeouts for admin panel
- WebSocket support for Strapi admin

#### Performance Optimizations
```nginx
# Static file caching
location /_next/static {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 6. SSL/HTTPS Implementation

### Tasks Completed

#### Let's Encrypt Certificates
- Installed Certbot with Nginx plugin
- Obtained certificates for:
  - leqta.com
  - www.leqta.com
  - api.leqta.com
  - mail.leqta.com
  - webmail.leqta.com

#### Auto-Renewal
- Certbot timer configured for automatic renewal
- Tested with `certbot renew --dry-run`
- Certificate renewal every 90 days

#### HTTPS Enforcement
- HTTP to HTTPS redirect configured
- HSTS header enabled
- Modern TLS protocols (TLSv1.2, TLSv1.3)
- Strong cipher suites

---

## 7. FTP Server Setup

### vsftpd Configuration

#### User Accounts Created
| User | Purpose | Access |
|------|---------|--------|
| leqta | Client uploads | `/srv/jail/leqta/upload` |
| shohrati | Client uploads | `/srv/jail/shohrati/upload` |
| ftpadmin | Admin access | Both folders |

#### Security Features
- Chroot jail for user isolation
- No SSH access (shell: /sbin/nologin)
- Bind mounts for data persistence
- Passive mode configured (ports 12000-12100)

#### Directory Structure
```
/srv/
├── ftpdata/          # Actual data storage
│   ├── leqta/
│   └── shohrati/
└── jail/             # Chroot jails
    ├── leqta/upload/
    ├── shohrati/upload/
    └── ftpadmin/
```

#### Configuration Files
- `/etc/vsftpd.conf` - Main configuration
- `/etc/vsftpd.userlist` - Allowed users
- `/etc/fstab` - Bind mount persistence

---

## 8. Mail Server Configuration

### Components Configured

#### Exim4 (SMTP)
- Ports: 25, 465 (SMTPS), 587 (Submission)
- SSL/TLS encryption enabled
- SPF record configured
- DKIM signing enabled

#### Dovecot (IMAP/POP3)
- Ports: 110 (POP3), 143 (IMAP), 993 (IMAPS), 995 (POP3S)
- SSL certificates configured
- Per-domain SSL configuration

#### DNS Records Configured
| Type | Name | Purpose |
|------|------|---------|
| A | mail.leqta.com | Mail server IP |
| A | webmail.leqta.com | Webmail access |
| MX | leqta.com | Mail routing |
| TXT | leqta.com | SPF record |
| TXT | _dmarc.leqta.com | DMARC policy |

#### Webmail Access
- URL: https://webmail.leqta.com
- Roundcube webmail interface

---

## 9. Security Implementation

### Firewall Configuration

#### Ports Configured
| Port | Service | Status |
|------|---------|--------|
| 22 | SSH | Open |
| 80 | HTTP | Open |
| 443 | HTTPS | Open |
| 21 | FTP | Open |
| 25, 465, 587 | SMTP | Open |
| 110, 143, 993, 995 | IMAP/POP3 | Open |
| 1337 | Strapi API | Internal |
| 3000 | Next.js | Internal |
| 8083 | HestiaCP | Open |

#### Security Measures
- SSH key authentication recommended
- Root SSH login disabled
- Fail2ban for brute-force protection
- UFW/iptables rules configured

### Application Security
- Environment files protected (.env not in git)
- Database user with minimal privileges
- Strapi security keys generated with `openssl rand -base64 32`
- HTTP security headers enabled

---

## 10. Automation & Scripts

### Scripts Created

#### deploy.sh
**Purpose:** Automated deployment for updates
**Features:**
- Pulls latest code from GitHub
- Backs up and restores .env files
- Installs dependencies
- Builds both applications
- Restarts PM2 processes
- Health check for Strapi

**Usage:**
```bash
./scripts/deploy.sh           # Full deployment
./scripts/deploy.sh --skip-build  # Skip build (faster)
```

#### setup.sh
**Purpose:** Initial server setup
**Features:**
- Installs Node.js and PM2
- Creates project directories
- Generates .env templates

#### ftp_config.bash
**Purpose:** FTP server configuration
**Features:**
- Creates FTP users
- Sets up chroot jails
- Configures bind mounts

#### Backup Scripts
- Database backup with mysqldump
- Automatic cleanup of old backups
- Cron job for scheduled backups

---

## 11. Troubleshooting & Fixes

### Issues Resolved

#### Dovecot SSL Error
**Problem:** `Can't load SSL certificate: error:0A00008B:SSL routines::unknown command`

**Cause:** Corrupted OpenSSL configuration with invalid HestiaCP entries

**Solution:**
1. Edited `/etc/ssl/openssl.cnf`
2. Removed/commented problematic lines:
   ```
   [system_default]
   system_default = hestia_openssl_sect
   [hestia_openssl_sect]
   ```
3. Restarted Dovecot

#### HestiaCP 404 Error
**Problem:** HestiaCP panel showing 404 errors

**Cause:** Corrupted `open_basedir` configuration

**Solution:** Fixed `/usr/local/hestia/nginx/conf/nginx.conf`

#### Blog Navigation Fix
- Documented in `docs/troubleshooting/FIX_BLOG_NAVIGATION.md`
- Frontend routing issue resolved

---

## 12. Documentation Created

### Deployment Guides
| File | Purpose |
|------|---------|
| DEPLOYMENT.md | Complete HestiaCP deployment guide |
| VPS_DEPLOYMENT_GUIDE.md | Linux VPS deployment from scratch |
| SERVER_DEPLOYMENT.md | Quick deployment reference |

### Server Configuration Guides
| File | Purpose |
|------|---------|
| NGINX_CONFIG.md | Nginx HTTPS reverse proxy setup |
| FTP_SERVER_GUIDE.md | FTP server configuration and usage |
| GUI_FTP_SERVER_GUIDE.md | FTP client setup guide |
| PV_VPS_CONFIGURATION.md | Complete server configuration record |

### HestiaCP Guides
| File | Purpose |
|------|---------|
| HESTIACP_SSL_FIX.md | SSL/Dovecot troubleshooting |
| HESTIACP_PHPMYADMIN.md | phpMyAdmin configuration |
| HESTIACP_MAIL_LOGS.md | Mail server log reference |

### Additional Guides
| File | Purpose |
|------|---------|
| MAINTENANCE_MODE_SETUP.md | Cookie-based maintenance mode |
| wordpress-installation-guide.md | WordPress installation reference |

---

## Technical Summary

### Architecture Deployed

```
Internet
    │
    ▼
┌─────────────────────────────────────────┐
│            Nginx (80/443)                │
│         Reverse Proxy + SSL              │
└─────────────────────────────────────────┘
    │                    │
    ▼                    ▼
┌──────────────┐  ┌──────────────────────┐
│   Next.js    │  │      Strapi CMS      │
│   :3000      │  │       :1337          │
│  (Frontend)  │  │     (Backend)        │
└──────────────┘  └──────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   MariaDB    │
                  │    :3306     │
                  └──────────────┘
```

### Stack Overview
- **OS:** Debian/Ubuntu Linux
- **Control Panel:** HestiaCP
- **Web Server:** Nginx + Apache
- **Database:** MariaDB
- **Backend:** Strapi CMS v5 (Node.js)
- **Frontend:** Next.js 15 (React)
- **Process Manager:** PM2
- **SSL:** Let's Encrypt (Certbot)
- **FTP:** vsftpd
- **Mail:** Exim4 + Dovecot

---

## Credentials & Access Summary

| Service | URL/Access | Notes |
|---------|------------|-------|
| HestiaCP | https://server2.leqta.com:8083 | Control panel |
| Strapi Admin | https://api.leqta.com/admin | CMS admin |
| Frontend | https://leqta.com | Public website |
| phpMyAdmin | https://server2.leqta.com:8083/phpmyadmin | Database |
| Webmail | https://webmail.leqta.com | Email access |
| FTP | ftp://server2.leqta.com:21 | File transfer |
| SSH | ssh user@197.140.18.185 | Server access |

---

## Maintenance Commands Quick Reference

```bash
# PM2 Commands
pm2 status              # Check status
pm2 logs                # View all logs
pm2 logs strapi         # Strapi logs
pm2 logs laqta          # Frontend logs
pm2 restart all         # Restart services
pm2 monit               # Real-time monitoring

# Nginx Commands
sudo nginx -t           # Test config
sudo systemctl reload nginx  # Apply changes

# Database Backup
mysqldump -u strapi_user -p laqta_strapi > backup.sql

# SSL Renewal Test
sudo certbot renew --dry-run

# Deployment
cd /var/www/leqta && ./scripts/deploy.sh
```

---

**Document prepared by:** [Your Name]
**Date:** December 2025
**Version:** 1.0
