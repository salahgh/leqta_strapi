#!/bin/bash
#
# Laqta STAGING Deployment Script
# Deploys both Strapi CMS and Next.js frontend from the 'staging' branch
#
# Usage: ./scripts/deploy-staging.sh [--skip-build] [--strapi-only] [--laqta-only]
#
# Options:
#   --skip-build    Skip npm install and build steps (faster redeploy)
#   --strapi-only   Deploy only Strapi CMS
#   --laqta-only    Deploy only Next.js frontend
#
# Prerequisites:
#   1. Clone repo to /var/www/leqta-staging and checkout staging branch
#   2. Create .env files:
#      - /var/www/leqta-staging/my-blog-cms/.env (Strapi config, PORT=1338)
#      - /var/www/leqta-staging/laqta/.env.local (NEXT_PUBLIC_STRAPI_URL_2=https://staging-api.leqta.com)
#   3. PM2 installed globally: npm install -g pm2
#   4. Nginx configured to proxy staging.leqta.com -> port 3001, staging-api.leqta.com -> port 1338
#

set -e

# ==========================================
# Configuration
# ==========================================
PROJECT_ROOT="/var/www/leqta-staging"
STRAPI_DIR="$PROJECT_ROOT/my-blog-cms"
LAQTA_DIR="$PROJECT_ROOT/laqta"
BRANCH="staging"
STRAPI_PORT=1338
STRAPI_PM2_NAME="strapi-staging"
LAQTA_PM2_NAME="laqta-staging"
BACKUP_DIR="/tmp/leqta-staging-env-backup"

SKIP_BUILD=false
STRAPI_ONLY=false
LAQTA_ONLY=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --skip-build)  SKIP_BUILD=true ;;
        --strapi-only) STRAPI_ONLY=true ;;
        --laqta-only)  LAQTA_ONLY=true ;;
    esac
done

echo "=============================================="
echo "  Laqta STAGING Deployment"
echo "=============================================="
echo "  Project Root : $PROJECT_ROOT"
echo "  Branch       : $BRANCH"
echo "  Skip Build   : $SKIP_BUILD"
echo "=============================================="
echo ""

# ==========================================
# Pre-flight checks
# ==========================================
if [ ! -d "$PROJECT_ROOT" ]; then
    echo "ERROR: Project directory not found at $PROJECT_ROOT"
    exit 1
fi

# ==========================================
# Backup .env files
# ==========================================
echo "-> Backing up .env files..."
mkdir -p "$BACKUP_DIR"
[ -f "$STRAPI_DIR/.env" ] && cp "$STRAPI_DIR/.env" "$BACKUP_DIR/.env.strapi.bak"
[ -f "$LAQTA_DIR/.env" ] && cp "$LAQTA_DIR/.env" "$BACKUP_DIR/.env.laqta.bak"
[ -f "$LAQTA_DIR/.env.local" ] && cp "$LAQTA_DIR/.env.local" "$BACKUP_DIR/.env.local.laqta.bak"

# ==========================================
# Pull latest code
# ==========================================
echo "-> Pulling latest code from '$BRANCH'..."
cd "$PROJECT_ROOT"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# ==========================================
# Restore .env files
# ==========================================
echo "-> Restoring .env files..."
[ -f "$BACKUP_DIR/.env.strapi.bak" ] && cp "$BACKUP_DIR/.env.strapi.bak" "$STRAPI_DIR/.env"
[ -f "$BACKUP_DIR/.env.laqta.bak" ] && cp "$BACKUP_DIR/.env.laqta.bak" "$LAQTA_DIR/.env"
[ -f "$BACKUP_DIR/.env.local.laqta.bak" ] && cp "$BACKUP_DIR/.env.local.laqta.bak" "$LAQTA_DIR/.env.local"

# ==========================================
# Deploy Strapi
# ==========================================
if [ "$LAQTA_ONLY" = false ]; then
    echo ""
    echo "-> Deploying Strapi CMS (staging)..."
    cd "$STRAPI_DIR"

    if [ "$SKIP_BUILD" = false ]; then
        echo "  Installing dependencies..."
        npm install

        echo "  Building Strapi..."
        npm run build
    fi

    echo "  Starting Strapi with PM2..."
    pm2 delete "$STRAPI_PM2_NAME" 2>/dev/null || true
    pm2 start npm --name "$STRAPI_PM2_NAME" -- run start

    # Health check
    echo "  Waiting for Strapi to be healthy..."
    MAX_RETRIES=30
    RETRY_COUNT=0
    until curl -sf "http://localhost:$STRAPI_PORT/_health" > /dev/null 2>&1 || \
          curl -sf "http://localhost:$STRAPI_PORT/admin" > /dev/null 2>&1; do
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
            echo "  WARNING: Strapi health check timed out, continuing anyway..."
            break
        fi
        echo "  Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
        sleep 3
    done
    echo "  Strapi staging is running"
fi

# ==========================================
# Deploy Next.js
# ==========================================
if [ "$STRAPI_ONLY" = false ]; then
    echo ""
    echo "-> Deploying Next.js frontend (staging)..."
    cd "$LAQTA_DIR"

    if [ "$SKIP_BUILD" = false ]; then
        echo "  Installing dependencies..."
        npm install

        echo "  Building Next.js..."
        npm run build
    fi

    echo "  Starting Next.js with PM2..."
    pm2 delete "$LAQTA_PM2_NAME" 2>/dev/null || true
    pm2 start npm --name "$LAQTA_PM2_NAME" -- run start
fi

# ==========================================
# Finalize
# ==========================================
echo ""
echo "-> Saving PM2 configuration..."
pm2 save

echo ""
echo "=============================================="
echo "  STAGING Deployment Complete!"
echo "=============================================="
echo ""
echo "Services status:"
pm2 status
echo ""
echo "URLs:"
echo "  Frontend: https://staging.leqta.com"
echo "  Strapi:   https://staging-api.leqta.com/admin"
echo ""
echo "Logs:"
echo "  pm2 logs $STRAPI_PM2_NAME"
echo "  pm2 logs $LAQTA_PM2_NAME"
echo ""
