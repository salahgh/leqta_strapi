# Auto Deployment Guide (Pull-Based)

This guide sets up automatic deployment using a pull-based approach - your VPS pulls changes from GitHub instead of GitHub pushing to your VPS.

**Why pull-based?** Works even when GitHub cannot connect to your VPS (firewall, restricted access, etc.)

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [Quick Setup](#quick-setup-5-minutes)
3. [First Time Server Setup](#first-time-server-setup)
4. [Environment Files (.env)](#environment-files-env)
5. [Backup & Restore](#backup--restore)
6. [Cleanup & Fresh Deploy](#cleanup--fresh-deploy)
7. [Auto-Deploy with Cron](#auto-deploy-with-cron)
8. [All Commands Reference](#all-commands-reference)
9. [Monitoring](#monitoring)
10. [Troubleshooting](#troubleshooting)

---

## How It Works

```
You push to GitHub → Cron job checks for changes → Deploys if needed
```

1. You push code to GitHub as normal
2. A cron job on your VPS checks for changes every few minutes
3. If changes are detected, it automatically deploys only what changed
4. Strapi is always deployed before Next.js (dependency order)
5. `.env` files are automatically backed up and restored during deployment

---

## Quick Setup (5 minutes)

If your server already has the project deployed, just run:

```bash
cd /var/www/laqta-project
git pull origin main
chmod +x deploy.sh

# Setup cron (every 2 minutes)
crontab -e
# Add: */2 * * * * /var/www/laqta-project/deploy.sh --check >> /var/log/laqta-deploy.log 2>&1
```

Done! Continue reading for detailed setup instructions.

---

## First Time Server Setup

### Step 1: Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl git build-essential nginx

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Verify installations
node -v   # Should show v20.x.x
npm -v    # Should show v10.x.x
pm2 -v    # Should show 5.x.x
```

### Step 2: Clone Repository

```bash
# Create project directory
sudo mkdir -p /var/www/laqta-project
sudo chown $USER:$USER /var/www/laqta-project

# Clone the repository
cd /var/www/laqta-project
git clone https://github.com/salahgh/leqta_strapi.git .

# Make deploy script executable
chmod +x deploy.sh

# Create log file
sudo touch /var/log/laqta-deploy.log
sudo chown $USER:$USER /var/log/laqta-deploy.log
```

### Step 3: Configure Environment Files

See [Environment Files (.env)](#environment-files-env) section below.

### Step 4: First Deployment

```bash
# Run full deployment
./deploy.sh

# This will:
# - Backup existing .env files
# - Pull latest code
# - Restore .env files
# - Install dependencies
# - Build both apps
# - Start PM2 processes
# - Run health checks
```

### Step 5: Setup Auto-Deploy

See [Auto-Deploy with Cron](#auto-deploy-with-cron) section below.

---

## Environment Configuration

You have **two options** for managing environment variables:

### Option A: PM2 Ecosystem File (Recommended)

Use a single `ecosystem.production.js` file instead of multiple `.env` files. This is cleaner and easier to manage.

```bash
cd /var/www/laqta-project

# Copy template and edit with your values
cp ecosystem.config.js ecosystem.production.js
nano ecosystem.production.js
```

Edit `ecosystem.production.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: './my-blog-cms',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 1337,

        // Security Keys (generate with: openssl rand -base64 32)
        APP_KEYS: 'your-key-1,your-key-2,your-key-3,your-key-4',
        API_TOKEN_SALT: 'your-api-token-salt',
        ADMIN_JWT_SECRET: 'your-admin-jwt-secret',
        TRANSFER_TOKEN_SALT: 'your-transfer-token-salt',
        JWT_SECRET: 'your-jwt-secret',

        // Database
        DATABASE_CLIENT: 'mysql',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 3306,
        DATABASE_NAME: 'strapi',
        DATABASE_USERNAME: 'strapi_user',
        DATABASE_PASSWORD: 'your_secure_password',
        DATABASE_SSL: 'false',

        // Supabase (optional)
        SUPABASE_API_URL: 'https://your-project.supabase.co',
        SUPABASE_API_KEY: 'your-key',
        SUPABASE_BUCKET: 'your-bucket',
      },
    },
    {
      name: 'laqta',
      cwd: './laqta',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_STRAPI_URL_2: 'http://localhost:1337',
      },
    },
  ],
};
```

**Start with ecosystem file:**
```bash
pm2 start ecosystem.production.js
```

**The deploy script automatically detects and uses `ecosystem.production.js` if it exists.**

---

### Option B: Traditional .env Files

Use separate `.env` files for each project.

| File | Location | Purpose |
|------|----------|---------|
| `.env` | `my-blog-cms/.env` | Strapi configuration |
| `.env.local` | `laqta/.env.local` | Next.js configuration |

```bash
cd /var/www/laqta-project

# Strapi environment
cp my-blog-cms/.env.server my-blog-cms/.env
nano my-blog-cms/.env
```

Edit Strapi `.env`:

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security Keys (generate with: openssl rand -base64 32)
APP_KEYS=your-key-1,your-key-2,your-key-3,your-key-4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database (MariaDB)
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# Supabase Storage (if using)
SUPABASE_API_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-supabase-key
SUPABASE_BUCKET=your-bucket-name
```

```bash
# Next.js environment
cp laqta/.env.server laqta/.env.local
nano laqta/.env.local
```

Edit Next.js `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337
# Or with domain: NEXT_PUBLIC_STRAPI_URL_2=https://api.yourdomain.com
```

### .env Protection During Deployment

The deploy script **automatically protects** your `.env` files:

1. **Before git pull**: Backs up `.env` files to temp location
2. **After git pull**: Restores `.env` files from backup
3. **Never overwrites**: Your production `.env` files are never lost

---

## Backup & Restore

### Backup .env Files

```bash
# Create a timestamped backup
./deploy.sh --backup

# Output:
# ✅ Backed up: my-blog-cms/.env → /var/www/laqta-project/.env-backups/20241128_143022/strapi.env
# ✅ Backed up: laqta/.env.local → /var/www/laqta-project/.env-backups/20241128_143022/laqta.env.local
```

### List All Backups

```bash
./deploy.sh --list-backups

# Output:
# → 20241128_140000
#     - strapi.env
#     - laqta.env.local
# → 20241128_143022
#     - strapi.env
#     - laqta.env.local
# Latest: 20241128_143022
```

### Restore from Latest Backup

```bash
./deploy.sh --restore

# Restores from the most recent backup
```

### Restore from Specific Backup

```bash
# List backups first
./deploy.sh --list-backups

# Restore from specific backup
./deploy.sh --restore 20241128_140000
```

### Backup Location

All backups are stored in:
```
/var/www/laqta-project/.env-backups/
├── 20241128_140000/
│   ├── strapi.env
│   └── laqta.env.local
├── 20241128_143022/
│   ├── strapi.env
│   └── laqta.env.local
└── latest -> 20241128_143022/
```

### Manual Backup (Alternative)

```bash
# Manual backup to custom location
cp /var/www/laqta-project/my-blog-cms/.env ~/strapi-env-backup.env
cp /var/www/laqta-project/laqta/.env.local ~/laqta-env-backup.env
```

---

## Cleanup & Fresh Deploy

Use cleanup when you need a completely fresh deployment (e.g., after major updates, dependency issues, or corrupted builds).

### What Cleanup Does

1. **Stops** PM2 processes (strapi, laqta)
2. **Backs up** `.env` files automatically
3. **Removes**:
   - `node_modules/` (both projects)
   - `.cache/` (Strapi)
   - `build/` and `dist/` (Strapi)
   - `.next/` (Next.js)
   - `package-lock.json` (both projects)
4. **Clears** npm cache

### Run Cleanup

```bash
./deploy.sh --clean

# Output:
# 🧹 Cleaning up for fresh deployment
# → Stopping PM2 processes...
# ✅ PM2 processes stopped
# → Backing up .env files before cleanup...
# ✅ Backup completed!
# → Cleaning Strapi (my-blog-cms)...
#    ✓ Removed node_modules
#    ✓ Removed .cache
#    ✓ Removed build
# → Cleaning Next.js (laqta)...
#    ✓ Removed node_modules
#    ✓ Removed .next
# → Clearing npm cache...
# ✅ npm cache cleared
# ✅ Cleanup completed!
#
# Next steps:
#   1. Run './deploy.sh' to do a fresh deployment
#   2. .env files are backed up at: /var/www/laqta-project/.env-backups/latest
```

### After Cleanup: Fresh Deploy

```bash
# Full fresh deployment
./deploy.sh

# This will:
# - Pull latest code
# - Restore .env files
# - npm install (fresh)
# - Build both apps
# - Start PM2 processes
```

### When to Use Cleanup

- After upgrading Node.js version
- When `npm install` has persistent errors
- After major dependency updates
- When builds are corrupted
- To resolve "works on my machine" issues

---

## Auto-Deploy with Cron

### Setup Cron Job

```bash
# Open crontab editor
crontab -e

# Add one of these lines:
```

### Cron Options

| Interval | Cron Expression | Use Case |
|----------|-----------------|----------|
| Every 1 minute | `* * * * *` | Fastest, more CPU usage |
| Every 2 minutes | `*/2 * * * *` | **Recommended** |
| Every 5 minutes | `*/5 * * * *` | Balanced |
| Every 10 minutes | `*/10 * * * *` | Lower resource usage |

### Recommended Cron Entry

```bash
*/2 * * * * /var/www/laqta-project/deploy.sh --check >> /var/log/laqta-deploy.log 2>&1
```

### Verify Cron is Running

```bash
# List current cron jobs
crontab -l

# Check cron service status
sudo systemctl status cron

# Watch cron execution in real-time
grep CRON /var/log/syslog | tail -20
```

### Disable Auto-Deploy

```bash
# Edit crontab
crontab -e

# Comment out or delete the deploy line
# */2 * * * * /var/www/laqta-project/deploy.sh --check ...

# Or remove all cron jobs (careful!)
crontab -r
```

---

## All Commands Reference

### Deployment Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh` | Full deploy (both apps) |
| `./deploy.sh all` | Full deploy (both apps) |
| `./deploy.sh strapi` | Deploy Strapi CMS only |
| `./deploy.sh laqta` | Deploy Next.js only |
| `./deploy.sh --check` | Smart deploy (only if changes) - for cron |

### Maintenance Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh --clean` | Cleanup for fresh deploy |
| `./deploy.sh --status` | Show current status |

### Backup Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh --backup` | Backup .env files |
| `./deploy.sh --restore` | Restore from latest backup |
| `./deploy.sh --restore TIMESTAMP` | Restore from specific backup |
| `./deploy.sh --list-backups` | List all backups |

### Help

```bash
./deploy.sh --help
```

---

## Monitoring

### View Deployment Logs

```bash
# Real-time log monitoring
tail -f /var/log/laqta-deploy.log

# Last 50 lines
tail -50 /var/log/laqta-deploy.log

# Search for errors
grep -i "error\|fail\|❌" /var/log/laqta-deploy.log

# Search for successful deployments
grep "🎉" /var/log/laqta-deploy.log
```

### Check Application Status

```bash
# Quick status check
./deploy.sh --status

# PM2 status
pm2 status

# PM2 logs (all apps)
pm2 logs

# PM2 logs (specific app)
pm2 logs strapi --lines 50
pm2 logs laqta --lines 50

# PM2 monitoring dashboard
pm2 monit
```

### Health Check URLs

| Service | URL | Expected Response |
|---------|-----|-------------------|
| Strapi API | http://localhost:1337/api/health | `{"status":"ok"}` |
| Next.js | http://localhost:3000 | HTML page |

### Manual Health Check

```bash
# Strapi
curl http://localhost:1337/api/health

# Next.js
curl -I http://localhost:3000
```

---

## Troubleshooting

### Deployment Not Running (Cron)

```bash
# Check if cron service is running
sudo systemctl status cron

# Check cron logs
grep CRON /var/log/syslog | tail -20

# Test script manually
/var/www/laqta-project/deploy.sh --check
```

### Permission Errors

```bash
# Fix project ownership
sudo chown -R $USER:$USER /var/www/laqta-project

# Fix script permissions
chmod +x /var/www/laqta-project/deploy.sh

# Fix log file permissions
sudo chown $USER:$USER /var/log/laqta-deploy.log
```

### Git Authentication Issues

```bash
# Check SSH key
ssh -T git@github.com

# If using HTTPS, cache credentials
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=3600'
```

### Build Failures

```bash
# Check Node.js version (should be 20.x)
node -v

# Clean and fresh deploy
./deploy.sh --clean
./deploy.sh
```

### PM2 Issues

```bash
# Restart all processes
pm2 restart all

# Delete and recreate processes
pm2 delete all
./deploy.sh

# Check PM2 logs
pm2 logs --lines 100

# Reset PM2
pm2 kill
pm2 start npm --name "strapi" -- run start --cwd /var/www/laqta-project/my-blog-cms
pm2 start npm --name "laqta" -- run start --cwd /var/www/laqta-project/laqta
pm2 save
```

### .env File Issues

```bash
# Check if .env files exist
./deploy.sh --status

# Restore from backup
./deploy.sh --list-backups
./deploy.sh --restore

# Or restore from .env.server templates
cp my-blog-cms/.env.server my-blog-cms/.env
cp laqta/.env.server laqta/.env.local
nano my-blog-cms/.env       # Edit with your values
nano laqta/.env.local       # Edit with your values
```

### Out of Memory During Build

```bash
# Add swap space (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Or increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=2048"
./deploy.sh
```

---

## Log Rotation (Recommended)

Prevent log file from growing too large:

```bash
sudo nano /etc/logrotate.d/laqta-deploy
```

Add:

```
/var/log/laqta-deploy.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 your_username your_username
}
```

Replace `your_username` with your actual username.

---

## Security Notes

1. **SSH Keys** - Use SSH keys for GitHub authentication
2. **File Permissions** - Keep `.env` files secure: `chmod 600 my-blog-cms/.env laqta/.env.local`
3. **Backups** - Regularly backup `.env` files: `./deploy.sh --backup`
4. **Log Files** - Don't expose log files publicly
5. **Updates** - Keep Node.js and system packages updated

---

## Quick Reference Card

```bash
# === DEPLOYMENT ===
./deploy.sh              # Deploy all
./deploy.sh strapi       # Deploy Strapi
./deploy.sh laqta        # Deploy Next.js
./deploy.sh --check      # Smart deploy (cron)

# === MAINTENANCE ===
./deploy.sh --status     # Check status
./deploy.sh --clean      # Fresh deploy prep

# === BACKUP/RESTORE ===
./deploy.sh --backup     # Backup .env
./deploy.sh --restore    # Restore .env
./deploy.sh --list-backups

# === MONITORING ===
tail -f /var/log/laqta-deploy.log
pm2 status
pm2 logs
```
