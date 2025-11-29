# Linux VPS Deployment Guide: Strapi + Next.js with PM2

Complete guide for cleaning a Linux VPS working directory and deploying the Laqta Strapi + Next.js application from scratch using PM2.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clean VPS Working Directory](#2-clean-vps-working-directory)
3. [System Setup](#3-system-setup)
4. [Database Setup (MariaDB)](#4-database-setup-mariadb)
5. [Project Deployment](#5-project-deployment)
6. [PM2 Configuration](#6-pm2-configuration)
7. [Nginx Reverse Proxy](#7-nginx-reverse-proxy)
8. [SSL Certificates](#8-ssl-certificates)
9. [Firewall Configuration](#9-firewall-configuration)
10. [Maintenance Commands](#10-maintenance-commands)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites

### VPS Requirements
- **OS**: Ubuntu 22.04 LTS (recommended) or Debian 12
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB SSD
- **CPU**: 2 vCPUs recommended

### Domain Configuration
Ensure your domains point to the VPS IP:
- `yourdomain.com` → Frontend (Next.js)
- `api.yourdomain.com` → Backend (Strapi)

---

## 2. Clean VPS Working Directory

### 2.1 Connect to VPS
```bash
ssh root@your-vps-ip
# Or with a sudo user
ssh user@your-vps-ip
```

### 2.2 Stop All Running Services
```bash
# Stop PM2 processes
pm2 stop all
pm2 delete all

# Stop and disable services if running
sudo systemctl stop nginx
sudo systemctl stop mariadb
```

### 2.3 Complete Cleanup Script
Create and run the cleanup script:

```bash
#!/bin/bash
# cleanup-vps.sh - Complete VPS cleanup script

echo "=========================================="
echo "VPS CLEANUP SCRIPT"
echo "=========================================="

# Stop PM2 if running
if command -v pm2 &> /dev/null; then
    echo "Stopping PM2 processes..."
    pm2 stop all 2>/dev/null
    pm2 delete all 2>/dev/null
    pm2 kill 2>/dev/null
fi

# Define project directory
PROJECT_DIR="/var/www/leqta"

# Backup important files before deletion (optional)
if [ -d "$PROJECT_DIR" ]; then
    echo "Creating backup of environment files..."
    BACKUP_DIR="/root/backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"

    # Backup .env files if they exist
    [ -f "$PROJECT_DIR/my-blog-cms/.env" ] && cp "$PROJECT_DIR/my-blog-cms/.env" "$BACKUP_DIR/strapi.env.backup"
    [ -f "$PROJECT_DIR/laqta/.env.local" ] && cp "$PROJECT_DIR/laqta/.env.local" "$BACKUP_DIR/nextjs.env.backup"
    [ -f "$PROJECT_DIR/ecosystem.config.js" ] && cp "$PROJECT_DIR/ecosystem.config.js" "$BACKUP_DIR/ecosystem.config.js.backup"

    echo "Backup created at: $BACKUP_DIR"
fi

# Remove project directory
echo "Removing project directory..."
rm -rf "$PROJECT_DIR"

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force 2>/dev/null

# Clear PM2 logs
echo "Clearing PM2 logs..."
pm2 flush 2>/dev/null
rm -rf ~/.pm2/logs/* 2>/dev/null

# Remove old node_modules from home directory if any
rm -rf ~/node_modules 2>/dev/null

# Clear system cache (optional)
echo "Clearing system cache..."
sudo sync && sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'

# Show disk space
echo ""
echo "Disk space after cleanup:"
df -h /

echo ""
echo "=========================================="
echo "CLEANUP COMPLETE"
echo "=========================================="
```

Save and run:
```bash
nano ~/cleanup-vps.sh
chmod +x ~/cleanup-vps.sh
./cleanup-vps.sh
```

### 2.4 Optional: Drop and Recreate Database
If you want a completely fresh database:

```bash
# Login to MariaDB
sudo mysql -u root -p

# Drop existing database
DROP DATABASE IF EXISTS strapi_db_leqta;

# Exit MariaDB
EXIT;
```

---

## 3. System Setup

### 3.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Install Node.js 20.x
```bash
# Remove old Node.js versions
sudo apt remove nodejs npm -y
sudo rm -rf /usr/local/lib/node_modules

# Install Node.js 20.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x
```

### 3.3 Install PM2 Globally
```bash
sudo npm install -g pm2

# Setup PM2 startup script (auto-start on reboot)
pm2 startup systemd
# Run the command it outputs, e.g.:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-user --hp /home/your-user
```

### 3.4 Install Build Essentials
```bash
sudo apt install -y build-essential git curl wget unzip
```

### 3.5 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

---

## 4. Database Setup (MariaDB)

### 4.1 Install MariaDB
```bash
sudo apt install -y mariadb-server mariadb-client
sudo systemctl enable mariadb
sudo systemctl start mariadb
```

### 4.2 Secure MariaDB
```bash
sudo mysql_secure_installation
```
Follow prompts:
- Set root password
- Remove anonymous users: Y
- Disallow root login remotely: Y
- Remove test database: Y
- Reload privilege tables: Y

### 4.3 Create Database and User
```bash
sudo mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE strapi_db_leqta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD_HERE';

-- Grant privileges
GRANT ALL PRIVILEGES ON strapi_db_leqta.* TO 'strapi_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT User, Host FROM mysql.user;

EXIT;
```

---

## 5. Project Deployment

### 5.1 Create Project Directory
```bash
sudo mkdir -p /var/www/leqta
sudo chown -R $USER:$USER /var/www/leqta
cd /var/www/leqta
```

### 5.2 Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/leqta_strapi.git .
# Or if using SSH:
git clone git@github.com:YOUR_USERNAME/leqta_strapi.git .
```

### 5.3 Setup Strapi Backend

```bash
cd /var/www/leqta/my-blog-cms

# Install dependencies
npm install

# Create production environment file
cat > .env << 'EOF'
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security Keys - GENERATE NEW ONES!
# Use: openssl rand -base64 32
APP_KEYS=GENERATE_KEY_1,GENERATE_KEY_2,GENERATE_KEY_3,GENERATE_KEY_4
API_TOKEN_SALT=GENERATE_SALT_HERE
ADMIN_JWT_SECRET=GENERATE_SECRET_HERE
TRANSFER_TOKEN_SALT=GENERATE_SALT_HERE
JWT_SECRET=GENERATE_SECRET_HERE

# Database (MariaDB)
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi_db_leqta
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=YOUR_SECURE_PASSWORD_HERE
DATABASE_SSL=false

# Supabase Storage (if using)
SUPABASE_API_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-supabase-anon-key
SUPABASE_BUCKET=your-bucket-name
SUPABASE_DIRECTORY=
EOF

# Generate security keys
echo ""
echo "Generating security keys..."
echo "APP_KEYS:"
for i in {1..4}; do openssl rand -base64 32; done
echo ""
echo "Other secrets (use one for each):"
for i in {1..4}; do openssl rand -base64 32; done

# Edit .env with generated keys
nano .env

# Build Strapi
npm run build
```

### 5.4 Setup Next.js Frontend

```bash
cd /var/www/leqta/laqta

# Install dependencies
npm install

# Create production environment file
cat > .env.local << 'EOF'
# Strapi API URL
NEXT_PUBLIC_STRAPI_URL_2=https://api.yourdomain.com

# Odoo Integration (if needed)
ODOO_URL=https://your-odoo.odoo.com
ODOO_DB=your-db-name
ODOO_USERNAME=your-username
ODOO_API_KEY=your-api-key
EOF

# Edit with your values
nano .env.local

# Build Next.js
npm run build
```

---

## 6. PM2 Configuration

### 6.1 Create Production Ecosystem File

```bash
cd /var/www/leqta

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
/**
 * PM2 Production Ecosystem Configuration
 *
 * Commands:
 *   pm2 start ecosystem.config.js
 *   pm2 restart all
 *   pm2 stop all
 *   pm2 logs
 *   pm2 monit
 */

module.exports = {
  apps: [
    // ==========================================
    // Strapi CMS Backend
    // ==========================================
    {
      name: 'strapi',
      cwd: '/var/www/leqta/my-blog-cms',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      // Environment variables
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 1337,
      },

      // Error handling
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      restart_delay: 3000,

      // Logging
      error_file: '/var/www/leqta/logs/strapi-error.log',
      out_file: '/var/www/leqta/logs/strapi-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },

    // ==========================================
    // Next.js Frontend
    // ==========================================
    {
      name: 'laqta',
      cwd: '/var/www/leqta/laqta',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Error handling
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      restart_delay: 3000,

      // Logging
      error_file: '/var/www/leqta/logs/laqta-error.log',
      out_file: '/var/www/leqta/logs/laqta-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
EOF
```

### 6.2 Create Logs Directory
```bash
mkdir -p /var/www/leqta/logs
```

### 6.3 Start Applications with PM2
```bash
cd /var/www/leqta

# Start all applications
pm2 start ecosystem.config.js

# Save PM2 process list (for auto-restart on reboot)
pm2 save

# Verify running processes
pm2 status
pm2 logs
```

### 6.4 Useful PM2 Commands
```bash
# View status
pm2 status
pm2 list

# View logs
pm2 logs              # All logs
pm2 logs strapi       # Strapi logs only
pm2 logs laqta        # Next.js logs only

# Restart services
pm2 restart strapi
pm2 restart laqta
pm2 restart all

# Stop services
pm2 stop strapi
pm2 stop all

# Monitor in real-time
pm2 monit

# Show detailed info
pm2 show strapi
pm2 show laqta

# Reload with zero downtime
pm2 reload all
```

---

## 7. Nginx Reverse Proxy

### 7.1 Create Nginx Configuration for Next.js Frontend

```bash
sudo nano /etc/nginx/sites-available/laqta
```

```nginx
# Next.js Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;
    gzip_comp_level 6;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimization caching
    location /_next/image {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 60m;
    }
}
```

### 7.2 Create Nginx Configuration for Strapi API

```bash
sudo nano /etc/nginx/sites-available/strapi
```

```nginx
# Strapi API Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size (for Strapi media uploads)
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 120s;
    }

    # Strapi admin panel
    location /admin {
        proxy_pass http://127.0.0.1:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API uploads (if serving locally instead of Supabase)
    location /uploads {
        proxy_pass http://127.0.0.1:1337/uploads;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

### 7.3 Enable Sites and Test
```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/laqta /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## 8. SSL Certificates

### 8.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8.2 Obtain SSL Certificates
```bash
# For frontend
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For API
sudo certbot --nginx -d api.yourdomain.com
```

### 8.3 Auto-Renewal Setup
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Certbot automatically creates a timer, verify it:
sudo systemctl status certbot.timer
```

---

## 9. Firewall Configuration

### 9.1 Setup UFW
```bash
# Enable UFW
sudo ufw enable

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny direct access to application ports (only through Nginx)
sudo ufw deny 1337/tcp
sudo ufw deny 3000/tcp

# Check status
sudo ufw status verbose
```

---

## 10. Maintenance Commands

### 10.1 Deployment Update Script
Create a deployment script for updates:

```bash
cat > /var/www/leqta/deploy.sh << 'EOF'
#!/bin/bash
# deploy.sh - Update and redeploy the application

set -e  # Exit on error

echo "=========================================="
echo "DEPLOYMENT SCRIPT"
echo "=========================================="

PROJECT_DIR="/var/www/leqta"
cd "$PROJECT_DIR"

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Update Strapi
echo "Updating Strapi..."
cd "$PROJECT_DIR/my-blog-cms"
npm install
npm run build

# Update Next.js
echo "Updating Next.js..."
cd "$PROJECT_DIR/laqta"
npm install
npm run build

# Restart PM2 processes
echo "Restarting PM2 processes..."
cd "$PROJECT_DIR"
pm2 restart ecosystem.config.js

# Wait and verify
sleep 5
pm2 status

echo ""
echo "=========================================="
echo "DEPLOYMENT COMPLETE"
echo "=========================================="
EOF

chmod +x /var/www/leqta/deploy.sh
```

### 10.2 Quick Commands Reference
```bash
# --- PM2 ---
pm2 status                    # Check status
pm2 logs                      # View logs
pm2 restart all               # Restart all apps
pm2 reload all                # Zero-downtime reload
pm2 monit                     # Real-time monitoring

# --- Nginx ---
sudo nginx -t                 # Test config
sudo systemctl reload nginx   # Reload config
sudo systemctl restart nginx  # Full restart

# --- Database ---
sudo mysql -u root -p         # Access MariaDB
sudo systemctl status mariadb # Check status

# --- System ---
htop                          # System resources
df -h                         # Disk usage
free -h                       # Memory usage

# --- Logs ---
pm2 logs strapi --lines 100   # Last 100 lines of Strapi logs
pm2 logs laqta --lines 100    # Last 100 lines of Next.js logs
sudo tail -f /var/log/nginx/error.log  # Nginx error log
```

### 10.3 Database Backup Script
```bash
cat > /var/www/leqta/backup-db.sh << 'EOF'
#!/bin/bash
# backup-db.sh - Backup MariaDB database

BACKUP_DIR="/var/www/leqta/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="strapi_db_leqta"
DB_USER="strapi_user"
DB_PASS="YOUR_PASSWORD"

mkdir -p "$BACKUP_DIR"

# Create backup
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"

# Keep only last 7 backups
cd "$BACKUP_DIR"
ls -t *.sql.gz | tail -n +8 | xargs -r rm

echo "Backup created: ${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"
EOF

chmod +x /var/www/leqta/backup-db.sh

# Add to crontab for daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/leqta/backup-db.sh") | crontab -
```

---

## 11. Troubleshooting

### 11.1 Common Issues

#### Application Not Starting
```bash
# Check PM2 logs for errors
pm2 logs strapi --lines 200
pm2 logs laqta --lines 200

# Check if ports are in use
sudo lsof -i :1337
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 $(sudo lsof -t -i:1337)
```

#### Database Connection Issues
```bash
# Test database connection
mysql -u strapi_user -p -h localhost strapi_db_leqta

# Check MariaDB status
sudo systemctl status mariadb

# View MariaDB logs
sudo tail -f /var/log/mysql/error.log
```

#### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

#### Memory Issues
```bash
# Check memory usage
free -h

# Check PM2 memory usage
pm2 monit

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Add to /etc/fstab for persistence:
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 11.2 Health Check Endpoints
```bash
# Check Strapi health
curl http://localhost:1337/_health

# Check Next.js
curl http://localhost:3000

# Check external access
curl https://api.yourdomain.com/_health
curl https://yourdomain.com
```

### 11.3 Complete Reset Procedure
If everything fails and you need to start fresh:

```bash
# 1. Stop everything
pm2 stop all
pm2 delete all
sudo systemctl stop nginx

# 2. Run cleanup script
./cleanup-vps.sh

# 3. Optionally reset database
sudo mysql -u root -p
DROP DATABASE strapi_db_leqta;
CREATE DATABASE strapi_db_leqta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON strapi_db_leqta.* TO 'strapi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 4. Follow deployment steps from Section 5 onwards
```

---

## Quick Start Summary

```bash
# 1. SSH into VPS
ssh user@your-vps-ip

# 2. Run cleanup (if needed)
./cleanup-vps.sh

# 3. Clone and setup
cd /var/www/leqta
git clone your-repo .

# 4. Setup Strapi
cd my-blog-cms
npm install
# Configure .env
npm run build

# 5. Setup Next.js
cd ../laqta
npm install
# Configure .env.local
npm run build

# 6. Start with PM2
cd ..
pm2 start ecosystem.config.js
pm2 save

# 7. Setup Nginx and SSL
# (follow sections 7 and 8)

# 8. Verify
pm2 status
curl http://localhost:1337/_health
curl http://localhost:3000
```

---

## Security Checklist

- [ ] Changed all default passwords
- [ ] Generated new Strapi security keys (APP_KEYS, JWT secrets, etc.)
- [ ] Configured firewall (UFW)
- [ ] Installed SSL certificates
- [ ] Disabled root SSH login (optional but recommended)
- [ ] Set up fail2ban (optional)
- [ ] Configured database user with minimal privileges
- [ ] Regular backups configured
- [ ] PM2 startup configured for auto-restart

---

**Last Updated**: 2025-11-28
**Tested With**: Node.js 20.x, Strapi 5.31.0, Next.js 15.3.3, PM2 5.x, Ubuntu 22.04 LTS
