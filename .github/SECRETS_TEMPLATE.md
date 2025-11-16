# GitHub Secrets Configuration Template

Copy this template and fill in your actual values, then add them to:
**GitHub Repository → Settings → Secrets and variables → Actions**

## Required Secrets

### FTP Configuration (Required for both workflows)

```
Secret Name: CPANEL_FTP_SERVER
Value: ftp.yourdomain.com
Notes: Your cPanel FTP server address
```

```
Secret Name: CPANEL_FTP_USERNAME
Value: your_ftp_username
Notes: Usually username@domain.com or just username
```

```
Secret Name: CPANEL_FTP_PASSWORD
Value: your_ftp_password
Notes: Your FTP/cPanel password
```

### SSH Configuration (Required only for deploy-strapi.yml)

```
Secret Name: CPANEL_HOST
Value: server.yourhostingprovider.com
Notes: SSH server hostname or IP address
```

```
Secret Name: CPANEL_SSH_USERNAME
Value: your_cpanel_username
Notes: Your cPanel/SSH username (usually same as FTP)
```

```
Secret Name: CPANEL_SSH_PASSWORD
Value: your_ssh_password
Notes: Your SSH password (usually same as cPanel password)
```

```
Secret Name: CPANEL_SSH_PORT
Value: 22
Notes: SSH port (default: 22, some hosts use 2222)
Optional: Leave empty to use default port 22
```

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the **Name** (e.g., `CPANEL_FTP_SERVER`)
6. Enter the **Value**
7. Click **Add secret**
8. Repeat for each secret

## Verification Checklist

Before deploying, ensure:
- [ ] All required secrets are added to GitHub
- [ ] FTP credentials are tested and working
- [ ] SSH credentials are tested (if using SSH workflow)
- [ ] Server directory path is correct in workflow file
- [ ] .env file exists on cPanel server
- [ ] Database is created in cPanel
- [ ] Node.js app is configured in cPanel

## Security Notes

- ⚠️ Never commit secrets to your repository
- ⚠️ Never share secret values publicly
- ✅ Use strong, unique passwords
- ✅ Regularly rotate credentials
- ✅ Limit FTP/SSH access to necessary users only
