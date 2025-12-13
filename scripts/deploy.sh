#!/bin/bash
#
# Laqta Deployment Script
# Deploys both Strapi CMS and Next.js frontend using PM2
#
# Usage: ./deploy.sh [--skip-build]
#
# Options:
#   --skip-build    Skip npm install and build steps (faster redeploy)
#

set -e

# Configuration
PROJECT_ROOT="/var/www/leqta"
STRAPI_DIR="$PROJECT_ROOT/my-blog-cms"
LAQTA_DIR="$PROJECT_ROOT/laqta"
SKIP_BUILD=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
    esac
done

echo "=============================================="
echo "  Laqta Deployment Script"
echo "=============================================="
echo "  Project Root: $PROJECT_ROOT"
echo "  Skip Build: $SKIP_BUILD"
echo "=============================================="
echo ""

# Check if project exists
if [ ! -d "$PROJECT_ROOT" ]; then
    echo "ERROR: Project directory not found at $PROJECT_ROOT"
    echo "Run setup.sh first to initialize the server."
    exit 1
fi

# Check for .env files
if [ ! -f "$STRAPI_DIR/.env" ]; then
    echo "ERROR: Strapi .env file not found at $STRAPI_DIR/.env"
    echo "Create it with your production configuration."
    exit 1
fi

if [ ! -f "$LAQTA_DIR/.env" ]; then
    echo "ERROR: Next.js .env file not found at $LAQTA_DIR/.env"
    echo "Create it with your production configuration."
    exit 1
fi

# Backup .env files before git pull
echo "→ Backing up .env files..."
cp "$STRAPI_DIR/.env" /tmp/.env.strapi.bak
cp "$LAQTA_DIR/.env" /tmp/.env.laqta.bak

# Pull latest code
echo "→ Pulling latest code from GitHub..."
cd "$PROJECT_ROOT"
git fetch origin main
git reset --hard origin/main

# Restore .env files (git pull may have removed them)
echo "→ Restoring .env files..."
cp /tmp/.env.strapi.bak "$STRAPI_DIR/.env"
cp /tmp/.env.laqta.bak "$LAQTA_DIR/.env"

# ==========================================
# Deploy Strapi
# ==========================================
echo ""
echo "→ Deploying Strapi CMS..."
cd "$STRAPI_DIR"

if [ "$SKIP_BUILD" = false ]; then
    echo "  Installing dependencies..."
    npm install

    echo "  Building Strapi..."
    npm run build
fi

echo "  Starting Strapi with PM2..."
pm2 delete strapi 2>/dev/null || true
pm2 start npm --name "strapi" -- run start

# Wait for Strapi to be ready
echo "  Waiting for Strapi to be healthy..."
MAX_RETRIES=30
RETRY_COUNT=0
until curl -sf "http://localhost:1337/_health" > /dev/null 2>&1 || curl -sf "http://localhost:1337/admin" > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "  WARNING: Strapi health check timed out, continuing anyway..."
        break
    fi
    echo "  Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 3
done
echo "  ✅ Strapi is running"

# ==========================================
# Deploy Next.js (Laqta)
# ==========================================
echo ""
echo "→ Deploying Next.js frontend..."
cd "$LAQTA_DIR"

if [ "$SKIP_BUILD" = false ]; then
    echo "  Installing dependencies..."
    npm install

    echo "  Building Next.js..."
    npm run build
fi

echo "  Starting Next.js with PM2..."
pm2 delete laqta 2>/dev/null || true
pm2 start npm --name "laqta" -- run start

# Save PM2 configuration
echo ""
echo "→ Saving PM2 configuration..."
pm2 save

# ==========================================
# Summary
# ==========================================
echo ""
echo "=============================================="
echo "  ✅ Deployment Complete!"
echo "=============================================="
echo ""
echo "Services status:"
pm2 status
echo ""
echo "Useful commands:"
echo "  pm2 logs              - View all logs"
echo "  pm2 logs strapi       - View Strapi logs"
echo "  pm2 logs laqta        - View Next.js logs"
echo "  pm2 restart all       - Restart all services"
echo "  pm2 monit             - Monitor processes"
echo ""
echo "URLs:"
echo "  Strapi Admin: http://your-server:1337/admin"
echo "  Next.js Site: http://your-server:3000"
echo ""
