# Quick Setup Guide - GitHub Actions Deployment

## Step 1: Add GitHub Secrets

Go to your GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**

Add these **3 secrets**:

### Secret 1: CPANEL_FTP_SERVER
```
Name: CPANEL_FTP_SERVER
Value: ftp.leqta.com
```

### Secret 2: CPANEL_FTP_USERNAME
```
Name: CPANEL_FTP_USERNAME
Value: leqtaco1
```

### Secret 3: CPANEL_FTP_PASSWORD
```
Name: CPANEL_FTP_PASSWORD
Value: [Your FTP Password - you need to enter this]
```

## Step 2: Update Server Directory Path

**IMPORTANT:** You need to verify and update the server directory path in the workflow file.

Edit: `.github/workflows/deploy-strapi.yml`

Find line 57:
```yaml
server-dir: /strapi_cms/
```

**Change it to your actual cPanel directory:**

- If Strapi is in your public_html: `server-dir: /public_html/strapi_cms/`
- If Strapi is in home directory: `server-dir: /strapi_cms/` (current setting)
- If in a subdomain folder: `server-dir: /subdomain.leqta.com/strapi_cms/`

**To find the correct path:**
1. Log into FTP using FileZilla or cPanel File Manager
2. Navigate to where you want Strapi installed
3. Note the full path from root

**Common cPanel FTP Structure:**
```
/ (FTP root = /home/leqtaco1/)
├── public_html/          ← Website files
├── strapi_cms/           ← Strapi app (if outside public_html)
├── mail/
├── etc/
└── tmp/
```

## Step 3: Set Up cPanel

### 3.1 Create Node.js Application

1. Log into cPanel
2. Go to **Setup Node.js App**
3. Click **Create Application**:
   - **Node.js version**: 20.x
   - **Application mode**: Production
   - **Application root**: `strapi_cms` (or your chosen path)
   - **Application URL**: Choose your domain/subdomain
   - **Application startup file**: `server.js`
4. Click **Create**

### 3.2 Create MySQL Database

1. In cPanel, go to **MySQL Databases**
2. Create new database: `leqtaco1_strapi` (or your preferred name)
3. Create database user with strong password
4. Add user to database with **ALL PRIVILEGES**
5. **Note down:** Database name, username, and password

### 3.3 Create .env File on Server

Using cPanel File Manager or FTP client:

1. Navigate to your Strapi directory (e.g., `strapi_cms/`)
2. Create new file named `.env`
3. Add this content (update with your actual values):

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets - GENERATE NEW ONES FOR PRODUCTION!
APP_KEYS=changeme1,changeme2,changeme3,changeme4
API_TOKEN_SALT=change-me-token-salt
ADMIN_JWT_SECRET=change-me-admin-jwt-secret
TRANSFER_TOKEN_SALT=change-me-transfer-token-salt
JWT_SECRET=change-me-jwt-secret
ENCRYPTION_KEY=change-me-encryption-key

# Database - Update with your cPanel database info
NODE_ENV=production
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=leqtaco1_strapi
DATABASE_USERNAME=leqtaco1_strapiuser
DATABASE_PASSWORD=your_database_password_here
DATABASE_SSL=false

# Optional: Supabase Storage (if using file uploads)
# SUPABASE_API_URL=
# SUPABASE_API_KEY=
# SUPABASE_BUCKET=
# SUPABASE_DIRECTORY=
```

**⚠️ IMPORTANT:** Generate new secret keys for production:

On your local machine, run this command 6 times to generate each secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Replace all the `change-me-*` values with the generated keys.

For `APP_KEYS`, generate 4 keys and separate with commas.

## Step 4: Deploy

### Option A: Push to GitHub (Automatic)
```bash
git add .
git commit -m "Configure GitHub Actions deployment"
git push origin main
```

### Option B: Manual Trigger
1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Deploy Strapi to cPanel**
4. Click **Run workflow**
5. Click **Run workflow** button

## Step 5: Monitor Deployment

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Watch each step complete:
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build Strapi
   - ✅ Upload to cPanel

**Expected time:** 5-10 minutes

## Step 6: Restart Application

After deployment succeeds:

1. Log into cPanel
2. Go to **Setup Node.js App**
3. Find your Strapi application
4. Click **Restart** button
5. Wait for status to show "Running"

## Step 7: Verify Deployment

Visit your application:
- **Admin Panel**: `http://yourdomain.com:1337/admin` or `https://yourdomain.com/strapi/admin`
- **API**: `http://yourdomain.com:1337/api`

**First time setup:**
1. Create your admin account
2. Log in to the admin panel
3. Verify content is accessible

## Troubleshooting

### "Error: Cannot find module"
**Solution:**
1. Check that `.env` file exists on server
2. Verify `NODE_ENV=production` is set
3. Restart the Node.js app in cPanel

### "Database connection failed"
**Solution:**
1. Verify database credentials in `.env`
2. Ensure database user has privileges
3. Check `DATABASE_HOST=localhost`
4. Confirm `DATABASE_CLIENT=mysql`

### "Port already in use"
**Solution:**
- Change `PORT` in `.env` to a different number (e.g., 3000, 3001, 8080)
- Restart the app

### Deployment succeeds but app won't start
**Check logs:**
1. cPanel: **Setup Node.js App** → Click on your app → **View Logs**
2. Look for error messages

### FTP upload fails
**Solution:**
- Verify FTP password in GitHub secrets
- Check server-dir path is correct
- Ensure directory exists on server

## Automatic Deployments

Once set up, deployments happen automatically:
- ✅ Push to `main` branch → Auto-deploy
- ✅ Only deploys when files in `my-blog-cms/` change
- ✅ Builds with Linux-compatible dependencies
- ✅ No more npm install issues!

## What Gets Deployed

The workflow:
1. ✅ Builds in Linux environment (matches cPanel)
2. ✅ Installs production dependencies only
3. ✅ Builds Strapi admin panel
4. ✅ Uploads everything including node_modules
5. ❌ Does NOT upload .env files (you manage these manually)
6. ❌ Does NOT upload logs or cache

## Next Steps

After successful deployment:
- [ ] Set up SSL certificate in cPanel for HTTPS
- [ ] Configure your domain to point to the Node.js app
- [ ] Set up regular database backups
- [ ] Test all API endpoints
- [ ] Create content in the admin panel

## Support

For issues, check:
1. GitHub Actions logs (detailed error messages)
2. cPanel Node.js app logs
3. `DEPLOYMENT_GUIDE.md` for detailed troubleshooting
