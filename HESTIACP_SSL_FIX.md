# HestiaCP Dovecot SSL Fix Guide

## Problem

```
pop3-login: Error: Failed to initialize SSL server context: Can't load SSL certificate (ssl_cert setting): error:0A00008B:SSL routines::unknown command: section=system_default, cmd=system_default, arg=hestia_openssl_sect
```

This error means OpenSSL configuration has invalid entries that prevent Dovecot from loading SSL certificates.

---

## Step 1: Fix OpenSSL Configuration

**Why:** The OpenSSL config file (`openssl.cnf`) contains broken HestiaCP entries. OpenSSL cannot parse these lines, causing all SSL operations to fail.

```bash
# Backup current config (safety measure in case we need to restore)
sudo cp /etc/ssl/openssl.cnf /etc/ssl/openssl.cnf.backup

# Find the problematic lines and their line numbers
sudo grep -n "hestia_openssl_sect\|system_default" /etc/ssl/openssl.cnf

# Open the file for editing
sudo nano /etc/ssl/openssl.cnf
```

**What to do:** Find and delete or comment out (add `#` at start) these lines:

```
[system_default]
system_default = hestia_openssl_sect

[hestia_openssl_sect]
```

Save with `Ctrl+O`, exit with `Ctrl+X`.

---

## Step 2: Check Dovecot SSL Configuration

**Why:** Dovecot needs correct paths to SSL certificate files. Wrong paths = SSL won't work.

```bash
# Open Dovecot SSL config
sudo nano /etc/dovecot/conf.d/10-ssl.conf
```

**What to verify:** These lines should exist with correct paths:

```
ssl = yes
ssl_cert = </usr/local/hestia/ssl/certificate.crt
ssl_key = </usr/local/hestia/ssl/certificate.key
```

---

## Step 3: Verify Certificate Files Exist

**Why:** If certificate files are missing or corrupted, we need to regenerate them.

```bash
# Check if certificate files exist
sudo ls -la /usr/local/hestia/ssl/

# Verify certificate is valid and not expired
sudo openssl x509 -in /usr/local/hestia/ssl/certificate.crt -text -noout

# Check expiry date
sudo openssl x509 -in /usr/local/hestia/ssl/certificate.crt -enddate -noout
```

---

## Step 4: Regenerate SSL Certificate (if needed)

**Why:** If certificates are missing, expired, or corrupted, generate fresh ones.

```bash
# Regenerate HestiaCP system SSL certificate
sudo /usr/local/hestia/bin/v-update-sys-hestia-ssl

# For a specific mail domain
sudo /usr/local/hestia/bin/v-update-mail-domain-ssl admin yourdomain.com
```

---

## Step 5: Restart Services

**Why:** Services keep old configuration in memory. Restart forces them to load the fixed settings.

```bash
# Restart Dovecot (IMAP/POP3 server)
sudo systemctl restart dovecot

# Restart Exim (SMTP server)
sudo systemctl restart exim4

# Restart web server
sudo systemctl restart apache2
```

---

## Step 6: Verify the Fix

**Why:** Confirm SSL is working and no more errors appear.

```bash
# Check Dovecot logs for errors
sudo tail -20 /var/log/dovecot.log

# Test POP3 SSL connection (port 995)
openssl s_client -connect localhost:995

# Test IMAP SSL connection (port 993)
openssl s_client -connect localhost:993

# Check Dovecot SSL configuration
sudo doveconf -n | grep ssl
```

**Success indicators:**
- No SSL errors in logs
- `openssl s_client` shows certificate details
- Mail clients can connect via SSL

---

## Quick One-Liner Fix

If you want to try a quick fix:

```bash
# Remove problematic lines and restart
sudo sed -i '/hestia_openssl_sect/d' /etc/ssl/openssl.cnf && sudo sed -i '/system_default.*=.*hestia/d' /etc/ssl/openssl.cnf && sudo systemctl restart dovecot
```

---

## Troubleshooting

### Still getting SSL errors

```bash
# Check OpenSSL can read the certificate
sudo openssl x509 -in /usr/local/hestia/ssl/certificate.crt -noout

# Check for syntax errors in openssl.cnf
sudo openssl version -a
```

### Certificate and key don't match

```bash
# Compare MD5 hashes (should be identical)
sudo openssl x509 -noout -modulus -in /usr/local/hestia/ssl/certificate.crt | openssl md5
sudo openssl rsa -noout -modulus -in /usr/local/hestia/ssl/certificate.key | openssl md5
```

### Dovecot won't start

```bash
# Check Dovecot configuration for errors
sudo doveconf -n

# Check systemd status
sudo systemctl status dovecot

# View detailed errors
sudo journalctl -u dovecot -n 50
```
