#!/bin/bash
#
# Laqta Staging Environment Setup
# One-time initialization script for the staging environment
#
# Usage: bash setup-staging.sh
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
REPO_URL="git@github.com:salahgh/leqta_strapi.git"
BRANCH="develop"

echo "=============================================="
echo "  Laqta Staging Environment Setup"
echo "=============================================="
echo ""

# Check if staging directory already exists
if [ -d "$STAGING_ROOT" ]; then
    echo "ERROR: Staging directory already exists at $STAGING_ROOT"
    echo "Remove it first if you want to reinitialize:"
    echo "  rm -rf $STAGING_ROOT"
    exit 1
fi

# Clone repository
echo "→ Cloning repository to $STAGING_ROOT..."
sudo mkdir -p "$STAGING_ROOT"
sudo chown saleh:saleh "$STAGING_ROOT"
git clone "$REPO_URL" "$STAGING_ROOT"

# Checkout develop branch
echo "→ Checking out $BRANCH branch..."
cd "$STAGING_ROOT"
git checkout "$BRANCH"

# Create Strapi .env file
echo "→ Creating Strapi .env template..."
cat > "$STAGING_ROOT/my-blog-cms/.env" << 'EOF'
# ===========================================
# STAGING SERVER CONFIGURATION (Strapi)
# ===========================================
# IMPORTANT: Edit this file with your real credentials

# Server Configuration
HOST=0.0.0.0
PORT=1338
NODE_ENV=production

# Security Keys (copy from production or generate new ones)
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
ENCRYPTION_KEY=

# ===========================================
# MariaDB Database Configuration (shared with production)
# ===========================================
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=mariadb_user_strapi
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_SSL=false

# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000
EOF

# Create Next.js .env file
echo "→ Creating Next.js .env template..."
cat > "$STAGING_ROOT/laqta/.env" << 'EOF'
# ===========================================
# STAGING SERVER CONFIGURATION (Frontend)
# ===========================================

# Strapi API URL
NEXT_PUBLIC_STRAPI_URL_2=http://localhost:1338

# Odoo Integration (copy from production if needed)
ODOO_URL=
ODOO_DB=
ODOO_API_KEY=
ODOO_USERNAME=

# Server Port
PORT=3003
EOF

echo ""
echo "=============================================="
echo "  Staging Environment Created!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "  1. Edit Strapi env:    nano $STAGING_ROOT/my-blog-cms/.env"
echo "     - Add APP_KEYS, JWT secrets, ENCRYPTION_KEY, database credentials"
echo "  2. Edit Next.js env:   nano $STAGING_ROOT/laqta/.env"
echo "     - Verify STRAPI_URL points to port 1338"
echo "  3. Deploy staging:     cd $STAGING_ROOT && bash scripts/deploy-staging.sh"
echo ""
echo "Staging will use:"
echo "  - Strapi on port 1338 (PM2: strapi-staging)"
echo "  - Next.js on port 3003 (PM2: laqta-staging)"
echo "  - Shared database: strapi_db"
echo ""
