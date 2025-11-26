# Ubuntu VPS Deployment Guide (HestiaCP + MariaDB)

This guide covers deploying both the **Laqta Next.js frontend** and **Strapi CMS backend** on an Ubuntu VPS with **HestiaCP** control panel and **MariaDB** database.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Deploy Strapi Backend](#deploy-strapi-backend)
4. [Deploy Next.js Frontend](#deploy-nextjs-frontend)
5. [Configure Nginx Reverse Proxy](#configure-nginx-reverse-proxy)
6. [SSL with Let's Encrypt](#ssl-with-lets-encrypt)
7. [PM2 Management](#pm2-management)
8. [Firewall Configuration](#firewall-configuration)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Ubuntu 20.04+ VPS with **HestiaCP** installed
- **MariaDB** already installed (comes with HestiaCP)
- Domain name pointed to your VPS IP
- SSH access to your server
- GitHub account with access to the repository

---

## Server Setup

### 0. Setup GitHub SSH Key (Recommended for Private Repos)

Generate SSH key on your VPS:

```bash
# Generate a new SSH key using Ed25519 algorithm (more secure than RSA)
# Replace with your GitHub email address
ssh-keygen -t ed25519 -C "sonyexperiasola29@gmail.com"

# Start the SSH agent in the background
# This manages your SSH keys and remembers your passphrase
eval "$(ssh-agent -s)"

# Add your private key to the SSH agent
# This allows git to use the key for authentication
ssh-add ~/.ssh/id_ed25519
```

Copy your public key:

```bash
# Display the public key content
# You'll copy this and add it to GitHub
cat ~/.ssh/id_ed25519.pub
```

Add this key to GitHub:
1. Go to GitHub → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste your public key and save

Test connection:

```bash
# Test SSH connection to GitHub
# Verifies your key is properly configured
ssh -T "sonyexperiasola29@gmail.com"
# Should say: "Hi USERNAME! You've successfully authenticated..."
```

### 1. Update System & Install Dependencies

```bash
# Update package lists from repositories
# && chains commands - runs upgrade only if update succeeds
# -y flag automatically answers "yes" to prompts
sudo apt update && sudo apt upgrade -y

# Install required packages:
# - curl: Tool for transferring data from URLs (needed for Node.js install)
# - git: Version control to clone your repository
# - build-essential: Compilers and libraries needed to build native Node modules
# - nginx: Web server that will act as reverse proxy
sudo apt install -y curl git build-essential nginx
```

### 2. Install Node.js 20.x

```bash
# Download and run NodeSource setup script for Node.js 20.x
# -f: Fail silently on server errors
# -s: Silent mode (no progress bar)
# -S: Show errors if they occur
# -L: Follow redirects
# Pipes (|) the script to bash which executes it
# -E preserves environment variables when using sudo
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js (includes npm) from the newly added repository
sudo apt install -y nodejs
```

Verify installation:

```bash
# Check Node.js version - should show v20.x.x
node -v

# Check npm version - should show v10.x.x
npm -v
```

### 3. Install PM2 (Process Manager)

```bash
# Install PM2 globally (-g flag)
# PM2 keeps your apps running forever, handles restarts on crash,
# and provides monitoring, logging, and load balancing
sudo npm install -g pm2
```

### 4. Configure MariaDB Database (Already installed with HestiaCP)

Since you have HestiaCP installed, MariaDB is already running. You can create a database either through HestiaCP panel or via command line.

#### Option A: Using HestiaCP Panel (Recommended)

1. Log into HestiaCP admin panel (`https://your-server-ip:8083`)
2. Go to **DB** tab
3. Click **Add Database**
4. Fill in:
   - Database name: `strapi`
   - Username: `strapi_user`
   - Password: `your_secure_password`
5. Click **Save**

#### Option B: Using Command Line

```bash
# Log into MariaDB as root
# HestiaCP sets up MariaDB with root access
sudo mysql -u root

# === Inside MariaDB prompt ===

# Create a new database for Strapi
CREATE DATABASE strapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create a new user for Strapi
# 'localhost' restricts connections to local only (more secure)
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'majmajBS13..';

# Grant all permissions on the strapi database to strapi_user
GRANT ALL PRIVILEGES ON strapi.* TO 'strapi_user'@'localhost';

# Reload privilege tables to apply changes immediately
FLUSH PRIVILEGES;

# Exit MariaDB prompt
EXIT;
```

Verify the database was created:

```bash
# List all databases to confirm 'strapi' exists
sudo mysql -u root -e "SHOW DATABASES;"
```

---

## Deploy Strapi Backend

Strapi runs on **port 1337** and must be deployed first since the frontend depends on it.

### 1. Clone Repository from GitHub

```bash
# Navigate to the web directory (standard location for web apps)
cd /var/www

# Create project directory and set ownership to current user
# mkdir: Create directory
# &&: Run next command only if previous succeeds
# chown: Change ownership ($USER:$USER = current user as owner and group)
sudo mkdir laqta-project && sudo chown $USER:$USER laqta-project

# Enter the project directory
cd laqta-project

# Clone the repository from GitHub
# The dot (.) at the end clones into current directory instead of creating subfolder
git clone https://github.com/salahgh/leqta_strapi.git .


```

> **Note**: Replace `YOUR_USERNAME` with your GitHub username. If the repo is private, you'll need to authenticate:
> ```bash
> # Option 1: Use HTTPS with personal access token
> # Replace YOUR_TOKEN with a GitHub personal access token
> git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/leqta_strapi.git .
>
> # Option 2: Use SSH (recommended - requires SSH key setup from step 0)
> git clone git@github.com:YOUR_USERNAME/leqta_strapi.git .
> ```

### 2. Install Dependencies

```bash
# Navigate to the Strapi backend directory
cd my-blog-cms

# Install all packages listed in package.json
# Creates node_modules folder with all dependencies
npm install
```

### 3. Configure Environment Variables

The repository includes a pre-configured `.env.server` file. Simply copy it to `.env`:

```bash
# Copy the server configuration template to .env
# The .env.server file is already configured for MariaDB production
cp .env.server .env

# (Optional) Edit if you need to change database credentials
nano .env
```

The `.env.server` file contains:

```env
# === Server Configuration ===
# HOST=0.0.0.0 allows connections from any IP (needed for reverse proxy)
HOST=0.0.0.0
# Port Strapi will listen on
PORT=1337
# Set to production for optimized performance
NODE_ENV=production

# === Security Keys ===
# These should be unique random strings for security
# Generate with: openssl rand -base64 32
# APP_KEYS: Used for signing session cookies (comma-separated list)
APP_KEYS=key1,key2,key3,key4
# API_TOKEN_SALT: Salt for hashing API tokens
API_TOKEN_SALT=your-api-token-salt
# ADMIN_JWT_SECRET: Secret for admin panel JWT tokens
ADMIN_JWT_SECRET=your-admin-jwt-secret
# TRANSFER_TOKEN_SALT: Salt for data transfer tokens
TRANSFER_TOKEN_SALT=your-transfer-token-salt
# JWT_SECRET: Secret for API JWT tokens
JWT_SECRET=your-jwt-secret

# === Database Configuration (MariaDB) ===
# DATABASE_CLIENT: Using mysql for MariaDB (MariaDB is MySQL-compatible)
DATABASE_CLIENT=mysql
# DATABASE_HOST: Where database is running (localhost = same server)
DATABASE_HOST=localhost
# DATABASE_PORT: MariaDB/MySQL default port
DATABASE_PORT=3306
# DATABASE_NAME: Name of the database we created in HestiaCP or CLI
DATABASE_NAME=strapi
# DATABASE_USERNAME: User we created (HestiaCP adds prefix: admin_strapi_user)
DATABASE_USERNAME=strapi_user
# DATABASE_PASSWORD: Password we set for the database user
DATABASE_PASSWORD=your_secure_password
# DATABASE_SSL: Set to false for local connections
DATABASE_SSL=false

# === Supabase Storage (Optional - for file uploads) ===
# SUPABASE_API_URL: Your Supabase project URL
SUPABASE_API_URL=https://your-project.supabase.co
# SUPABASE_API_KEY: Your Supabase anon/public key
SUPABASE_API_KEY=your-supabase-anon-key
# SUPABASE_BUCKET: Name of storage bucket for uploads
SUPABASE_BUCKET=your-bucket-name
```

> **Note for HestiaCP users**: If you created the database through HestiaCP panel, the username might have a prefix like `admin_strapi_user`. Check the exact username in HestiaCP → DB tab.

> **Tip**: Generate secure random keys using:
> ```bash
> # Generate a 32-byte random string encoded in base64
> openssl rand -base64 32
> ```

### 4. Build Strapi

```bash
# Build the Strapi admin panel and optimize for production
# This compiles the admin UI and prepares the app for deployment
npm run build
```

### 5. Start with PM2

```bash
# Start the application using PM2
# --name "strapi": Assigns a name for easy reference in PM2 commands
# -- run start: Passes "run start" arguments to npm (runs "npm run start")
pm2 start npm --name "strapi" -- run start

# Save the current PM2 process list
# This allows PM2 to restore processes after server reboot
pm2 save
```

### 6. Verify Strapi is Running

```bash
# Send HTTP request to Strapi health endpoint
# curl: Command-line tool for making HTTP requests
# If working, returns: {"status":"ok"}
curl http://localhost:1337/api/health
```

---

## Deploy Next.js Frontend

The frontend runs on **port 3000** (or 3001 in production).

### 1. Navigate to Frontend Directory

```bash
# Navigate to the Next.js frontend directory
cd /var/www/laqta-project/laqta
```

### 2. Install Dependencies

```bash
# Install all packages listed in package.json
npm install
```

### 3. Configure Environment Variables

The repository includes a pre-configured `.env.server` file. Simply copy it to `.env.local`:

```bash
# Copy the server configuration template to .env.local
cp .env.server .env.local
```

The `.env.server` file contains:

```env
# Strapi API URL - starts with localhost, update after SSL setup
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337

# Odoo Integration (already configured)
ODOO_URL=https://sarl-leqta-prod.odoo.com
# ... other Odoo settings
```

> **After SSL Setup**: Update the Strapi URL to use HTTPS:
> ```bash
> nano .env.local
> # Change to: NEXT_PUBLIC_STRAPI_URL_2=https://api.yourdomain.com
> ```

### 4. Build Next.js

```bash
# Create optimized production build
# Compiles React, generates static pages, optimizes assets
# Output goes to .next folder
npm run build
```

### 5. Start with PM2

```bash
# Start Next.js production server with PM2
# --name "laqta": Name for PM2 process management
pm2 start npm --name "laqta" -- run start

# Save PM2 process list for persistence across reboots
pm2 save
```

### 6. Verify Frontend is Running

```bash
# Test if frontend is responding
# Should return HTML content of the homepage
curl http://localhost:3000
```

---

## Configure Nginx Reverse Proxy

Nginx acts as a reverse proxy, routing external traffic on port 80/443 to your internal applications.

> **HestiaCP Note**: HestiaCP manages Nginx configurations differently. You have two options:
> - **Option A**: Create domains in HestiaCP and use custom Nginx templates (recommended for HestiaCP users)
> - **Option B**: Manually create Nginx config (shown below) - works alongside HestiaCP but bypasses its management

### HestiaCP Quick Setup (Option A)

If you prefer using HestiaCP's domain management:

1. In HestiaCP, create a new web domain (e.g., `yourdomain.com`)
2. Create another domain for API (e.g., `api.yourdomain.com`)
3. For each domain, go to **Advanced Options** → **Proxy Template** → Select `Node.js` or create custom template
4. Or manually edit the Nginx config at `/home/YOUR_USER/conf/web/yourdomain.com/nginx.conf`

### Manual Nginx Setup (Option B)

#### 1. Create Nginx Configuration

```bash
# Create new Nginx site configuration file
# sites-available: Directory for all site configs
# sites-enabled: Directory for active site configs (symlinks)
sudo nano /etc/nginx/sites-available/laqta
```

Add the following configuration:

```nginx
# === Strapi Backend API Server Block ===
server {
    # Listen on port 80 (HTTP)
    listen 80;

    # Domain name that triggers this server block
    # Requests to api.yourdomain.com go here
    server_name api.yourdomain.com;

    # Maximum allowed size for file uploads (100 megabytes)
    # Important for Strapi media uploads
    client_max_body_size 100M;

    # All requests to this domain get proxied to Strapi
    location / {
        # Forward requests to Strapi running on port 1337
        proxy_pass http://localhost:1337;

        # Use HTTP/1.1 for proxy connection (required for WebSockets)
        proxy_http_version 1.1;

        # Headers for WebSocket support (used by Strapi admin)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Pass the original host header to Strapi
        proxy_set_header Host $host;

        # Pass the real client IP address
        proxy_set_header X-Real-IP $remote_addr;

        # Pass the chain of proxy IPs
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Tell Strapi if original request was HTTP or HTTPS
        proxy_set_header X-Forwarded-Proto $scheme;

        # Don't cache WebSocket connections
        proxy_cache_bypass $http_upgrade;
    }
}

# === Next.js Frontend Server Block ===
server {
    listen 80;

    # Handle requests for main domain and www subdomain
    server_name yourdomain.com www.yourdomain.com;

    location / {
        # Forward requests to Next.js running on port 3000
        proxy_pass http://localhost:3000;

        # Same proxy headers as above
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

> **Note**: Replace `yourdomain.com` and `api.yourdomain.com` with your actual domain names.

#### 2. Enable the Site

```bash
# Create symbolic link from sites-available to sites-enabled
# ln: Create link
# -s: Make it a symbolic (soft) link
# This "enables" the site by making Nginx aware of it
sudo ln -s /etc/nginx/sites-available/laqta /etc/nginx/sites-enabled/
```

#### 3. Remove Default Site (Optional)

```bash
# Remove the default Nginx welcome page
# Only do this if you don't need the default site
sudo rm /etc/nginx/sites-enabled/default
```

#### 4. Test & Restart Nginx

```bash
# Test Nginx configuration for syntax errors
# Always do this before restarting to avoid downtime
sudo nginx -t

# Restart Nginx to apply new configuration
# systemctl: System service manager
sudo systemctl restart nginx
```

---

## SSL with Let's Encrypt

> **HestiaCP Users**: If you created domains through HestiaCP, you can enable SSL directly from the panel:
> 1. Go to **WEB** tab → Click on your domain
> 2. Check **Enable SSL** and **Let's Encrypt Support**
> 3. Click **Save** - HestiaCP handles everything automatically
>
> If using manual Nginx setup, follow the steps below:

### 1. Install Certbot

```bash
# Install Certbot and its Nginx plugin
# Certbot automates obtaining and renewing SSL certificates
# python3-certbot-nginx: Plugin that automatically configures Nginx
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificates

```bash
# Request SSL certificates for your domains
# --nginx: Use Nginx plugin (auto-configures Nginx)
# -d: Specify domain names (can list multiple)
# Certbot will modify your Nginx config to add HTTPS
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

Follow the prompts:
- Enter email for renewal notifications
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: yes)

### 3. Update Frontend Environment for HTTPS

```bash
# Navigate to frontend directory
cd /var/www/laqta-project/laqta

# Edit environment file
nano .env.local
```

Update the Strapi URL to use HTTPS:

```env
# Now using HTTPS since SSL is configured
# This ensures frontend makes secure API requests
NEXT_PUBLIC_STRAPI_URL_2=https://api.yourdomain.com
```

### 4. Rebuild and Restart Frontend

```bash
# Rebuild to include new environment variable
# Environment variables are embedded at build time in Next.js
npm run build

# Restart the PM2 process to serve new build
pm2 restart laqta
```

### 5. Auto-Renewal (Automatic)

Certbot automatically sets up a cron job for renewal. Test it with:

```bash
# Simulate certificate renewal without actually renewing
# --dry-run: Test mode, doesn't make real changes
# Verifies auto-renewal will work when certificates expire
sudo certbot renew --dry-run
```

---

## PM2 Management

### Enable Auto-Start on Server Reboot

```bash
# Generate startup script for your system
# Outputs a command you need to copy and run
pm2 startup

# Run the command PM2 outputs (will look like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u yourusername --hp /home/yourusername

# Save current process list so PM2 knows what to start on boot
pm2 save
```

### Common Commands

| Action | Command | Explanation |
|--------|---------|-------------|
| View all processes | `pm2 status` | Shows all running apps, CPU/memory usage |
| View logs | `pm2 logs` | Stream logs from all processes |
| View Strapi logs | `pm2 logs strapi` | Stream logs for Strapi only |
| View Frontend logs | `pm2 logs laqta` | Stream logs for frontend only |
| Restart all | `pm2 restart all` | Restart all managed processes |
| Restart Strapi | `pm2 restart strapi` | Restart Strapi process only |
| Restart Frontend | `pm2 restart laqta` | Restart frontend process only |
| Stop all | `pm2 stop all` | Stop all processes (keeps them in PM2 list) |
| Delete all | `pm2 delete all` | Remove all processes from PM2 |
| Monitor resources | `pm2 monit` | Real-time dashboard showing CPU, memory, logs |

---

## Firewall Configuration

> **HestiaCP Note**: HestiaCP uses iptables and manages firewall rules through its **Firewall** tab in the admin panel. You can add/remove rules there. The commands below are for manual UFW setup if preferred.

### Using UFW (Uncomplicated Firewall)

```bash
# Allow SSH connections (port 22)
# IMPORTANT: Do this first to avoid locking yourself out!
sudo ufw allow OpenSSH

# Allow HTTP (80) and HTTPS (443) traffic through Nginx
# 'Nginx Full' is a pre-defined application profile
sudo ufw allow 'Nginx Full'

# Enable the firewall
# Will prompt for confirmation
sudo ufw enable

# Display current firewall rules and status
sudo ufw status
```

---

## Troubleshooting

### Strapi Won't Start

1. Check logs:
   ```bash
   # View last 50 lines of Strapi logs
   # --lines 50: Limit output to 50 lines
   pm2 logs strapi --lines 50
   ```

2. Verify database connection:
   ```bash
   # Test MariaDB connection with strapi user
   # -u: Username
   # -p: Prompt for password
   # -e: Execute SQL command
   mysql -u strapi_user -p -e "SELECT 1" strapi
   ```

3. Check environment variables:
   ```bash
   # Display contents of .env file
   # Verify all required variables are set correctly
   cat /var/www/laqta-project/my-blog-cms/.env
   ```

### Frontend Shows API Errors

1. Verify Strapi is running:
   ```bash
   # Check if Strapi health endpoint responds
   curl http://localhost:1337/api/health
   ```

2. Check environment variable:
   ```bash
   # Verify Strapi URL is correct
   cat /var/www/laqta-project/laqta/.env.local
   ```

3. Rebuild after environment changes:
   ```bash
   cd /var/www/laqta-project/laqta

   # Must rebuild because NEXT_PUBLIC_ vars are embedded at build time
   npm run build

   # Restart to serve new build
   pm2 restart laqta
   ```

### Nginx 502 Bad Gateway

This error means Nginx can't connect to the upstream application.

1. Check if applications are running:
   ```bash
   # Verify both apps show "online" status
   pm2 status
   ```

2. Check Nginx error logs:
   ```bash
   # Stream Nginx error log in real-time
   # -f: Follow mode (shows new lines as they're added)
   sudo tail -f /var/log/nginx/error.log
   ```

3. Restart services:
   ```bash
   # Restart all Node.js apps
   pm2 restart all

   # Restart Nginx
   sudo systemctl restart nginx
   ```

### Permission Issues

```bash
# Fix ownership of project directory
# -R: Recursive (applies to all files/folders inside)
# $USER:$USER: Sets both owner and group to current user
sudo chown -R $USER:$USER /var/www/laqta-project

# Fix npm cache permissions
# Sometimes npm cache gets owned by root
sudo chown -R $USER:$USER ~/.npm
```

### Out of Memory

If builds fail due to memory, add swap space (virtual memory using disk):

```bash
# Create a 2GB file to use as swap
# fallocate: Efficiently allocates file space
# -l 2G: Size of 2 gigabytes
sudo fallocate -l 2G /swapfile

# Set permissions so only root can read/write
# 600: Owner read/write only
sudo chmod 600 /swapfile

# Format the file as swap space
sudo mkswap /swapfile

# Enable the swap file immediately
sudo swapon /swapfile

# Add to /etc/fstab so swap persists after reboot
# tee -a: Append to file with sudo privileges
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Updating the Application

### Pull Latest Changes from GitHub & Redeploy

```bash
# Navigate to project root
cd /var/www/laqta-project

# Pull latest changes from main branch on GitHub
# origin: Default name for remote repository
# main: Branch name
git pull origin main

# === Update Strapi ===
cd my-blog-cms

# Install any new dependencies
npm install

# Rebuild admin panel with any changes
npm run build

# Restart Strapi to apply changes
pm2 restart strapi

# === Update Frontend ===
cd ../laqta

# Install any new dependencies
npm install

# Rebuild frontend with changes
npm run build

# Restart frontend to serve new build
pm2 restart laqta
```

### One-Liner Update Script

Create a deployment script for convenience:

```bash
# Create new script file
nano /var/www/laqta-project/deploy.sh
```

```bash
#!/bin/bash
# Shebang line - tells system to run with bash

# Navigate to project root
cd /var/www/laqta-project

# Pull latest code from GitHub
git pull origin main

echo "Updating Strapi..."
cd my-blog-cms
npm install        # Install dependencies
npm run build      # Build admin panel
pm2 restart strapi # Restart process

echo "Updating Frontend..."
cd ../laqta
npm install        # Install dependencies
npm run build      # Build frontend
pm2 restart laqta  # Restart process

echo "Deployment complete!"
```

Make it executable:

```bash
# Add execute permission to script
# +x: Add executable permission
chmod +x /var/www/laqta-project/deploy.sh
```

Run updates with:

```bash
# Execute the deployment script
/var/www/laqta-project/deploy.sh
```

---

## Quick Reference

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| HestiaCP Panel | 8083 | https://your-server-ip:8083 | Server management dashboard |
| Strapi Admin | 1337 | https://api.yourdomain.com/admin | Content management dashboard |
| Strapi API | 1337 | https://api.yourdomain.com/api | REST API endpoints |
| Next.js Frontend | 3000 | https://yourdomain.com | Public website |
| MariaDB | 3306 | localhost only | Database server |

---

## Security Recommendations

1. **Change default SSH port** and disable password authentication
   ```bash
   # Edit SSH config
   sudo nano /etc/ssh/sshd_config
   # Change: Port 22 → Port 2222 (or another port)
   # Change: PasswordAuthentication yes → PasswordAuthentication no
   sudo systemctl restart sshd
   ```

2. **Keep system updated** regularly:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Use strong passwords** for database and Strapi admin

4. **Enable fail2ban** to prevent brute force attacks:
   ```bash
   # Install fail2ban - automatically bans IPs with failed login attempts
   sudo apt install fail2ban

   # Enable to start on boot
   sudo systemctl enable fail2ban
   ```

5. **Regular backups** of database and uploads:
   ```bash
   # Backup MariaDB database
   # -u: Username
   # -p: Will prompt for password (or use -pYOUR_PASSWORD without space)
   mysqldump -u strapi_user -p strapi > backup_$(date +%Y%m%d).sql

   # Or use HestiaCP's built-in backup system via the panel
   ```

6. **Monitor logs** for suspicious activity:
   ```bash
   # Check authentication logs
   sudo tail -f /var/log/auth.log
   ```
