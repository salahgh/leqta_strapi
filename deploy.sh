#!/bin/bash
#
# Laqta Project Deployment Script
#
# Usage:
#   ./deploy.sh              # Deploy both (Strapi first, then Next.js)
#   ./deploy.sh strapi       # Deploy Strapi only
#   ./deploy.sh laqta        # Deploy Next.js only
#   ./deploy.sh --check      # Check for changes and deploy if needed
#   ./deploy.sh --clean      # Clean up node_modules, caches, and rebuild
#   ./deploy.sh --backup     # Backup .env files
#   ./deploy.sh --restore    # Restore .env files from backup
#

set -e

# ==========================================
# Configuration
# ==========================================
PROJECT_ROOT="/var/www/laqta-project"
STRAPI_DIR="$PROJECT_ROOT/my-blog-cms"
LAQTA_DIR="$PROJECT_ROOT/laqta"
BACKUP_DIR="$PROJECT_ROOT/.env-backups"
LOG_FILE="/var/log/laqta-deploy.log"
ECOSYSTEM_FILE="$PROJECT_ROOT/ecosystem.production.config.js"
BRANCH="main"

# ==========================================
# Check if using ecosystem file
# ==========================================
using_ecosystem() {
    [ -f "$ECOSYSTEM_FILE" ]
}

# ==========================================
# Helper Functions
# ==========================================
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_section() {
    echo "" | tee -a "$LOG_FILE"
    echo "==========================================" | tee -a "$LOG_FILE"
    echo "$1" | tee -a "$LOG_FILE"
    echo "==========================================" | tee -a "$LOG_FILE"
}

check_health() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1

    log "→ Waiting for $name to be healthy..."
    while [ $attempt -le $max_attempts ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            log "✅ $name is healthy!"
            return 0
        fi
        log "  Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    log "⚠ $name health check failed after $max_attempts attempts"
    return 1
}

# ==========================================
# Backup .env Files
# ==========================================
backup_env() {
    log_section "💾 Backing up .env files"

    TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    BACKUP_SUBDIR="$BACKUP_DIR/$TIMESTAMP"

    mkdir -p "$BACKUP_SUBDIR"

    # Backup Strapi .env
    if [ -f "$STRAPI_DIR/.env" ]; then
        cp "$STRAPI_DIR/.env" "$BACKUP_SUBDIR/strapi.env"
        log "✅ Backed up: my-blog-cms/.env → $BACKUP_SUBDIR/strapi.env"
    else
        log "⚠ No .env file found in my-blog-cms/"
    fi

    # Backup Next.js .env.local
    if [ -f "$LAQTA_DIR/.env.local" ]; then
        cp "$LAQTA_DIR/.env.local" "$BACKUP_SUBDIR/laqta.env.local"
        log "✅ Backed up: laqta/.env.local → $BACKUP_SUBDIR/laqta.env.local"
    else
        log "⚠ No .env.local file found in laqta/"
    fi

    # Create a "latest" symlink
    rm -f "$BACKUP_DIR/latest"
    ln -s "$BACKUP_SUBDIR" "$BACKUP_DIR/latest"

    log ""
    log "📁 Backup location: $BACKUP_SUBDIR"
    log "📁 Latest backup:   $BACKUP_DIR/latest"

    # List all backups
    log ""
    log "→ All backups:"
    ls -la "$BACKUP_DIR" | grep -v "^total" | while read -r line; do
        log "   $line"
    done

    log_section "✅ Backup completed!"
}

# ==========================================
# Restore .env Files
# ==========================================
restore_env() {
    local restore_from="${1:-latest}"

    log_section "🔄 Restoring .env files"

    if [ "$restore_from" = "latest" ]; then
        RESTORE_DIR="$BACKUP_DIR/latest"
    else
        RESTORE_DIR="$BACKUP_DIR/$restore_from"
    fi

    if [ ! -d "$RESTORE_DIR" ]; then
        log "❌ Backup not found: $RESTORE_DIR"
        log ""
        log "Available backups:"
        ls -la "$BACKUP_DIR" 2>/dev/null | grep -v "^total" || log "   No backups found"
        exit 1
    fi

    # Restore Strapi .env
    if [ -f "$RESTORE_DIR/strapi.env" ]; then
        cp "$RESTORE_DIR/strapi.env" "$STRAPI_DIR/.env"
        log "✅ Restored: my-blog-cms/.env"
    else
        log "⚠ No strapi.env in backup"
    fi

    # Restore Next.js .env.local
    if [ -f "$RESTORE_DIR/laqta.env.local" ]; then
        cp "$RESTORE_DIR/laqta.env.local" "$LAQTA_DIR/.env.local"
        log "✅ Restored: laqta/.env.local"
    else
        log "⚠ No laqta.env.local in backup"
    fi

    log_section "✅ Restore completed from: $RESTORE_DIR"
}

# ==========================================
# List Backups
# ==========================================
list_backups() {
    log_section "📋 Available .env Backups"

    if [ ! -d "$BACKUP_DIR" ]; then
        log "No backups found. Run './deploy.sh --backup' to create one."
        return
    fi

    log "Location: $BACKUP_DIR"
    log ""

    for backup in "$BACKUP_DIR"/*/; do
        if [ -d "$backup" ]; then
            backup_name=$(basename "$backup")
            if [ "$backup_name" != "latest" ]; then
                log "→ $backup_name"
                [ -f "$backup/strapi.env" ] && log "    - strapi.env"
                [ -f "$backup/laqta.env.local" ] && log "    - laqta.env.local"
            fi
        fi
    done

    log ""
    if [ -L "$BACKUP_DIR/latest" ]; then
        latest_target=$(readlink "$BACKUP_DIR/latest")
        log "Latest: $(basename "$latest_target")"
    fi
}

# ==========================================
# Clean Up (Before Fresh Deploy)
# ==========================================
cleanup() {
    log_section "🧹 Cleaning up for fresh deployment"

    # Stop PM2 processes first
    log "→ Stopping PM2 processes..."
    pm2 stop strapi 2>/dev/null || true
    pm2 stop laqta 2>/dev/null || true
    log "✅ PM2 processes stopped"

    # Backup .env files before cleanup
    log ""
    log "→ Backing up .env files before cleanup..."
    backup_env

    # Clean Strapi
    log ""
    log "→ Cleaning Strapi (my-blog-cms)..."
    cd "$STRAPI_DIR"
    rm -rf node_modules 2>/dev/null && log "   ✓ Removed node_modules" || true
    rm -rf .cache 2>/dev/null && log "   ✓ Removed .cache" || true
    rm -rf build 2>/dev/null && log "   ✓ Removed build" || true
    rm -rf dist 2>/dev/null && log "   ✓ Removed dist" || true
    rm -f package-lock.json 2>/dev/null && log "   ✓ Removed package-lock.json" || true

    # Clean Next.js
    log ""
    log "→ Cleaning Next.js (laqta)..."
    cd "$LAQTA_DIR"
    rm -rf node_modules 2>/dev/null && log "   ✓ Removed node_modules" || true
    rm -rf .next 2>/dev/null && log "   ✓ Removed .next" || true
    rm -f package-lock.json 2>/dev/null && log "   ✓ Removed package-lock.json" || true

    # Clear npm cache
    log ""
    log "→ Clearing npm cache..."
    npm cache clean --force 2>/dev/null || true
    log "✅ npm cache cleared"

    log_section "✅ Cleanup completed!"
    log ""
    log "Next steps:"
    log "  1. Run './deploy.sh' to do a fresh deployment"
    log "  2. .env files are backed up at: $BACKUP_DIR/latest"
}

# ==========================================
# Check for Changes (Smart Deploy)
# ==========================================
check_and_deploy() {
    log_section "🔍 Checking for changes..."

    cd "$PROJECT_ROOT" || exit 1

    # Fetch latest from remote
    log "→ Fetching from origin/$BRANCH..."
    git fetch origin $BRANCH --quiet

    # Get current and remote commit hashes
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/$BRANCH)

    log "→ Local commit:  $LOCAL"
    log "→ Remote commit: $REMOTE"

    # Compare commits
    if [ "$LOCAL" = "$REMOTE" ]; then
        log "✅ No changes detected. Already up to date."
        exit 0
    fi

    log "🔄 Changes detected! Analyzing..."

    # Check which directories changed
    CHANGED_FILES=$(git diff --name-only $LOCAL $REMOTE)

    log "→ Changed files:"
    echo "$CHANGED_FILES" | head -20 | while read -r file; do
        log "   - $file"
    done

    STRAPI_CHANGED=false
    LAQTA_CHANGED=false

    if echo "$CHANGED_FILES" | grep -q "^my-blog-cms/"; then
        STRAPI_CHANGED=true
        log "→ Strapi (my-blog-cms) changes detected"
    fi

    if echo "$CHANGED_FILES" | grep -q "^laqta/"; then
        LAQTA_CHANGED=true
        log "→ Next.js (laqta) changes detected"
    fi

    # Backup .env files before pull (only if NOT using ecosystem file)
    if using_ecosystem; then
        log "→ Using ecosystem.production.config.js (not in git, no backup needed)"
    else
        log "→ Backing up .env files..."
        mkdir -p "$BACKUP_DIR/pre-deploy"
        [ -f "$STRAPI_DIR/.env" ] && cp "$STRAPI_DIR/.env" "$BACKUP_DIR/pre-deploy/strapi.env"
        [ -f "$LAQTA_DIR/.env.local" ] && cp "$LAQTA_DIR/.env.local" "$BACKUP_DIR/pre-deploy/laqta.env.local"
    fi

    # Pull the changes
    log "→ Pulling changes..."
    git pull origin $BRANCH
    log "✅ Git pull completed"

    # Restore .env files after pull (only if NOT using ecosystem file)
    if using_ecosystem; then
        log "✅ ecosystem.production.config.js unchanged (not tracked by git)"
    else
        log "→ Restoring .env files..."
        [ -f "$BACKUP_DIR/pre-deploy/strapi.env" ] && cp "$BACKUP_DIR/pre-deploy/strapi.env" "$STRAPI_DIR/.env"
        [ -f "$BACKUP_DIR/pre-deploy/laqta.env.local" ] && cp "$BACKUP_DIR/pre-deploy/laqta.env.local" "$LAQTA_DIR/.env.local"
        log "✅ .env files restored"
    fi

    # Deploy based on what changed
    if [ "$STRAPI_CHANGED" = true ] && [ "$LAQTA_CHANGED" = true ]; then
        log "→ Deploying both applications..."
        deploy_strapi
        deploy_laqta
    elif [ "$STRAPI_CHANGED" = true ]; then
        deploy_strapi
    elif [ "$LAQTA_CHANGED" = true ]; then
        deploy_laqta
    else
        log "→ No application changes (config/docs only). Skipping build."
    fi

    log_section "✅ Smart deploy completed!"
}

# ==========================================
# Deploy Strapi
# ==========================================
deploy_strapi() {
    log_section "📦 Deploying Strapi CMS"

    cd "$STRAPI_DIR"
    log "→ Directory: $(pwd)"

    # Pull if called directly (not from check_and_deploy)
    if [ "$1" = "pull" ] || [ -z "$ALREADY_PULLED" ]; then
        # Backup .env before pull (only if NOT using ecosystem)
        if ! using_ecosystem && [ -f ".env" ]; then
            cp .env /tmp/.env.strapi.bak
            log "✅ .env backed up"
        fi

        log "→ Pulling latest changes..."
        git -C "$PROJECT_ROOT" fetch origin $BRANCH
        git -C "$PROJECT_ROOT" reset --hard origin/$BRANCH
        log "✅ Git pull completed"

        # Restore .env after pull (only if NOT using ecosystem)
        if ! using_ecosystem && [ -f /tmp/.env.strapi.bak ]; then
            cp /tmp/.env.strapi.bak .env
            log "✅ .env restored after pull"
        fi
    fi

    log "→ Installing dependencies..."
    npm ci --production=false
    log "✅ Dependencies installed"

    log "→ Building Strapi admin panel..."
    npm run build
    log "✅ Build completed"

    log "→ Managing PM2 process..."
    # Stop and delete any existing strapi processes to avoid duplicates
    if pm2 list | grep -q "strapi"; then
        log "→ Stopping existing strapi process(es)..."
        pm2 stop strapi 2>/dev/null || true
        pm2 delete strapi 2>/dev/null || true
        log "✅ Old strapi process(es) removed"
    fi

    log "→ Starting strapi..."
    # Use ecosystem file if exists, otherwise use npm directly
    if [ -f "$PROJECT_ROOT/ecosystem.production.config.js" ]; then
        pm2 start "$PROJECT_ROOT/ecosystem.production.config.js" --only strapi
        log "✅ Strapi started (using ecosystem.production.config.js)"
    else
        pm2 start npm --name "strapi" -- run start
        log "✅ Strapi started (using npm)"
    fi

    pm2 save
    log "✅ PM2 process list saved"

    # Health check
    sleep 5
    check_health "http://localhost:1337/api/health" "Strapi"

    log_section "🎉 Strapi deployment completed!"
}

# ==========================================
# Deploy Next.js (Laqta)
# ==========================================
deploy_laqta() {
    log_section "📦 Deploying Next.js Frontend"

    # Verify Strapi is running first
    log "→ Checking Strapi status..."
    if ! curl -sf "http://localhost:1337/api/health" > /dev/null 2>&1; then
        log "⚠ Warning: Strapi is not responding. Frontend may have API issues."
    else
        log "✅ Strapi is healthy"
    fi

    cd "$LAQTA_DIR"
    log "→ Directory: $(pwd)"

    # Pull if called directly (not from check_and_deploy)
    if [ "$1" = "pull" ] || [ -z "$ALREADY_PULLED" ]; then
        # Backup .env.local before pull (only if NOT using ecosystem)
        if ! using_ecosystem && [ -f ".env.local" ]; then
            cp .env.local /tmp/.env.local.laqta.bak
            log "✅ .env.local backed up"
        fi

        log "→ Pulling latest changes..."
        git -C "$PROJECT_ROOT" fetch origin $BRANCH
        git -C "$PROJECT_ROOT" reset --hard origin/$BRANCH
        log "✅ Git pull completed"

        # Restore .env.local after pull (only if NOT using ecosystem)
        if ! using_ecosystem && [ -f /tmp/.env.local.laqta.bak ]; then
            cp /tmp/.env.local.laqta.bak .env.local
            log "✅ .env.local restored after pull"
        fi
    fi

    log "→ Installing dependencies..."
    npm ci --production=false
    log "✅ Dependencies installed"

    log "→ Building Next.js application..."
    npm run build
    log "✅ Build completed"

    log "→ Managing PM2 process..."
    # Stop and delete any existing laqta processes to avoid duplicates
    if pm2 list | grep -q "laqta"; then
        log "→ Stopping existing laqta process(es)..."
        pm2 stop laqta 2>/dev/null || true
        pm2 delete laqta 2>/dev/null || true
        log "✅ Old laqta process(es) removed"
    fi

    log "→ Starting laqta..."
    # Use ecosystem file if exists, otherwise use npm directly
    if [ -f "$PROJECT_ROOT/ecosystem.production.config.js" ]; then
        pm2 start "$PROJECT_ROOT/ecosystem.production.config.js" --only laqta
        log "✅ Laqta started (using ecosystem.production.config.js)"
    else
        pm2 start npm --name "laqta" -- run start
        log "✅ Laqta started (using npm)"
    fi

    pm2 save
    log "✅ PM2 process list saved"

    # Health check
    sleep 3
    check_health "http://localhost:3000/api/health" "Next.js"

    log_section "🎉 Next.js deployment completed!"
}

# ==========================================
# Full Deploy (Pull + Build Both)
# ==========================================
deploy_all() {
    log_section "🚀 Full Deployment Started"

    cd "$PROJECT_ROOT"

    # Show which config method is being used
    if using_ecosystem; then
        log "→ Using ecosystem.production.config.js for environment variables"
        log "  (This file is not in git - your secrets are safe)"
    else
        log "→ Using .env files for environment variables"
        # Backup .env files first
        log "→ Backing up .env files..."
        mkdir -p "$BACKUP_DIR/pre-deploy"
        [ -f "$STRAPI_DIR/.env" ] && cp "$STRAPI_DIR/.env" "$BACKUP_DIR/pre-deploy/strapi.env"
        [ -f "$LAQTA_DIR/.env.local" ] && cp "$LAQTA_DIR/.env.local" "$BACKUP_DIR/pre-deploy/laqta.env.local"
        log "✅ .env files backed up"
    fi

    log "→ Pulling latest changes from GitHub..."
    git fetch origin $BRANCH
    git reset --hard origin/$BRANCH
    log "✅ Git pull completed"

    # Restore .env files after pull (only if NOT using ecosystem)
    if ! using_ecosystem; then
        log "→ Restoring .env files..."
        [ -f "$BACKUP_DIR/pre-deploy/strapi.env" ] && cp "$BACKUP_DIR/pre-deploy/strapi.env" "$STRAPI_DIR/.env"
        [ -f "$BACKUP_DIR/pre-deploy/laqta.env.local" ] && cp "$BACKUP_DIR/pre-deploy/laqta.env.local" "$LAQTA_DIR/.env.local"
        log "✅ .env files restored"
    fi

    ALREADY_PULLED=true
    deploy_strapi
    deploy_laqta

    log_section "✅ Full deployment completed!"
}

# ==========================================
# Show Status
# ==========================================
show_status() {
    log_section "📊 Current Status"

    log "→ Environment Config:"
    if using_ecosystem; then
        log "   Method: ecosystem.production.config.js ✅"
        log "   File:   $ECOSYSTEM_FILE"
    else
        log "   Method: .env files"
        [ -f "$STRAPI_DIR/.env" ] && log "   Strapi:  ✅ .env exists" || log "   Strapi:  ❌ .env missing"
        [ -f "$LAQTA_DIR/.env.local" ] && log "   Next.js: ✅ .env.local exists" || log "   Next.js: ❌ .env.local missing"
    fi

    log ""
    log "→ Git Status:"
    cd "$PROJECT_ROOT"
    git log -1 --format="   Commit: %h - %s (%cr)"

    log ""
    log "→ PM2 Processes:"
    pm2 status

    log ""
    log "→ Health Checks:"
    if curl -sf "http://localhost:1337/api/health" > /dev/null 2>&1; then
        log "   Strapi:  ✅ Healthy (http://localhost:1337)"
    else
        log "   Strapi:  ❌ Not responding"
    fi

    if curl -sf "http://localhost:3000/api/health" > /dev/null 2>&1; then
        log "   Next.js: ✅ Healthy (http://localhost:3000)"
    else
        log "   Next.js: ❌ Not responding"
    fi

    if ! using_ecosystem; then
        log ""
        log "→ Latest Backup:"
        if [ -L "$BACKUP_DIR/latest" ]; then
            log "   $BACKUP_DIR/latest"
        else
            log "   No backups found"
        fi
    fi
}

# ==========================================
# Main
# ==========================================
main() {
    # Create log file if not exists
    touch "$LOG_FILE" 2>/dev/null || true

    # Create backup directory
    mkdir -p "$BACKUP_DIR"

    case "${1:-all}" in
        --check|-c|check)
            check_and_deploy
            ;;
        --clean|clean)
            cleanup
            ;;
        --backup|-b|backup)
            backup_env
            ;;
        --restore|-r|restore)
            restore_env "$2"
            ;;
        --list-backups|backups)
            list_backups
            ;;
        --status|-s|status)
            show_status
            ;;
        strapi)
            log_section "🚀 Strapi Deployment Started"
            deploy_strapi pull
            ;;
        laqta|nextjs|frontend)
            log_section "🚀 Next.js Deployment Started"
            deploy_laqta pull
            ;;
        all|"")
            deploy_all
            ;;
        --help|-h|help)
            echo "Laqta Project Deployment Script"
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Deployment Commands:"
            echo "  (empty)       Deploy both Strapi and Next.js"
            echo "  all           Deploy both Strapi and Next.js"
            echo "  strapi        Deploy Strapi CMS only"
            echo "  laqta         Deploy Next.js frontend only"
            echo "  --check       Smart deploy (only if changes detected)"
            echo ""
            echo "Maintenance Commands:"
            echo "  --clean       Clean up and prepare for fresh deploy"
            echo "  --status      Show current deployment status"
            echo ""
            echo "Backup Commands:"
            echo "  --backup      Backup .env files"
            echo "  --restore     Restore .env files from latest backup"
            echo "  --restore X   Restore from specific backup (e.g., 20241128_143022)"
            echo "  --list-backups List all available backups"
            echo ""
            echo "Examples:"
            echo "  $0                    # Full deploy"
            echo "  $0 strapi             # Deploy Strapi only"
            echo "  $0 --check            # Smart deploy (for cron)"
            echo "  $0 --clean            # Clean before fresh deploy"
            echo "  $0 --backup           # Backup .env files"
            echo "  $0 --restore          # Restore from latest backup"
            echo "  $0 --restore 20241128_143022  # Restore specific backup"
            ;;
        *)
            log "❌ Unknown command: $1"
            log "Run '$0 --help' for usage information."
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
