# GitHub Secrets Configuration Template

Copy this template and fill in your actual values, then add them to:
**GitHub Repository → Settings → Secrets and variables → Actions**

---

## VPS SSH Deployment Secrets (Required)

These secrets are used by the PM2 deployment workflows (`deploy-strapi.yml` and `deploy-laqta.yml`).

### SSH Connection

```
Secret Name: VPS_HOST
Value: your-server-ip-or-hostname
Example: 192.168.1.100 or server.yourdomain.com
Notes: Your VPS server IP address or hostname
```

```
Secret Name: VPS_SSH_USERNAME
Value: your_ssh_username
Example: root, ubuntu, or your-username
Notes: SSH user with access to deployment directory
```

```
Secret Name: VPS_SSH_PRIVATE_KEY
Value: -----BEGIN OPENSSH PRIVATE KEY-----
       ...your private key content...
       -----END OPENSSH PRIVATE KEY-----
Notes: Your SSH private key (entire contents including BEGIN/END lines)
       Generate with: ssh-keygen -t ed25519 -C "github-actions-deploy"
       Add public key to server: ~/.ssh/authorized_keys
```

```
Secret Name: VPS_SSH_PORT
Value: 22
Notes: SSH port (default: 22, some hosts use 2222)
Optional: Leave empty to use default port 22
```

### Environment Variables

```
Secret Name: NEXT_PUBLIC_STRAPI_URL_2
Value: https://api.yourdomain.com
Notes: Production URL for Strapi API (used during Next.js build)
```

---

## How to Generate SSH Keys for GitHub Actions

### On your local machine:

```bash
# Generate a new SSH key pair specifically for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# View the private key (add this to GitHub Secrets as VPS_SSH_PRIVATE_KEY)
cat ~/.ssh/github_actions_deploy

# View the public key (add this to your VPS)
cat ~/.ssh/github_actions_deploy.pub
```

### On your VPS server:

```bash
# Add the public key to authorized_keys
echo "your-public-key-content" >> ~/.ssh/authorized_keys

# Ensure correct permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the **Name** (e.g., `VPS_HOST`)
6. Enter the **Value**
7. Click **Add secret**
8. Repeat for each secret

---

## Environment Setup on VPS

Before the first deployment, ensure your VPS is configured:

### 1. Server Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install build tools (for native modules)
sudo apt install -y build-essential
```

### 2. Create Project Directory

```bash
# Create and own the project directory
sudo mkdir -p /var/www/laqta-project
sudo chown -R $USER:$USER /var/www/laqta-project

# Create subdirectories
mkdir -p /var/www/laqta-project/my-blog-cms
mkdir -p /var/www/laqta-project/laqta
mkdir -p /var/www/laqta-project/backups
```

### 3. Configure Environment Files

**Strapi Backend** (`/var/www/laqta-project/my-blog-cms/.env`):

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security Keys (generate with: openssl rand -base64 32)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database (MariaDB)
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# Supabase Storage (optional)
SUPABASE_API_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-supabase-anon-key
SUPABASE_BUCKET=your-bucket-name
```

**Next.js Frontend** (`/var/www/laqta-project/laqta/.env.local`):

```env
NEXT_PUBLIC_STRAPI_URL_2=https://api.yourdomain.com

# Odoo Integration (if needed)
ODOO_URL=https://your-odoo-instance.odoo.com
```

### 4. Setup PM2 Startup

```bash
# Generate startup script
pm2 startup

# Run the command PM2 outputs (example):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u yourusername --hp /home/yourusername

# Save current processes (run after first successful deployment)
pm2 save
```

---

## Verification Checklist

Before deploying, ensure:

- [ ] All required secrets are added to GitHub
- [ ] SSH key is properly configured on VPS
- [ ] VPS has Node.js 20.x installed
- [ ] PM2 is installed globally on VPS
- [ ] Project directories exist on VPS
- [ ] `.env` file exists on VPS for Strapi
- [ ] `.env.local` file exists on VPS for Next.js
- [ ] Database is created and accessible
- [ ] PM2 startup is configured

---

## Deployment Paths

| Application | VPS Path | PM2 Process Name | Port |
|-------------|----------|------------------|------|
| Strapi CMS | `/var/www/laqta-project/my-blog-cms` | `strapi` | 1337 |
| Next.js | `/var/www/laqta-project/laqta` | `laqta` | 3000 |

---

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection locally
ssh -p 22 your-username@your-vps-ip

# Check SSH key permissions on VPS
ls -la ~/.ssh/
# Should show: authorized_keys with 600 permissions

# Check SSH logs on VPS
sudo tail -f /var/log/auth.log
```

### PM2 Issues

```bash
# View all processes
pm2 status

# View logs
pm2 logs strapi
pm2 logs laqta

# Restart processes
pm2 restart all

# Delete and recreate process
pm2 delete strapi
pm2 start npm --name "strapi" -- run start
```

### Build Failures

```bash
# Check Node.js version
node -v  # Should be 20.x

# Check npm version
npm -v

# Clear npm cache
npm cache clean --force

# Check disk space
df -h
```

---

## Security Notes

- ⚠️ Never commit secrets to your repository
- ⚠️ Never share private keys publicly
- ⚠️ Use strong passwords for database
- ✅ Use Ed25519 SSH keys (more secure than RSA)
- ✅ Restrict SSH key to specific IP if possible
- ✅ Regularly rotate credentials
- ✅ Keep server and dependencies updated
- ✅ Use fail2ban to prevent brute force attacks
