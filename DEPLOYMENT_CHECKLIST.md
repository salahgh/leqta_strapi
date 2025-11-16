# Deployment Checklist

Use this checklist to ensure everything is set up correctly before deploying.

## ☑️ Pre-Deployment Setup

### GitHub Secrets (Repository Settings)
- [ ] Navigate to GitHub repo → Settings → Secrets and variables → Actions
- [ ] Add `CPANEL_FTP_SERVER` = `ftp.leqta.com`
- [ ] Add `CPANEL_FTP_USERNAME` = `leqtaco1`
- [ ] Add `CPANEL_FTP_PASSWORD` = `[your FTP password]`

### Workflow Configuration
- [ ] Open `.github/workflows/deploy-strapi.yml`
- [ ] Update line 57 `server-dir:` with correct cPanel path
- [ ] Verify path by logging into FTP and checking directory structure
- [ ] Save the file

### cPanel Database Setup
- [ ] Log into cPanel
- [ ] Go to **MySQL Databases**
- [ ] Create new database (e.g., `leqtaco1_strapi`)
- [ ] Create database user with strong password
- [ ] Add user to database with ALL PRIVILEGES
- [ ] Note down: Database name, username, password

### cPanel Node.js App Setup
- [ ] In cPanel, go to **Setup Node.js App**
- [ ] Click **Create Application**
- [ ] Set Node.js version: **20.x**
- [ ] Set Application mode: **Production**
- [ ] Set Application root: `strapi_cms` (or your path)
- [ ] Set Application startup file: `server.js`
- [ ] Choose your domain/subdomain
- [ ] Click **Create**
- [ ] Note down the port number assigned

### Environment File (.env) on Server
- [ ] Connect to server via FTP or cPanel File Manager
- [ ] Navigate to Strapi directory
- [ ] Create new file named `.env`
- [ ] Generate 6 random secret keys (see commands below)
- [ ] Add all configuration (see template in SETUP_GITHUB_ACTIONS.md)
- [ ] Update database credentials
- [ ] Update PORT if needed
- [ ] Save the file

**Generate secrets on your local machine:**
```bash
# Run this 6 times to get 6 different keys
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## ☑️ Deployment

### Initial Deployment
- [ ] Commit all changes to git
- [ ] Push to `main` branch: `git push origin main`
- [ ] Go to GitHub → Actions tab
- [ ] Watch deployment progress
- [ ] Verify all steps complete successfully ✅

### Post-Deployment
- [ ] Log into cPanel
- [ ] Go to **Setup Node.js App**
- [ ] Find your Strapi app
- [ ] Click **Restart**
- [ ] Wait for status: **Running**

## ☑️ Verification

### Test Application
- [ ] Visit: `http://yourdomain.com:PORT/admin` (replace PORT with your assigned port)
- [ ] Or visit configured domain URL
- [ ] Strapi admin panel loads
- [ ] Create admin account (first time only)
- [ ] Log in successfully
- [ ] Check API: `http://yourdomain.com:PORT/api`

### Test Content
- [ ] Create a test blog post
- [ ] Publish the post
- [ ] Verify it appears in API response
- [ ] Test in different locales (en, ar, fr)

## ☑️ Optional but Recommended

### Security
- [ ] Set up SSL certificate for HTTPS
- [ ] Update STRAPI_URL in frontend `.env.local`
- [ ] Configure CORS settings in Strapi
- [ ] Set strong admin password
- [ ] Enable 2FA for admin account (if available)

### Performance
- [ ] Set up cPanel cron job for automated backups
- [ ] Configure database backup schedule
- [ ] Test file upload functionality
- [ ] Verify Supabase storage (if configured)

### Monitoring
- [ ] Bookmark cPanel Node.js app logs URL
- [ ] Test restarting the app
- [ ] Subscribe to GitHub Actions notifications
- [ ] Set up uptime monitoring (optional)

## ☑️ Common Issues Resolved

### If deployment fails:
- [ ] Check GitHub Actions error logs
- [ ] Verify all secrets are set correctly
- [ ] Confirm server-dir path is correct
- [ ] Check FTP credentials work in FileZilla

### If app won't start:
- [ ] Check `.env` file exists on server
- [ ] Verify database credentials
- [ ] Check cPanel error logs
- [ ] Ensure port is not in use
- [ ] Restart app in cPanel

### If "Cannot find module" error:
- [ ] Verify deployment completed successfully
- [ ] Check node_modules folder uploaded
- [ ] Restart the app
- [ ] Check NODE_ENV=production in .env

## 📝 Quick Reference

**Your Configuration:**
- FTP Server: `ftp.leqta.com`
- FTP Username: `leqtaco1`
- Port: `21`
- Server Path: `/strapi_cms/` (verify this!)

**Important URLs:**
- GitHub Actions: `https://github.com/[your-username]/leqta_strapi/actions`
- cPanel: Your cPanel URL
- Node.js App Manager: cPanel → Setup Node.js App

**Support Files:**
- Detailed guide: `SETUP_GITHUB_ACTIONS.md`
- Full documentation: `DEPLOYMENT_GUIDE.md`
- Secrets template: `.github/SECRETS_TEMPLATE.md`

---

## ✅ Deployment Complete!

Once all checkboxes are complete, your Strapi CMS will automatically deploy on every push to the main branch.

**No more npm install issues on cPanel!** 🎉
