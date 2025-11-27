# Installing a GUI FTP Server on Linux

A comprehensive guide to installing and configuring an FTP server with a web-based GUI for easy administration by non-technical users.

---

## Table of Contents

1. [Overview](#overview)
2. [Comparison of GUI Options](#comparison-of-gui-options)
3. [Option 1: Webmin + ProFTPD (Recommended)](#option-1-webmin--proftpd-recommended)
4. [Option 2: Cockpit + vsftpd](#option-2-cockpit--vsftpd)
5. [Option 3: HestiaCP Built-in FTP](#option-3-hestiacp-built-in-ftp)
6. [Using Webmin GUI for Common Tasks](#using-webmin-gui-for-common-tasks)
7. [Security Best Practices](#security-best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers installing an FTP server with a web-based GUI management interface. This provides:

- Easy web-based administration (no command line needed)
- User management with clicks
- Visual configuration of FTP settings
- Real-time monitoring and logs
- Secure FTPS (FTP over SSL) support

---

## Comparison of GUI Options

| Feature | Webmin + ProFTPD | Cockpit + vsftpd | HestiaCP |
|---------|------------------|------------------|----------|
| Ease of Use | Excellent | Good | Excellent |
| FTP-Specific GUI | Yes (dedicated module) | No (terminal only) | Yes |
| User Management | Full GUI | Full GUI | Full GUI |
| SSL/TLS Setup | GUI Wizard | Manual | GUI |
| Resource Usage | Medium | Low | Medium |
| Best For | Dedicated FTP server | General server admin | Web hosting + FTP |
| Price | Free | Free | Free |

**Recommendation**: Use **Webmin + ProFTPD** for the best FTP-focused GUI experience.

---

## Option 1: Webmin + ProFTPD (Recommended)

Webmin is a web-based system administration tool that provides a user-friendly GUI for managing FTP servers.

### Step 1: Update Your System

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install ProFTPD

```bash
sudo apt install proftpd -y
```

During installation, select **"Standalone"** mode when prompted.

Verify installation:

```bash
sudo systemctl status proftpd
```

### Step 3: Install Webmin

Add the Webmin repository and install:

```bash
# Install dependencies
sudo apt install software-properties-common apt-transport-https wget curl -y

# Add Webmin GPG key (new method for Ubuntu 22.04+)
curl -fsSL https://download.webmin.com/jcameron-key.asc | sudo gpg --dearmor -o /usr/share/keyrings/webmin.gpg

# Add Webmin repository
echo "deb [signed-by=/usr/share/keyrings/webmin.gpg] http://download.webmin.com/download/repository sarge contrib" | sudo tee /etc/apt/sources.list.d/webmin.list

# Update and install Webmin
sudo apt update
sudo apt install webmin -y
```

For older Ubuntu/Debian versions:

```bash
# Add Webmin GPG key (legacy method)
wget -qO - http://www.webmin.com/jcameron-key.asc | sudo apt-key add -

# Add Webmin repository
sudo add-apt-repository "deb http://download.webmin.com/download/repository sarge contrib"

# Update and install Webmin
sudo apt update
sudo apt install webmin -y
```

### Step 4: Configure Firewall

```bash
# Allow FTP ports
sudo ufw allow 20/tcp
sudo ufw allow 21/tcp

# Allow passive FTP ports
sudo ufw allow 30000:31000/tcp

# Allow Webmin
sudo ufw allow 10000/tcp

# Enable firewall
sudo ufw enable

# Verify rules
sudo ufw status
```

### Step 5: Configure ProFTPD

Edit the configuration file:

```bash
sudo nano /etc/proftpd/proftpd.conf
```

Add or modify these settings:

```apache
# Server name displayed to clients
ServerName "My FTP Server"

# Disable IPv6 if not needed
UseIPv6 off

# Default root directory (chroot users to their home)
DefaultRoot ~

# Disable shell requirement for FTP-only users
RequireValidShell off

# Passive mode configuration (important for firewalls)
PassivePorts 30000 31000

# Logging
TransferLog /var/log/proftpd/xferlog
SystemLog /var/log/proftpd/proftpd.log

# Security settings
MaxLoginAttempts 3
TimeoutNoTransfer 600
TimeoutStalled 600
TimeoutIdle 1200
```

Save and restart ProFTPD:

```bash
sudo systemctl restart proftpd
```

### Step 6: Access Webmin GUI

1. Open your web browser
2. Navigate to: `https://your-server-ip:10000`
3. Accept the self-signed certificate warning (click "Advanced" → "Proceed")
4. Login with your Linux root or sudo user credentials

### Step 7: Navigate to ProFTPD Module

1. In the left sidebar, click **Servers**
2. Click **ProFTPD Server**
3. You now have full GUI access to all FTP settings

---

## Option 2: Cockpit + vsftpd

Cockpit is a modern, lightweight web-based interface for Linux servers.

### Step 1: Install vsftpd

```bash
sudo apt install vsftpd -y
```

### Step 2: Install Cockpit

```bash
sudo apt install cockpit -y
sudo systemctl enable --now cockpit.socket
```

### Step 3: Configure Firewall

```bash
sudo ufw allow 9090/tcp   # Cockpit
sudo ufw allow 21/tcp     # FTP
sudo ufw allow 20/tcp     # FTP data
```

### Step 4: Access Cockpit

1. Open browser: `https://your-server-ip:9090`
2. Login with your Linux credentials
3. Manage users via **Accounts** section
4. Use **Terminal** for FTP-specific configuration

**Note**: Cockpit doesn't have a dedicated FTP module. You'll manage users via GUI but configure vsftpd via the built-in terminal.

---

## Option 3: HestiaCP Built-in FTP

If you already have HestiaCP installed, it includes FTP user management.

### Access HestiaCP FTP Management

1. Login to HestiaCP: `https://your-server-ip:8083`
2. Go to **User** → Select a user
3. Click **FTP Accounts**
4. Add, edit, or delete FTP accounts

### Create FTP Account in HestiaCP

1. Navigate to the user's FTP section
2. Click **Add FTP Account**
3. Enter:
   - FTP Username
   - FTP Password
   - Path (directory access)
4. Click **Save**

---

## Using Webmin GUI for Common Tasks

### Creating a New FTP User

1. Go to **System → Users and Groups**
2. Click **Create a new user**
3. Fill in the form:

| Field | Value | Description |
|-------|-------|-------------|
| Username | `ftpuser1` | The FTP login name |
| User ID | Auto | Leave as automatic |
| Real name | `FTP User 1` | Display name |
| Home directory | `/home/ftpuser1` | Where user's files are stored |
| Shell | `/usr/sbin/nologin` | Prevents SSH access (FTP only) |
| Password | `********` | Set a strong password |
| Password again | `********` | Confirm password |

4. Click **Create**
5. The user can now connect via FTP

### Setting Up FTP Directory Structure

1. Go to **Others → File Manager**
2. Navigate to `/home/ftpuser1`
3. Click **New → Create directory**
4. Create folders like: `uploads`, `downloads`, `public`
5. To set permissions:
   - Select a folder
   - Click **Info**
   - Set Owner/Group permissions
   - Click **Save**

### Viewing FTP Logs

1. Go to **Servers → ProFTPD Server**
2. Click **View Logfiles**
3. Select which log to view:
   - **Transfer Log**: File uploads/downloads
   - **System Log**: Connections and errors
4. Logs update in real-time

### Enabling FTPS (Secure FTP)

1. Go to **Servers → ProFTPD Server**
2. Click **SSL/TLS Options**
3. Configure:

| Setting | Value |
|---------|-------|
| Enable TLS | Yes |
| Certificate file | `/etc/ssl/certs/proftpd.crt` |
| Private key file | `/etc/ssl/private/proftpd.key` |
| Require TLS for logins | Yes |
| Require TLS for data | Yes |

4. If you don't have certificates, click **Generate SSL Certificate**
5. Click **Save**
6. Restart ProFTPD

### Setting Upload/Download Limits

1. Go to **Servers → ProFTPD Server**
2. Click **Global Configuration**
3. Set limits:

| Setting | Description |
|---------|-------------|
| Max upload bandwidth | Limit upload speed per user |
| Max download bandwidth | Limit download speed per user |
| Max clients | Total simultaneous connections |
| Max clients per host | Connections from same IP |

4. Click **Save**

### Blocking/Allowing IP Addresses

1. Go to **Servers → ProFTPD Server**
2. Click **Edit Config Files** or **Limit Access**
3. Add rules:

```apache
# Allow specific IP
<Limit LOGIN>
  Allow from 192.168.1.0/24
  Allow from 10.0.0.50
  DenyAll
</Limit>

# Or deny specific IP
<Limit LOGIN>
  Deny from 192.168.1.100
  AllowAll
</Limit>
```

4. Click **Save**
5. Restart ProFTPD

### Managing Virtual Hosts

1. Go to **Servers → ProFTPD Server**
2. Click **Virtual Servers**
3. Click **Create a new virtual server**
4. Configure:
   - IP address
   - Port
   - Server name
   - Default directory
5. Click **Create**

---

## Webmin GUI Screenshots Guide

### Main Dashboard
After logging into Webmin, you'll see:
- System information (CPU, memory, disk)
- Quick access to common modules
- Server status overview

### ProFTPD Module
The ProFTPD module shows:
- **Global Configuration**: Server-wide settings
- **Virtual Servers**: Host multiple FTP sites
- **Anonymous FTP**: Configure public access (usually disabled)
- **Per-Directory Options**: Set rules for specific folders
- **Edit Config Files**: Direct access to configuration
- **View Logfiles**: Real-time log viewer
- **Module Config**: Webmin module settings

### User Management
The Users and Groups module provides:
- List of all system users
- Create/Edit/Delete users
- Password management
- Group assignments
- Home directory management

---

## Security Best Practices

### 1. Use FTPS Instead of Plain FTP

In Webmin → ProFTPD → SSL/TLS Options:
- Enable TLS
- Force TLS for all connections
- Use TLS 1.2 or higher

### 2. Chroot Users to Their Home Directory

Already configured with `DefaultRoot ~` in proftpd.conf. This prevents users from accessing files outside their home directory.

### 3. Disable Anonymous Access

In Webmin → ProFTPD → Anonymous FTP:
- Remove or disable all anonymous configurations
- Verify no anonymous access is allowed

### 4. Set Strong Password Policies

In Webmin → System → Users and Groups:
- Enforce minimum password length (12+ characters)
- Require password complexity
- Set password expiration

### 5. Limit Login Attempts

In proftpd.conf:
```apache
MaxLoginAttempts 3
BanOnEvent MaxLoginAttempts 1
BanTable /var/run/proftpd/ban.tab
```

### 6. Use Fail2Ban

```bash
# Install fail2ban
sudo apt install fail2ban -y

# Create ProFTPD jail
sudo nano /etc/fail2ban/jail.local
```

Add:
```ini
[proftpd]
enabled = true
port = ftp,ftp-data,ftps,ftps-data
filter = proftpd
logpath = /var/log/proftpd/proftpd.log
maxretry = 3
bantime = 3600
```

Restart fail2ban:
```bash
sudo systemctl restart fail2ban
```

### 7. Regular Backups

In Webmin → Webmin → Backup Configuration Files:
- Schedule daily backups of FTP configuration
- Store backups offsite

### 8. Keep Software Updated

```bash
# Update all packages regularly
sudo apt update && sudo apt upgrade -y
```

---

## Troubleshooting

### Cannot Access Webmin

```bash
# Check if Webmin is running
sudo systemctl status webmin

# Start Webmin if stopped
sudo systemctl start webmin

# Restart Webmin
sudo systemctl restart webmin

# Check firewall
sudo ufw status
sudo ufw allow 10000/tcp

# Check Webmin port
sudo netstat -tlnp | grep 10000
```

### FTP Connection Refused

```bash
# Check if ProFTPD is running
sudo systemctl status proftpd

# Start ProFTPD if stopped
sudo systemctl start proftpd

# Restart ProFTPD
sudo systemctl restart proftpd

# Check firewall
sudo ufw status
sudo ufw allow 21/tcp
sudo ufw allow 20/tcp

# Check if port 21 is listening
sudo netstat -tlnp | grep 21
```

### Passive Mode Not Working

```bash
# Verify passive ports are open in firewall
sudo ufw allow 30000:31000/tcp

# Check proftpd.conf has PassivePorts configured
grep PassivePorts /etc/proftpd/proftpd.conf

# Add if missing
echo "PassivePorts 30000 31000" | sudo tee -a /etc/proftpd/proftpd.conf

# Restart ProFTPD
sudo systemctl restart proftpd
```

### Users Cannot Login

```bash
# Check user exists
id ftpuser1

# Check user's shell
grep ftpuser1 /etc/passwd
# Should show: ftpuser1:x:1001:1001::/home/ftpuser1:/usr/sbin/nologin

# Verify RequireValidShell is off
grep RequireValidShell /etc/proftpd/proftpd.conf
# Should show: RequireValidShell off

# Check user's home directory exists
ls -la /home/ftpuser1

# Check permissions
ls -la /home/ | grep ftpuser1
```

### Permission Denied Errors

```bash
# Check directory ownership
ls -la /home/ftpuser1

# Fix ownership
sudo chown ftpuser1:ftpuser1 /home/ftpuser1

# Fix permissions
sudo chmod 755 /home/ftpuser1
```

### View Detailed Logs

```bash
# ProFTPD system log
sudo tail -f /var/log/proftpd/proftpd.log

# ProFTPD transfer log
sudo tail -f /var/log/proftpd/xferlog

# Or in Webmin: Servers → ProFTPD → View Logfiles
```

### Test Configuration

```bash
# Test ProFTPD configuration syntax
sudo proftpd -t

# Expected output: Checking syntax of configuration file
# no problems detected
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Start ProFTPD | `sudo systemctl start proftpd` |
| Stop ProFTPD | `sudo systemctl stop proftpd` |
| Restart ProFTPD | `sudo systemctl restart proftpd` |
| Check ProFTPD status | `sudo systemctl status proftpd` |
| Test ProFTPD config | `sudo proftpd -t` |
| View ProFTPD logs | `sudo tail -f /var/log/proftpd/proftpd.log` |
| Start Webmin | `sudo systemctl start webmin` |
| Stop Webmin | `sudo systemctl stop webmin` |
| Restart Webmin | `sudo systemctl restart webmin` |
| Check Webmin status | `sudo systemctl status webmin` |
| Create FTP user | `sudo useradd -m -s /usr/sbin/nologin ftpuser` |
| Set user password | `sudo passwd ftpuser` |
| Delete FTP user | `sudo userdel -r ftpuser` |

---

## Summary

For non-technical users, **Webmin + ProFTPD** is the best solution because:

| Benefit | Description |
|---------|-------------|
| Web-based GUI | No command line required for daily tasks |
| User-friendly | Create users, set permissions with clicks |
| All-in-one | Manage FTP, users, files from one interface |
| Secure | Easy SSL/TLS setup for FTPS |
| Visual logs | See FTP activity in real-time |
| Well-documented | Large community and documentation |
| Free | No licensing costs |

### Access URLs

| Service | URL | Default Port |
|---------|-----|--------------|
| Webmin Admin Panel | `https://your-server-ip:10000` | 10000 |
| FTP Server | `ftp://your-server-ip` | 21 |
| FTPS Server | `ftps://your-server-ip` | 21 (with TLS) |

---

## Additional Resources

- [Webmin Official Documentation](https://webmin.com/docs/)
- [ProFTPD Official Documentation](http://www.proftpd.org/docs/)
- [Ubuntu Server Guide - FTP](https://ubuntu.com/server/docs/service-ftp)
- [Webmin ProFTPD Module Guide](https://webmin.com/docs/modules/proftpd-server/)
