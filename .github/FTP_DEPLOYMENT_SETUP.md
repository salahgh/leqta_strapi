# FTP Deployment Setup Guide

This guide explains how to configure the Strapi CMS FTP deployment with explicit TLS/SSL.

## Overview

The GitHub Actions workflow (`build-strapi.yml`) automatically deploys your Strapi CMS to an FTP server using FTPS (FTP over TLS) when you push to the `main` branch.

## Security Features

- **Protocol**: FTPS (FTP with explicit TLS)
- **Security Level**: Strict (enforces encrypted connections)
- **Timeout**: 10 minutes (600,000ms)
- **Automatic Exclusions**: Excludes node_modules, .env files, cache, and logs

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Secret Configuration

| Secret Name | Description | Example |
|------------|-------------|---------|
| `FTP_SERVER` | FTP server hostname or IP | `ftp.example.com` or `192.168.1.100` |
| `FTP_USERNAME` | FTP account username | `your_ftp_user` |
| `FTP_PASSWORD` | FTP account password | `your_secure_password` |
| `FTP_PORT` | FTP server port (optional, defaults to 21) | `21` or `990` |
| `FTP_SERVER_DIR` | Remote directory path on FTP server | `/public_html/strapi/` or `/home/user/cms/` |

### Example Values

```
FTP_SERVER=ftp.yourhost.com
FTP_USERNAME=user@yourhost.com
FTP_PASSWORD=YourSecureP@ssw0rd
FTP_PORT=21
FTP_SERVER_DIR=/public_html/strapi/
```

## Deployment Behavior

### When Deployment Runs

- ✅ **Runs on**: Push to `main` branch
- ❌ **Does NOT run on**: Pull requests, pushes to other branches

### Deployment Process

1. **Build Job** runs first (builds Strapi admin panel)
2. **Deploy Job** runs after successful build
3. Files are uploaded to FTP server via FTPS
4. Excluded files are automatically skipped

### Excluded Files

The following are automatically excluded from deployment:

- `.git` and `.gitignore`
- `node_modules/` (install these on server)
- `.env` (create manually on server)
- `.cache/` and `.tmp/`
- `coverage/` and `*.log`
- `.DS_Store`

## Post-Deployment Steps

After the first deployment, you need to set up the server:

### 1. SSH/Terminal into your server

```bash
ssh user@your-server.com
cd /path/to/deployed/strapi
```

### 2. Install Node.js dependencies

```bash
npm ci --production
```

### 3. Create .env file

```bash
cp .env.example .env
nano .env  # Edit with your production values
```

**Required environment variables:**

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_production
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password

# Supabase (if using)
SUPABASE_API_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_key
SUPABASE_BUCKET=your_bucket_name
SUPABASE_DIRECTORY=your_directory
```

### 4. Start Strapi

```bash
# Production mode
npm run start

# Or use PM2 for process management
pm2 start npm --name "strapi-cms" -- start
pm2 save
pm2 startup
```

## Troubleshooting

### Connection Refused

- **Issue**: FTP connection fails
- **Solution**: Verify `FTP_SERVER`, `FTP_PORT`, and firewall settings

### Authentication Failed

- **Issue**: Username/password rejected
- **Solution**: Check `FTP_USERNAME` and `FTP_PASSWORD` secrets

### SSL/TLS Errors

- **Issue**: SSL certificate validation fails
- **Solution**: Ensure your FTP server supports explicit TLS (FTPS)
  - Port 21 for explicit TLS (recommended)
  - Port 990 for implicit TLS

### Deployment Timeout

- **Issue**: Deployment takes longer than 10 minutes
- **Solution**: Increase timeout in workflow file:
  ```yaml
  timeout: 1200000  # 20 minutes
  ```

### Files Not Uploading

- **Issue**: Some files are missing after deployment
- **Solution**: Check the `exclude` list in the workflow file

## Manual Deployment

To manually trigger deployment:

1. Go to **Actions** tab in GitHub
2. Select **Build Strapi CMS** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

## Monitoring Deployments

### View Deployment Logs

1. Go to **Actions** tab
2. Click on a workflow run
3. Expand **Deploy to FTP** step
4. View verbose logs showing file transfers

### Deployment Notifications

The workflow will show:
- ✅ Build status
- 🚀 Deployment server
- 📁 Deployment directory
- ⏰ Deployment timestamp

## Security Best Practices

1. **Use strong passwords** for FTP credentials
2. **Limit FTP user permissions** to only the deployment directory
3. **Enable firewall rules** to allow only GitHub Actions IPs (if possible)
4. **Rotate secrets regularly** (every 3-6 months)
5. **Use separate FTP account** for CI/CD (not your main account)
6. **Never commit** `.env` files or secrets to repository

## Alternative: SFTP

If your server supports SFTP (SSH File Transfer Protocol) instead of FTPS, consider using it for better security. You can modify the workflow to use `wlixcc/SFTP-Deploy-Action` instead.

## Support

For issues with:
- **FTP configuration**: Contact your hosting provider
- **GitHub Actions**: Check GitHub Actions documentation
- **Strapi deployment**: Refer to Strapi deployment docs
