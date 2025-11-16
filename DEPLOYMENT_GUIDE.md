# Strapi cPanel Deployment Guide

This guide explains how to deploy your Strapi CMS to cPanel using GitHub Actions.

## Overview

Two workflows are available:

1. **`deploy-strapi.yml`** - Requires SSH access (recommended)
   - Uploads source code only
   - Installs dependencies on the server
   - Faster uploads, server builds packages

2. **`deploy-strapi-ftp-only.yml`** - FTP only (no SSH required)
   - Builds everything on GitHub Actions
   - Uploads complete application with node_modules
   - Slower uploads, but works without SSH

## Setup Instructions

### Step 1: Choose Your Workflow

**If you have SSH access to cPanel:**
- Keep `deploy-strapi.yml`
- Delete `deploy-strapi-ftp-only.yml`

**If you only have FTP access:**
- Delete `deploy-strapi.yml`
- Rename `deploy-strapi-ftp-only.yml` to `deploy-strapi.yml`

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

#### Required for Both Workflows:

```
CPANEL_FTP_SERVER
├─ Value: ftp.yourdomain.com
└─ Example: ftp.leqta.com

CPANEL_FTP_USERNAME
├─ Value: Your cPanel FTP username
└─ Example: leqtaco1@leqta.com

CPANEL_FTP_PASSWORD
└─ Value: Your FTP password
```

#### Required Only for SSH Workflow (deploy-strapi.yml):

```
CPANEL_HOST
├─ Value: Your cPanel server hostname or IP
└─ Example: server123.yourhostingprovider.com

CPANEL_SSH_USERNAME
├─ Value: Your cPanel SSH username
└─ Example: leqtaco1

CPANEL_SSH_PASSWORD
└─ Value: Your SSH password

CPANEL_SSH_PORT (optional)
├─ Value: SSH port (default: 22)
└─ Most cPanel servers use port 22 or 2222
```

### Step 3: Update Workflow Configuration

Edit `.github/workflows/deploy-strapi.yml` and update:

```yaml
server-dir: /strapi_cms/  # Change to your actual cPanel directory path
```

**To find your correct path:**
1. Log into cPanel
2. Go to **File Manager**
3. Navigate to where you want Strapi installed
4. Check the path (usually `/home/username/strapi_cms/`)

### Step 4: Set Up cPanel Environment

#### 4.1 Create Node.js Application in cPanel

1. Log into cPanel
2. Go to **Setup Node.js App**
3. Click **Create Application**:
   - **Node.js version**: 20.x
   - **Application mode**: Production
   - **Application root**: `strapi_cms` (or your chosen directory)
   - **Application URL**: Your domain/subdomain
   - **Application startup file**: `server.js`

4. Click **Create**

#### 4.2 Create .env File on Server

Using cPanel File Manager or FTP, create `.env` file in your Strapi directory:

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets (generate new ones for production!)
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database (update with your cPanel database info)
NODE_ENV=production
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=your_database_name
DATABASE_USERNAME=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_SSL=false

# Supabase Storage (if using file uploads)
SUPABASE_API_URL=your-supabase-url
SUPABASE_API_KEY=your-supabase-key
SUPABASE_BUCKET=your-bucket-name
SUPABASE_DIRECTORY=your-directory
```

**⚠️ Important:** Generate new secret keys for production using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 4.3 Create Database

1. In cPanel, go to **MySQL Databases**
2. Create a new database (e.g., `leqtaco1_strapi`)
3. Create a new user with a strong password
4. Add the user to the database with **ALL PRIVILEGES**
5. Update the `.env` file with these credentials

### Step 5: Deploy

#### Option A: Automatic Deployment
Push changes to the `main` branch:
```bash
git add .
git commit -m "Configure deployment"
git push origin main
```

#### Option B: Manual Deployment
Go to your GitHub repository → **Actions** → **Deploy Strapi to cPanel** → **Run workflow**

### Step 6: Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Watch the deployment progress
4. Check for any errors

### Step 7: Restart Application

After deployment completes:

1. Log into cPanel
2. Go to **Setup Node.js App**
3. Find your Strapi application
4. Click **Restart**

Or via SSH (if available):
```bash
cd ~/strapi_cms
touch tmp/restart.txt
```

### Step 8: Verify Deployment

Visit your Strapi URL:
- **Admin Panel**: `https://yourdomain.com/admin`
- **API**: `https://yourdomain.com/api`

## Troubleshooting

### Deployment fails at "Install dependencies"
**Cause:** cPanel memory limits
**Solution:** Use FTP-only workflow which builds on GitHub

### FTP upload times out
**Cause:** Large node_modules folder
**Solution:**
- Use SSH workflow instead
- Or add more exclusions to FTP upload

### "Cannot find module" errors after deployment
**Cause:** Missing production dependencies
**Solution:** Check that all required packages are in `dependencies`, not `devDependencies`

### Application won't start
**Causes:**
1. Missing `.env` file → Create it manually on server
2. Database connection failed → Check database credentials
3. Port already in use → Change PORT in `.env`

**Check logs:**
- cPanel: **Setup Node.js App** → Your app → **View Logs**
- Or: `~/nodevenv/strapi_cms/20/logs/error.log`

### SSH connection fails
**Solutions:**
- Verify SSH is enabled in cPanel
- Check SSH port (usually 22 or 2222)
- Use FTP-only workflow if SSH not available

## Workflow Customization

### Deploy only when Strapi files change
Already configured! Workflow only runs when files in `my-blog-cms/` change.

### Deploy on pull request merge
Change this line in the workflow:
```yaml
on:
  pull_request:
    branches:
      - main
    types: [closed]
```

### Add Slack/Discord notifications
Add this step at the end of the workflow:
```yaml
- name: Notify on Discord
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

## Security Best Practices

1. ✅ **Never commit `.env` files** - They're excluded by default
2. ✅ **Use different secrets for production** - Don't use dev secrets
3. ✅ **Restrict SSH/FTP access** - Use strong passwords
4. ✅ **Enable cPanel firewall** - Limit access to known IPs
5. ✅ **Keep dependencies updated** - Run `npm audit` regularly

## Performance Tips

1. **Use caching:** Already configured in workflow with `cache: 'npm'`
2. **Production mode:** Set `NODE_ENV=production` in `.env`
3. **Database optimization:** Use MySQL instead of SQLite for cPanel
4. **CDN for media:** Use Supabase Storage (already configured)

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check cPanel error logs
3. Verify all secrets are correctly set
4. Ensure cPanel Node.js app is configured correctly
