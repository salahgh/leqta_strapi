# Server Deployment Guide

This guide covers deploying Laqta (Next.js frontend + Strapi CMS) to a fresh Ubuntu/Debian server.

## Prerequisites

- Ubuntu 20.04+ or Debian 11+ server
- Root or sudo access
- Domain pointed to your server (optional but recommended)
- MariaDB/MySQL database server installed

## Quick Start

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Clean /var/www directory
rm -rf /var/www/*

# 3. Clone the repository
cd /var/www
git clone https://github.com/salahgh/leqta_strapi.git leqta

# 4. Run setup (installs Node.js, PM2, creates .env templates)
cd /var/www/leqta
chmod +x scripts/setup.sh
./scripts/setup.sh

# 5. Configure environment files (see below)
# 6. Run deployment
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## Detailed Steps

### Step 1: Clean the Directory

```bash
# Remove existing files in /var/www
sudo rm -rf /var/www/*

# Or backup first if needed
sudo mv /var/www /var/www.backup.$(date +%Y%m%d)
sudo mkdir -p /var/www
```

### Step 2: Install Prerequisites

If not using setup.sh, install manually:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl git build-essential

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x

# Install PM2 globally
sudo npm install -g pm2

# Configure PM2 to start on boot
pm2 startup systemd -u root --hp /root
```

### Step 3: Clone Repository

```bash
cd /var/www
git clone https://github.com/salahgh/leqta_strapi.git leqta
cd leqta
```

### Step 4: Set Up Database

```bash
# Log into MariaDB/MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE strapi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON strapi_db.* TO 'strapi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Configure Environment Files

#### Strapi (.env)

```bash
nano /var/www/leqta/my-blog-cms/.env
```

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security Keys (generate each with: openssl rand -base64 32)
APP_KEYS=generated_key_1,generated_key_2,generated_key_3,generated_key_4
API_TOKEN_SALT=generated_api_token_salt
ADMIN_JWT_SECRET=generated_admin_jwt_secret
TRANSFER_TOKEN_SALT=generated_transfer_token_salt
JWT_SECRET=generated_jwt_secret

# Database
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# Supabase Storage (if using)
SUPABASE_API_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-supabase-anon-key
SUPABASE_BUCKET=uploads
```

Generate security keys:
```bash
# Run this 5 times and use for APP_KEYS (4) + API_TOKEN_SALT
openssl rand -base64 32
```

#### Next.js (.env)

```bash
nano /var/www/leqta/laqta/.env
```

```env
NODE_ENV=production
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337

# If using a domain for Strapi API:
# NEXT_PUBLIC_STRAPI_URL_2=https://api.yourdomain.com
```

### Step 6: Run Deployment

```bash
cd /var/www/leqta
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

The script will:
1. Pull latest code from GitHub
2. Install dependencies for both projects
3. Build Strapi and Next.js
4. Start both services with PM2

### Step 7: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Test endpoints
curl http://localhost:1337/admin  # Strapi
curl http://localhost:3000        # Next.js
```

---

## Nginx Configuration (Recommended)

For production, use Nginx as a reverse proxy.

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/leqta
```

```nginx
# Strapi API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Next.js Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/leqta /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## Updating the Application

After pushing changes to GitHub:

```bash
cd /var/www/leqta
./scripts/deploy.sh
```

For quick redeployments (no rebuild):
```bash
./scripts/deploy.sh --skip-build
```

---

## PM2 Commands Reference

```bash
# View status
pm2 status

# View logs
pm2 logs              # All logs
pm2 logs strapi       # Strapi only
pm2 logs laqta        # Next.js only

# Restart services
pm2 restart all
pm2 restart strapi
pm2 restart laqta

# Stop services
pm2 stop all

# Monitor resources
pm2 monit

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

---

## Troubleshooting

### Strapi won't start
```bash
# Check logs
pm2 logs strapi --lines 100

# Common issues:
# - Database connection failed: check .env credentials
# - Port already in use: kill existing process
# - Missing dependencies: run npm ci again
```

### Next.js build fails
```bash
# Check logs
pm2 logs laqta --lines 100

# Common issues:
# - Out of memory: increase swap or server RAM
# - Strapi not running: start Strapi first
```

### Permission errors
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/leqta

# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
```

### Database connection issues
```bash
# Test database connection
mysql -u strapi_user -p strapi_db

# Check if MySQL is running
sudo systemctl status mysql
```

---

## Directory Structure After Deployment

```
/var/www/leqta/
├── laqta/                 # Next.js frontend
│   ├── .env               # Frontend environment (create this)
│   ├── .next/             # Build output
│   └── node_modules/
├── my-blog-cms/           # Strapi backend
│   ├── .env               # Backend environment (create this)
│   ├── dist/              # Build output
│   └── node_modules/
├── scripts/
│   ├── setup.sh           # Initial setup script
│   └── deploy.sh          # Deployment script
└── docs/                  # Documentation
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate unique security keys for Strapi
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall (ufw)
- [ ] Disable root SSH login
- [ ] Set up fail2ban
- [ ] Regular backups configured
- [ ] Database access restricted to localhost
