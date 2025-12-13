#!/bin/bash
#
# Laqta Initial Server Setup Script
# Run this ONCE on a fresh server to set up the project
#
# Usage: curl -sL https://raw.githubusercontent.com/salahgh/leqta_strapi/main/scripts/setup.sh | bash
#    Or: ./setup.sh
#

set -e

# Configuration
PROJECT_ROOT="/var/www/leqta"
REPO_URL="https://github.com/salahgh/leqta_strapi.git"
NODE_VERSION="20"

echo "=============================================="
echo "  Laqta Server Setup Script"
echo "=============================================="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or with sudo"
    exit 1
fi

# Step 1: Update system
echo "→ Step 1: Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install dependencies
echo "→ Step 2: Installing dependencies..."
apt install -y curl git build-essential

# Step 3: Install Node.js
echo "→ Step 3: Installing Node.js $NODE_VERSION..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
fi
echo "   Node version: $(node -v)"
echo "   NPM version: $(npm -v)"

# Step 4: Install PM2
echo "→ Step 4: Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root

# Step 5: Clean and prepare directory
echo "→ Step 5: Preparing project directory..."
if [ -d "$PROJECT_ROOT" ]; then
    echo "   Backing up existing directory..."
    mv "$PROJECT_ROOT" "${PROJECT_ROOT}.backup.$(date +%Y%m%d_%H%M%S)"
fi
mkdir -p /var/www

# Step 6: Clone repository
echo "→ Step 6: Cloning repository..."
cd /var/www
git clone "$REPO_URL" leqta
cd "$PROJECT_ROOT"

# Step 7: Create environment files
echo "→ Step 7: Creating environment files..."

# Strapi .env
cat > "$PROJECT_ROOT/my-blog-cms/.env" << 'STRAPI_ENV'
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security Keys - CHANGE THESE!
# Generate with: openssl rand -base64 32
APP_KEYS=CHANGE_ME_KEY1,CHANGE_ME_KEY2,CHANGE_ME_KEY3,CHANGE_ME_KEY4
API_TOKEN_SALT=CHANGE_ME_API_TOKEN_SALT
ADMIN_JWT_SECRET=CHANGE_ME_ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT=CHANGE_ME_TRANSFER_TOKEN_SALT
JWT_SECRET=CHANGE_ME_JWT_SECRET

# Database (MariaDB/MySQL)
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=CHANGE_ME_DB_PASSWORD
DATABASE_SSL=false

# Supabase Storage (optional)
# SUPABASE_API_URL=https://your-project.supabase.co
# SUPABASE_API_KEY=your-supabase-key
# SUPABASE_BUCKET=your-bucket-name
STRAPI_ENV

# Next.js .env
cat > "$PROJECT_ROOT/laqta/.env" << 'NEXTJS_ENV'
NODE_ENV=production
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1337
NEXTJS_ENV

echo ""
echo "=============================================="
echo "  Setup Complete!"
echo "=============================================="
echo ""
echo "IMPORTANT: Before deploying, you must:"
echo ""
echo "1. Edit Strapi environment file:"
echo "   nano $PROJECT_ROOT/my-blog-cms/.env"
echo "   - Change all CHANGE_ME values"
echo "   - Set your database credentials"
echo "   - Generate security keys with: openssl rand -base64 32"
echo ""
echo "2. Edit Next.js environment file:"
echo "   nano $PROJECT_ROOT/laqta/.env"
echo "   - Update NEXT_PUBLIC_STRAPI_URL_2 if using a domain"
echo ""
echo "3. Set up your database:"
echo "   mysql -u root -p"
echo "   CREATE DATABASE strapi_db;"
echo "   CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'your_password';"
echo "   GRANT ALL PRIVILEGES ON strapi_db.* TO 'strapi_user'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo ""
echo "4. Run the deployment:"
echo "   cd $PROJECT_ROOT"
echo "   chmod +x scripts/deploy.sh"
echo "   ./scripts/deploy.sh"
echo ""
echo "=============================================="
