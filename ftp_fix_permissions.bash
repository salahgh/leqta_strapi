#!/bin/bash
# --------------------------------------------------------------------------------
# FTP PERMISSIONS FIX SCRIPT
# Run this AFTER ftp_config.bash to fix file visibility issues
#
# This script fixes:
# 1. leqta/shohrati can't create files in /upload
# 2. Files created by ftpadmin not visible to leqta/shohrati
# --------------------------------------------------------------------------------

echo "=== FTP Permissions Fix Script ==="
echo ""

# --- CONFIGURATION (must match original script) ---
FTP_DATA_ROOT="/srv/ftpdata"
FTP_GROUP="ftpusers"
USER_LEQTA="leqta"
USER_SHOHRATI="shohrati"
USER_ADMIN="ftpadmin"
# ---------------------------------------------------

# 1. Create shared groupuse
echo "1. Creating shared group: $FTP_GROUP..."
groupadd -f "$FTP_GROUP"

# 2. Add all users to the shared group
echo "2. Adding users to shared group..."
usermod -aG "$FTP_GROUP" "$USER_LEQTA"
usermod -aG "$FTP_GROUP" "$USER_SHOHRATI"
usermod -aG "$FTP_GROUP" "$USER_ADMIN"

echo "   - $USER_LEQTA added to $FTP_GROUP"
echo "   - $USER_SHOHRATI added to $FTP_GROUP"
echo "   - $USER_ADMIN added to $FTP_GROUP"

# 3. Fix ownership and permissions on data directories
echo "3. Fixing data directory permissions..."

# leqta folder: user=leqta, group=ftpusers, SetGID enabled
chown -R "$USER_LEQTA":"$FTP_GROUP" "$FTP_DATA_ROOT/$USER_LEQTA"
chmod 2775 "$FTP_DATA_ROOT/$USER_LEQTA"
find "$FTP_DATA_ROOT/$USER_LEQTA" -type d -exec chmod 2775 {} \;
find "$FTP_DATA_ROOT/$USER_LEQTA" -type f -exec chmod 0664 {} \;

echo "   - $FTP_DATA_ROOT/$USER_LEQTA: owner=$USER_LEQTA, group=$FTP_GROUP, mode=2775"

# shohrati folder: user=shohrati, group=ftpusers, SetGID enabled
chown -R "$USER_SHOHRATI":"$FTP_GROUP" "$FTP_DATA_ROOT/$USER_SHOHRATI"
chmod 2775 "$FTP_DATA_ROOT/$USER_SHOHRATI"
find "$FTP_DATA_ROOT/$USER_SHOHRATI" -type d -exec chmod 2775 {} \;
find "$FTP_DATA_ROOT/$USER_SHOHRATI" -type f -exec chmod 0664 {} \;

echo "   - $FTP_DATA_ROOT/$USER_SHOHRATI: owner=$USER_SHOHRATI, group=$FTP_GROUP, mode=2775"

# 4. Update vsftpd.conf for proper umask
echo "4. Updating vsftpd configuration..."

VSFTPD_CONF="/etc/vsftpd.conf"

# Backup config if not already backed up
if [ ! -f "$VSFTPD_CONF.backup" ]; then
    cp "$VSFTPD_CONF" "$VSFTPD_CONF.backup"
    echo "   - Backup created: $VSFTPD_CONF.backup"
fi

# Set umask to 002 (files: 664, dirs: 775 - group writable)
if grep -q "^local_umask=" "$VSFTPD_CONF"; then
    sed -i 's/^local_umask=.*/local_umask=002/' "$VSFTPD_CONF"
elif grep -q "^#local_umask=" "$VSFTPD_CONF"; then
    sed -i 's/^#local_umask=.*/local_umask=002/' "$VSFTPD_CONF"
else
    echo "local_umask=002" >> "$VSFTPD_CONF"
fi
echo "   - local_umask=002"

# Set file_open_mode to 0775
if grep -q "^file_open_mode=" "$VSFTPD_CONF"; then
    sed -i 's/^file_open_mode=.*/file_open_mode=0775/' "$VSFTPD_CONF"
else
    echo "file_open_mode=0775" >> "$VSFTPD_CONF"
fi
echo "   - file_open_mode=0775"

# 5. Restart vsftpd
echo "5. Restarting vsftpd..."
systemctl restart vsftpd

if systemctl is-active --quiet vsftpd; then
    echo "   - vsftpd restarted successfully"
else
    echo "   - ERROR: vsftpd failed to restart!"
    echo "   - Check: systemctl status vsftpd"
fi

echo ""
echo "=== FIX COMPLETE ==="
echo ""
echo "What was fixed:"
echo "  ✓ Created shared group '$FTP_GROUP'"
echo "  ✓ Added all FTP users to shared group"
echo "  ✓ Set group ownership on data folders"
echo "  ✓ Enabled SetGID (2775) so new files inherit group"
echo "  ✓ Set vsftpd umask to 002 (group-writable files)"
echo ""
echo "Verify with:"
echo "  groups $USER_LEQTA"
echo "  groups $USER_ADMIN"
echo "  ls -la $FTP_DATA_ROOT/"
echo ""
echo "Test:"
echo "  1. Login as ftpadmin → create file in leqta_folder"
echo "  2. Login as leqta → file should be visible in /upload"
echo ""
