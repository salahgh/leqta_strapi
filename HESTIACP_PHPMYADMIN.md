# HestiaCP + phpMyAdmin Configuration Guide

## Check Current Status

```bash
# Check if phpMyAdmin is installed
ls -la /usr/share/phpmyadmin/

# Check HestiaCP phpMyAdmin status
v-list-sys-config | grep -i phpmyadmin

# Check which web server is running
systemctl status apache2
systemctl status nginx
```

## Install phpMyAdmin (if not installed)

```bash
# Install via HestiaCP
v-add-sys-phpmy-admin

# Or install via apt
apt update && apt install phpmyadmin -y
```

## Configure Access for Apache

```bash
# Create phpMyAdmin config using nano
nano /etc/apache2/conf-available/phpmyadmin.conf
```

Add the following content:

```apache
Alias /phpmyadmin /usr/share/phpmyadmin
<Directory /usr/share/phpmyadmin>
    Options FollowSymLinks
    DirectoryIndex index.php
    AllowOverride All
    Require all granted
</Directory>
```

Save with `Ctrl+O`, then exit with `Ctrl+X`.

```bash
# Enable the config
a2enconf phpmyadmin

# Restart Apache
systemctl restart apache2
```

## For Nginx (if using Nginx)

```bash
# Create symbolic link
ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin

# Restart Nginx
systemctl restart nginx
```

## Get MySQL Credentials

```bash
# View MySQL config
v-list-sys-mysql-config

# Get root password using grep
grep -i password /usr/local/hestia/conf/mysql.conf

# Or view full config with nano
nano /usr/local/hestia/conf/mysql.conf
```

## Reset MySQL Root Password (if needed)

```bash
v-change-sys-mysql-config root_password "majmajBS13.."
```

## Firewall Configuration

```bash
# Check if port 8083 is open
v-list-firewall

# Add firewall rule if needed
v-add-firewall-rule ACCEPT 0.0.0.0/0 8083 tcp
```

## Access URLs

After configuration, access phpMyAdmin at:

- `https://your-server-ip:8083/phpmyadmin/`
- `https://your-domain:8083/phpmyadmin/`

## Verify Everything Works

```bash
# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Check Apache/Nginx error logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log

# Check HestiaCP logs
tail -f /var/log/hestia/nginx-error.log
```

## Troubleshooting

### Cannot Access phpMyAdmin

1. Check firewall allows port 8083
2. Verify web server is running
3. Check HestiaCP logs

### Authentication Issues

1. Verify MySQL credentials in `/usr/local/hestia/conf/mysql.conf`
2. Reset password using `v-change-sys-mysql-config` if needed


xLwy44IwfEMYXxNB