# WordPress Installation Guide for HestiaCP (CLI Only)

## Server Details
- **Hostname:** server2.leqta.com
- **OS:** Ubuntu 22.04
- **HestiaCP Version:** 1.9.4
- **PHP Version:** 8.3
- **HestiaCP User:** chohrati_user
- **SSH User:** saleh
- **Domain:** chohrati.com
- **Database:** chohrati_user_wp_db
- **DB User:** chohrati_user_wp_db_user
- **DB Password:** majmajBS13..

---

## Current Status

| Item | Status |
|------|--------|
| Domain (chohrati.com) | ✅ Created |
| Database (chohrati_user_wp_db) | ✅ Created |
| DB User (chohrati_user_wp_db_user) | ✅ Created |
| PHP 8.3 | ✅ Installed |
| SSL | ❌ Not enabled |

---

## Step 1: Connect via SSH

```bash
ssh saleh@YOUR_SERVER_IP
```

---

## Step 2: Switch to HestiaCP User

```bash
sudo su - chohrati_user -s /bin/bash
```

---

## Step 3: Navigate to Web Directory

```bash
cd ~/web/chohrati.com/public_html
ls -la
```

---

## Step 4: Clean Directory

```bash
rm -rf ./*
```

---

## Step 5: Download WordPress

```bash
wget https://wordpress.org/latest.tar.gz
tar -xvzf latest.tar.gz
mv wordpress/* .
rm -rf wordpress latest.tar.gz
```

---

## Step 6: Create WordPress Config

```bash
cp wp-config-sample.php wp-config.php
nano wp-config.php
```

**Update these lines:**

```php
define( 'DB_NAME', 'chohrati_user_wp_db' );
define( 'DB_USER', 'chohrati_user_wp_db_user' );
define( 'DB_PASSWORD', 'majmajBS13..' );
define( 'DB_HOST', 'localhost' );
```

**Generate security keys:** https://api.wordpress.org/secret-key/1.1/salt/

Replace placeholder keys with generated ones.

Save: `Ctrl+X`, `Y`, `Enter`

---

## Step 7: Set Permissions

```bash
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

---

## Step 8: Exit User Shell

```bash
exit
```

---

## Step 9: Enable SSL

```bash
sudo v-add-letsencrypt-domain chohrati_user chohrati.com
```

---

## Step 10: Add SSL Config to WordPress

```bash
sudo su - chohrati_user -s /bin/bash
nano ~/web/chohrati.com/public_html/wp-config.php
```

Add before `/* That's all, stop editing! */`:

```php
define('FORCE_SSL_ADMIN', true);
if ($_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')
    $_SERVER['HTTPS'] = 'on';
```

Save and exit.

---

## Step 11: Complete Browser Installation

```
https://chohrati.com
```

---

## Quick Commands (Copy & Paste)

```bash
sudo su - chohrati_user -s /bin/bash
cd ~/web/chohrati.com/public_html
rm -rf ./*
wget https://wordpress.org/latest.tar.gz
tar -xvzf latest.tar.gz
mv wordpress/* .
rm -rf wordpress latest.tar.gz
cp wp-config-sample.php wp-config.php
nano wp-config.php
```

After editing config:

```bash
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
exit
sudo v-add-letsencrypt-domain chohrati_user chohrati.com
```

---

## Useful HestiaCP Commands

```bash
sudo v-list-sys-info
sudo v-list-user chohrati_user
sudo v-list-web-domains chohrati_user
sudo v-list-databases chohrati_user
sudo v-list-web-domain chohrati_user chohrati.com
sudo v-restart-web
sudo v-restart-proxy
sudo v-list-sys-services
sudo v-add-letsencrypt-domain chohrati_user chohrati.com
sudo v-rebuild-web-domains chohrati_user
```

---

## Troubleshooting

```bash
# Check file ownership
ls -la /home/chohrati_user/web/chohrati.com/public_html

# Fix ownership
sudo chown -R chohrati_user:chohrati_user /home/chohrati_user/web/chohrati.com/public_html

# Check logs
sudo tail -f /var/log/hestia/nginx-error.log
sudo tail -f /var/log/hestia/apache2-error.log

# Rebuild web config
sudo v-rebuild-web-domains chohrati_user
```

---

## Credentials Summary

| Item | Value |
|------|-------|
| Domain | chohrati.com |
| Database Name | chohrati_user_wp_db |
| Database User | chohrati_user_wp_db_user |
| Database Password | majmajBS13.. |
| Database Host | localhost |
| Web Directory | ~/web/chohrati.com/public_html |
