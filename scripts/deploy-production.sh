#!/bin/bash
#
# Laqta Production Deployment Script
# Deploys main branch to /var/www/leqta
#
# Usage: ./deploy-production.sh [--skip-build]
#
# Options:
#   --skip-build    Skip npm install and build steps (faster redeploy)
#

set -e

# Configuration
PROJECT_ROOT="/var/www/leqta"
BRANCH="main"
STRAPI_DIR="$PROJECT_ROOT/my-blog-cms"
LAQTA_DIR="$PROJECT_ROOT/laqta"
PM2_STRAPI="strapi"
PM2_LAQTA="laqta"
STRAPI_PORT=1337
LAQTA_PORT=3000
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
echo "  Laqta PRODUCTION Deployment"
echo "=============================================="
echo "  Project Root: $PROJECT_ROOT"
echo "  Branch:       $BRANCH"
echo "  Strapi PM2:   $PM2_STRAPI (port $STRAPI_PORT)"
echo "  Laqta PM2:    $PM2_LAQTA (port $LAQTA_PORT)"
echo "  Skip Build:   $SKIP_BUILD"
echo "=============================================="
echo ""

# Check if project exists
if [ ! -d "$PROJECT_ROOT" ]; then
    echo "ERROR: Project directory not found at $PROJECT_ROOT"
    echo "Clone the repository first."
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
cp "$STRAPI_DIR/.env" /tmp/.env.strapi-prod.bak
cp "$LAQTA_DIR/.env" /tmp/.env.laqta-prod.bak

# Pull latest code
echo "→ Pulling latest code from $BRANCH..."
cd "$PROJECT_ROOT"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# Restore .env files
echo "→ Restoring .env files..."
cp /tmp/.env.strapi-prod.bak "$STRAPI_DIR/.env"
cp /tmp/.env.laqta-prod.bak "$LAQTA_DIR/.env"

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
pm2 delete "$PM2_STRAPI" 2>/dev/null || true
pm2 start npm --name "$PM2_STRAPI" -- run start

# Wait for Strapi to be ready
echo "  Waiting for Strapi to be healthy..."
MAX_RETRIES=30
RETRY_COUNT=0
until curl -sf "http://localhost:$STRAPI_PORT/_health" > /dev/null 2>&1 || curl -sf "http://localhost:$STRAPI_PORT/admin" > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "  WARNING: Strapi health check timed out, continuing anyway..."
        break
    fi
    echo "  Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 3
done
echo "  Strapi is running on port $STRAPI_PORT"

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
pm2 delete "$PM2_LAQTA" 2>/dev/null || true
pm2 start npm --name "$PM2_LAQTA" -- run start

# Wait for Next.js to be ready
echo "  Waiting for Next.js to be healthy..."
MAX_RETRIES=20
RETRY_COUNT=0
until curl -sf "http://localhost:$LAQTA_PORT" > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "  WARNING: Next.js health check timed out, continuing anyway..."
        break
    fi
    echo "  Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 3
done
echo "  Next.js is running on port $LAQTA_PORT"

# Save PM2 configuration
echo ""
echo "→ Saving PM2 configuration..."
pm2 save

# ==========================================
# Summary
# ==========================================
echo ""
echo "=============================================="
echo "  PRODUCTION Deployment Complete!"
echo "=============================================="
echo ""
echo "Services status:"
pm2 status
echo ""
echo "URLs:"
echo "  Strapi Admin: http://localhost:$STRAPI_PORT/admin"
echo "  Next.js Site: http://localhost:$LAQTA_PORT"
echo ""
