#!/bin/bash
# --------------------------------------------------------------------------------
# VSFTPD CUSTOM USER SETUP SCRIPT
# Creates two restricted FTP users (leqta, shohrati) and one admin user (ftpadmin)
# The admin user can see and manage both restricted folders.
#
# PREREQUISITES:
# 1. This script must be run as root.
# 2. vsftpd must be installed and configured to use chrooting (standard HestiaCP setup).
# 3. vsftpd is assumed to be configured with 'local_root=/srv/jail/%u'.
#
# WARNING: This script uses hardcoded passwords for simplicity. CHANGE THEM
# IMMEDIATELY AFTER RUNNING. For production, use password prompts or key generation.
# --------------------------------------------------------------------------------

# --- CONFIGURATION ---
FTP_DATA_ROOT="/srv/ftpdata"
FTP_JAIL_ROOT="/srv/jail"

USER_LEQTA="leqta"
PASS_LEQTA="ChangeMe123!"

USER_SHOHRATI="shohrati"
PASS_SHOHRATI="ChangeMe456!"

USER_ADMIN="ftpadmin"
PASS_ADMIN="ChangeMeAdmin789!"
# ---------------------

echo "Starting vsftpd custom user setup..."

# 1. Create Base Directories
echo "1. Creating base data directories..."
mkdir -p "$FTP_DATA_ROOT/$USER_LEQTA"
mkdir -p "$FTP_DATA_ROOT/$USER_SHOHRATI"
mkdir -p "$FTP_JAIL_ROOT"

# Ensure root owns the jail parent directory (VSFTPD chroot requirement)
chown root:root "$FTP_JAIL_ROOT"

# 2. Create Users and their Jails (Home directory is the jail root)

# LEQTA USER
echo "2. Creating $USER_LEQTA user and jail..."
useradd -m -d "$FTP_JAIL_ROOT/$USER_LEQTA" -s /sbin/nologin "$USER_LEQTA"
echo "$USER_LEQTA:$PASS_LEQTA" | chpasswd

# SHOHRATI USER
echo "3. Creating $USER_SHOHRATI user and jail..."
useradd -m -d "$FTP_JAIL_ROOT/$USER_SHOHRATI" -s /sbin/nologin "$USER_SHOHRATI"
echo "$USER_SHOHRATI:$PASS_SHOHRATI" | chpasswd

# ADMIN USER
echo "4. Creating $USER_ADMIN admin user and jail..."
useradd -m -d "$FTP_JAIL_ROOT/$USER_ADMIN" -s /sbin/nologin "$USER_ADMIN"
echo "$USER_ADMIN:$PASS_ADMIN" | chpasswd

# 3. Secure Jails and Set Permissions

# VSFTPD requires the jail directory to be owned by root
chown root:root "$FTP_JAIL_ROOT/$USER_LEQTA" "$FTP_JAIL_ROOT/$USER_SHOHRATI" "$FTP_JAIL_ROOT/$USER_ADMIN"
chmod 755 "$FTP_JAIL_ROOT/$USER_LEQTA" "$FTP_JAIL_ROOT/$USER_SHOHRATI" "$FTP_JAIL_ROOT/$USER_ADMIN"

# Set permissions for the actual data directories
echo "5. Setting ownership for actual data folders..."
chown -R "$USER_LEQTA":"$USER_LEQTA" "$FTP_DATA_ROOT/$USER_LEQTA"
chown -R "$USER_SHOHRATI":"$USER_SHOHRATI" "$FTP_DATA_ROOT/$USER_SHOHRATI"

# 4. Configure Write Access for Restricted Users (using sub-directory and bind mount)

# The restricted user's jail must be owned by root, so we create a sub-directory
# for writing and bind-mount the real data folder there.
for user in "$USER_LEQTA" "$USER_SHOHRATI"; do
JAIL_PATH="$FTP_JAIL_ROOT/$user"
DATA_PATH="$FTP_DATA_ROOT/$user"
WRITE_DIR="$JAIL_PATH/upload"

    echo "6. Configuring write access for $user via bind mount..."
    mkdir -p "$WRITE_DIR"
    chown "$user":"$user" "$WRITE_DIR" # User must own the mount point for writing

    # Bind mount the real data folder to the jail's write folder
    mount --bind "$DATA_PATH" "$WRITE_DIR"

    # Add to fstab for persistence (using the 'nofail' option)
    if ! grep -q "$DATA_PATH" /etc/fstab; then
        echo "$DATA_PATH    $WRITE_DIR    none    bind,nofail    0 0" >> /etc/fstab
    fi
done

# 5. Configure Admin Access (Bind Mounts within Admin Jail)

ADMIN_JAIL="$FTP_JAIL_ROOT/$USER_ADMIN"

# Create named access points inside the admin's jail
mkdir -p "$ADMIN_JAIL/leqta_folder"
mkdir -p "$ADMIN_JAIL/shohrati_folder"

# Bind mount the real data folders into the admin's jail
echo "7. Setting up admin access links..."
mount --bind "$FTP_DATA_ROOT/$USER_LEQTA" "$ADMIN_JAIL/leqta_folder"
mount --bind "$FTP_DATA_ROOT/$USER_SHOHRATI" "$ADMIN_JAIL/shohrati_folder"

# Add admin mounts to fstab for persistence
if ! grep -q "$FTP_DATA_ROOT/$USER_LEQTA" /etc/fstab; then
echo "$FTP_DATA_ROOT/$USER_LEQTA    $ADMIN_JAIL/leqta_folder    none    bind,nofail    0 0" >> /etc/fstab
fi
if ! grep -q "$FTP_DATA_ROOT/$USER_SHOHRATI" /etc/fstab; then
echo "$FTP_DATA_ROOT/$USER_SHOHRATI    $ADMIN_JAIL/shohrati_folder    none    bind,nofail    0 0" >> /etc/fstab
fi

# Set admin user to own the links inside the jail (needed for viewing)
chown -R "$USER_ADMIN":"$USER_ADMIN" "$ADMIN_JAIL/leqta_folder" "$ADMIN_JAIL/shohrati_folder"

echo ""
echo "--- SETUP COMPLETE ---"
echo "Users created and permissions set."
echo "The /etc/fstab file has been updated to automatically remount the folders on reboot."
echo "Please restart vsftpd to ensure all changes take effect:"
echo "sudo systemctl restart vsftpd"
echo "----------------------"
echo "Test Accounts:"
echo "User: $USER_LEQTA (Password: $PASS_LEQTA) -> can only write in /upload"
echo "User: $USER_SHOHRATI (Password: $PASS_SHOHRATI) -> can only write in /upload"
echo "User: $USER_ADMIN (Password: $PASS_ADMIN) -> can see /leqta_folder and /shohrati_folder"
echo ""
echo "!!! IMMEDIATELY CHANGE THESE PASSWORDS !!!"


