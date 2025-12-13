# VSFTPD FTP Server Configuration Guide

This document explains how to use the FTP server configured by `ftp_config.bash`.

## Overview

The script sets up a **vsftpd** (Very Secure FTP Daemon) server with three user accounts:
- Two restricted users with isolated access
- One admin user with access to all folders

## Server Details

### Default Port

| Protocol | Port | Description |
|----------|------|-------------|
| FTP | **21** | Standard FTP control connection |
| FTP Data | **20** | Active mode data transfer |
| Passive Mode | 1024-65535 | Passive mode data ports (configurable) |

### Server Requirements

- **Operating System**: Linux (Debian/Ubuntu/CentOS)
- **FTP Daemon**: vsftpd
- **Privileges**: Root access required for setup
- **HestiaCP**: Script assumes HestiaCP environment (optional)

---

## User Accounts

### 1. Restricted User: `leqta`

| Property | Value |
|----------|-------|
| Username | `leqta` |
| Default Password | `ChangeMe123!` |
| Home Directory | `/srv/jail/leqta` |
| Writable Directory | `/upload` |
| Shell | `/sbin/nologin` (no SSH access) |

**Access**: Can only read from root of jail, write only to `/upload` subfolder.

### 2. Restricted User: `shohrati`

| Property | Value |
|----------|-------|
| Username | `shohrati` |
| Default Password | `ChangeMe456!` |
| Home Directory | `/srv/jail/shohrati` |
| Writable Directory | `/upload` |
| Shell | `/sbin/nologin` (no SSH access) |

**Access**: Can only read from root of jail, write only to `/upload` subfolder.

### 3. Admin User: `ftpadmin`

| Property | Value |
|----------|-------|
| Username | `ftpadmin` |
| Default Password | `ChangeMeAdmin789!` |
| Home Directory | `/srv/jail/ftpadmin` |
| Accessible Folders | `/leqta_folder`, `/shohrati_folder` |
| Shell | `/sbin/nologin` (no SSH access) |

**Access**: Can read and write to both `leqta` and `shohrati` data folders.

---

## Directory Structure

```
/srv/
├── ftpdata/                    # Actual data storage
│   ├── leqta/                  # leqta's files
│   └── shohrati/               # shohrati's files
│
└── jail/                       # Chroot jails (user home directories)
    ├── leqta/                  # leqta's jail (root-owned)
    │   └── upload/             # Writable folder (bind mount to /srv/ftpdata/leqta)
    │
    ├── shohrati/               # shohrati's jail (root-owned)
    │   └── upload/             # Writable folder (bind mount to /srv/ftpdata/shohrati)
    │
    └── ftpadmin/               # Admin's jail
        ├── leqta_folder/       # Bind mount to /srv/ftpdata/leqta
        └── shohrati_folder/    # Bind mount to /srv/ftpdata/shohrati
```

---

## How to Connect

### Using Command Line FTP Client

```bash
# Connect to the server
ftp your-server-ip

# Login with username and password
Name: leqta
Password: ChangeMe123!

# List files
ls

# Change to upload directory (for writing)
cd upload

# Upload a file
put localfile.txt

# Download a file
get remotefile.txt

# Disconnect
bye
```

### Using FileZilla or Other GUI Clients

1. **Host**: `your-server-ip` or `ftp://your-server-ip`
2. **Port**: `21`
3. **Protocol**: FTP (or FTPS if configured)
4. **Encryption**: Use explicit FTP over TLS if available
5. **Logon Type**: Normal
6. **Username**: `leqta`, `shohrati`, or `ftpadmin`
7. **Password**: As configured

---

## Required VSFTPD Configuration

Ensure your `/etc/vsftpd.conf` has these settings:

```conf
# Basic Settings
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES

# Chroot Configuration (CRITICAL)
chroot_local_user=YES
allow_writeable_chroot=NO
local_root=/srv/jail/%u

# Security Settings
local_umask=022
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES

# Passive Mode (adjust for your firewall)
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=40100
pasv_address=YOUR_SERVER_PUBLIC_IP

# User Restrictions
userlist_enable=YES
userlist_deny=NO
userlist_file=/etc/vsftpd.userlist
```

### Create User Whitelist

```bash
# Create userlist file with allowed users
echo -e "leqta\nshohrati\nftpadmin" | sudo tee /etc/vsftpd.userlist
```

---

## Firewall Configuration

### UFW (Ubuntu)

```bash
# Allow FTP control port
sudo ufw allow 21/tcp

# Allow passive mode range
sudo ufw allow 40000:40100/tcp

# Reload firewall
sudo ufw reload
```

### Firewalld (CentOS/RHEL)

```bash
# Allow FTP service
sudo firewall-cmd --permanent --add-service=ftp

# Allow passive port range
sudo firewall-cmd --permanent --add-port=40000-40100/tcp

# Reload firewall
sudo firewall-cmd --reload
```

### iptables

```bash
# Allow FTP control port
iptables -A INPUT -p tcp --dport 21 -j ACCEPT

# Allow passive mode range
iptables -A INPUT -p tcp --dport 40000:40100 -j ACCEPT

# Save rules
iptables-save > /etc/iptables.rules
```

---

## Post-Installation Steps

### 1. Change Default Passwords (CRITICAL!)

```bash
# Change password for each user
sudo passwd leqta
sudo passwd shohrati
sudo passwd ftpadmin
```

### 2. Restart VSFTPD

```bash
sudo systemctl restart vsftpd
```

### 3. Verify Service Status

```bash
sudo systemctl status vsftpd
```

### 4. Test Connections

```bash
# Test local connection
ftp localhost
```

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "500 OOPS: vsftpd: refusing to run with writable root inside chroot()" | Ensure jail directories are owned by root with 755 permissions |
| "530 Login incorrect" | Check username/password, verify user is in userlist |
| "425 Failed to establish connection" | Check passive mode settings and firewall rules |
| "553 Could not create file" | User is trying to write outside `/upload` directory |

### Check Logs

```bash
# View vsftpd logs
sudo tail -f /var/log/vsftpd.log

# Check system authentication logs
sudo tail -f /var/log/auth.log     # Debian/Ubuntu
sudo tail -f /var/log/secure       # CentOS/RHEL
```

### Verify Bind Mounts

```bash
# Check if mounts are active
mount | grep ftpdata

# Remount if needed
sudo mount -a
```

---

## Security Recommendations

1. **Change all default passwords immediately after setup**
2. **Enable FTPS** (FTP over TLS) for encrypted connections
3. **Restrict passive port range** as narrowly as possible
4. **Monitor logs** for unauthorized access attempts
5. **Regular backups** of `/srv/ftpdata/`
6. **Use fail2ban** to prevent brute-force attacks:
   ```bash
   sudo apt install fail2ban
   ```

---

## Enabling FTPS (Recommended)

### Generate SSL Certificate

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/vsftpd.key \
  -out /etc/ssl/certs/vsftpd.crt
```

### Add to vsftpd.conf

```conf
ssl_enable=YES
rsa_cert_file=/etc/ssl/certs/vsftpd.crt
rsa_private_key_file=/etc/ssl/private/vsftpd.key
allow_anon_ssl=NO
force_local_data_ssl=YES
force_local_logins_ssl=YES
ssl_tlsv1=YES
ssl_sslv2=NO
ssl_sslv3=NO
require_ssl_reuse=NO
ssl_ciphers=HIGH
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start vsftpd | `sudo systemctl start vsftpd` |
| Stop vsftpd | `sudo systemctl stop vsftpd` |
| Restart vsftpd | `sudo systemctl restart vsftpd` |
| Check status | `sudo systemctl status vsftpd` |
| View logs | `sudo tail -f /var/log/vsftpd.log` |
| Change password | `sudo passwd USERNAME` |
| Verify mounts | `mount \| grep ftpdata` |
| Remount all | `sudo mount -a` |

---

## Summary

This FTP server setup provides:
- **Isolated environments** for `leqta` and `shohrati` users
- **Admin oversight** through `ftpadmin` with access to all folders
- **Security** through chroot jails and restricted write access
- **Persistence** through fstab entries for bind mounts

For production use, always enable FTPS and implement additional security measures.
