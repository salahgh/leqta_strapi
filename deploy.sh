#!/bin/bash
#
# Laqta Deployment Script
# Usage: ./deploy.sh
#

set -e

PROJECT_ROOT="/var/www/leqta"
STRAPI_DIR="$PROJECT_ROOT/my-blog-cms"
LAQTA_DIR="$PROJECT_ROOT/laqta"

echo "🚀 Starting deployment..."

# Backup .env files
echo "→ Backing up .env files..."
[ -f "$STRAPI_DIR/.env" ] && cp "$STRAPI_DIR/.env" /tmp/.env.strapi.bak
[ -f "$LAQTA_DIR/.env" ] && cp "$LAQTA_DIR/.env" /tmp/.env.laqta.bak

# Pull latest code
echo "→ Pulling latest code..."
cd "$PROJECT_ROOT"
git fetch origin main
git reset --hard origin/main

# Restore .env files
echo "→ Restoring .env files..."
rm -f "$STRAPI_DIR/.env"* "$LAQTA_DIR/.env"* 2>/dev/null || true
[ -f /tmp/.env.strapi.bak ] && cp /tmp/.env.strapi.bak "$STRAPI_DIR/.env"
[ -f /tmp/.env.laqta.bak ] && cp /tmp/.env.laqta.bak "$LAQTA_DIR/.env"

# Build and start Strapi
echo "→ Building Strapi..."
cd "$STRAPI_DIR"
npm ci --production=false
npm run build

echo "→ Starting Strapi..."
pm2 delete strapi 2>/dev/null || true
pm2 start npm --name "strapi" -- run start

# Wait for Strapi to be healthy
echo "→ Waiting for Strapi..."
until curl -sf "http://localhost:1337/api/health" > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Strapi is healthy"

# Build and start Next.js
echo "→ Building Next.js..."
cd "$LAQTA_DIR"
npm ci --production=false
npm run build

echo "→ Starting Next.js..."
pm2 delete laqta 2>/dev/null || true
pm2 start npm --name "laqta" -- run start

pm2 save

echo "✅ Deployment complete!"
pm2 status
