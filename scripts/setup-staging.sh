#!/bin/bash
#
# Laqta Staging Environment Setup
# One-time initialization script for the staging environment
#
# Usage: sudo bash setup-staging.sh
#
# This script:
#   1. Clones the repo to /var/www/leqta-staging
#   2. Checks out the develop branch
#   3. Creates template .env files with staging ports
#
# After running this script, edit the .env files with real credentials
# then run deploy-staging.sh to build and start the services.
#

set -e

# Configuration
STAGING_ROOT="/var/www/leqta-staging"
REPO_URL="https://github.com/AymaneLk/leqta_strapi.git"
BRANCH="develop"

echo "=============================================="
echo "  Laqta Staging Environment Setup"
echo "=============================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: This script must be run as root (sudo)."
    echo "Usage: sudo bash setup-staging.sh"
    exit 1
fi

# Check if staging directory already exists
if [ -d "$STAGING_ROOT" ]; then
    echo "ERROR: Staging directory already exists at $STAGING_ROOT"
    echo "Remove it first if you want to reinitialize:"
    echo "  rm -rf $STAGING_ROOT"
    exit 1
fi

# Clone repository
echo "→ Cloning repository to $STAGING_ROOT..."
git clone "$REPO_URL" "$STAGING_ROOT"

# Checkout develop branch
echo "→ Checking out $BRANCH branch..."
cd "$STAGING_ROOT"
git checkout "$BRANCH"

# Create Strapi .env file
echo "→ Creating Strapi .env template..."
cat > "$STAGING_ROOT/my-blog-cms/.env" << 'EOF'
# Strapi Staging Configuration
# IMPORTANT: Edit this file with your real credentials

HOST=0.0.0.0
PORT=1338

# App Keys (generate unique keys for staging)
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=

# Database (shared with production)
DATABASE_CLIENT=mysql2
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=strapi_db
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_SSL=false

# Supabase Storage
SUPABASE_API_URL=
SUPABASE_API_KEY=
SUPABASE_BUCKET=
EOF

# Create Next.js .env file
echo "→ Creating Next.js .env template..."
cat > "$STAGING_ROOT/laqta/.env" << 'EOF'
# Next.js Staging Configuration
PORT=3001
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1338
EOF

# Set ownership (adjust user as needed)
echo "→ Setting file permissions..."
chown -R www-data:www-data "$STAGING_ROOT"

echo ""
echo "=============================================="
echo "  Staging Environment Created!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "  1. Edit Strapi env:    nano $STAGING_ROOT/my-blog-cms/.env"
echo "     - Add APP_KEYS, JWT secrets, database credentials, Supabase keys"
echo "  2. Edit Next.js env:   nano $STAGING_ROOT/laqta/.env"
echo "     - Verify STRAPI_URL points to port 1338"
echo "  3. Deploy staging:     cd $STAGING_ROOT && bash scripts/deploy-staging.sh"
echo ""
echo "Staging will use:"
echo "  - Strapi on port 1338 (PM2: strapi-staging)"
echo "  - Next.js on port 3001 (PM2: laqta-staging)"
echo "  - Shared database: strapi_db"
echo ""
