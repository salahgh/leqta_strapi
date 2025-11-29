#!/bin/bash

# ============================================
# CLEAN START SCRIPT
# This script cleans everything and starts fresh
# ============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}  CLEAN START - Full Reset & Deployment${NC}"
echo -e "${YELLOW}============================================${NC}"

# Get the script's directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "\n${GREEN}[1/8] Stopping and removing PM2 processes...${NC}"
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 save --force 2>/dev/null || true
echo "PM2 processes cleared."

echo -e "\n${GREEN}[2/8] Pulling latest code from GitHub...${NC}"
git fetch origin
git reset --hard origin/main
git pull
echo "Code updated."

echo -e "\n${GREEN}[3/8] Cleaning Strapi (my-blog-cms)...${NC}"
cd "$SCRIPT_DIR/my-blog-cms"
rm -rf node_modules
rm -rf .cache
rm -rf .tmp
rm -rf dist
rm -rf build
echo "Strapi cleaned."

echo -e "\n${GREEN}[4/8] Installing Strapi dependencies...${NC}"
npm install
echo "Strapi dependencies installed."

echo -e "\n${GREEN}[5/8] Building Strapi admin panel...${NC}"
npm run build
echo "Strapi built."

echo -e "\n${GREEN}[6/8] Cleaning Next.js (laqta)...${NC}"
cd "$SCRIPT_DIR/laqta"
rm -rf node_modules
rm -rf .next
rm -rf out
echo "Next.js cleaned."

echo -e "\n${GREEN}[7/8] Installing Next.js dependencies...${NC}"
npm install
echo "Next.js dependencies installed."

echo -e "\n${GREEN}[8/8] Building Next.js...${NC}"
npm run build
echo "Next.js built."

# Return to project root
cd "$SCRIPT_DIR"

# Check if ecosystem.production.config.js exists
if [ ! -f "ecosystem.production.config.js" ]; then
    echo -e "\n${RED}WARNING: ecosystem.production.config.js not found!${NC}"
    echo -e "Creating template file. ${YELLOW}You MUST edit it with your production values.${NC}"

    cat > ecosystem.production.config.js << 'EOFCONFIG'
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: './my-blog-cms',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        HOST: '0.0.0.0',
        PORT: 1337,
        NODE_ENV: 'production',

        // Security Keys - CHANGE THESE!
        APP_KEYS: 'CHANGE_ME_1,CHANGE_ME_2,CHANGE_ME_3,CHANGE_ME_4',
        API_TOKEN_SALT: 'CHANGE_ME',
        ADMIN_JWT_SECRET: 'CHANGE_ME',
        TRANSFER_TOKEN_SALT: 'CHANGE_ME',
        JWT_SECRET: 'CHANGE_ME',

        // MariaDB
        DATABASE_CLIENT: 'mysql',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 3306,
        DATABASE_NAME: 'your_database_name',
        DATABASE_USERNAME: 'your_username',
        DATABASE_PASSWORD: 'your_password',
        DATABASE_SSL: 'false',

        // Supabase (optional)
        SUPABASE_API_URL: '',
        SUPABASE_API_KEY: '',
        SUPABASE_BUCKET: '',
      },
    },
    {
      name: 'laqta',
      cwd: './laqta',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_STRAPI_URL_2: 'http://localhost:1337',
      },
    },
  ],
};
EOFCONFIG

    echo -e "${YELLOW}Please edit ecosystem.production.config.js before starting:${NC}"
    echo "  nano ecosystem.production.config.js"
    exit 1
fi

echo -e "\n${GREEN}Starting applications with PM2...${NC}"

# Start Strapi
echo "Starting Strapi..."
pm2 start ecosystem.production.config.js --only strapi

# Wait for Strapi to initialize
echo "Waiting 15 seconds for Strapi to initialize..."
sleep 15

# Start Next.js
echo "Starting Next.js (laqta)..."
pm2 start ecosystem.production.config.js --only laqta

# Save PM2 configuration
pm2 save

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}  DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}============================================${NC}"

# Show status
pm2 status

echo -e "\n${YELLOW}Useful commands:${NC}"
echo "  pm2 logs              - View all logs"
echo "  pm2 logs strapi       - View Strapi logs"
echo "  pm2 logs laqta        - View Next.js logs"
echo "  pm2 status            - View process status"
echo "  pm2 restart all       - Restart all processes"

echo -e "\n${YELLOW}Health check endpoints:${NC}"
echo "  curl http://localhost:1337/api/health"
echo "  curl http://localhost:3000/api/health"
