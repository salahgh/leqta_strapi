# HestiaCP Mail Server Logs Guide

## Main Mail Logs

```bash
# Exim main log (outgoing mail)
sudo tail -f /var/log/exim4/mainlog

# Exim reject log (rejected emails)
sudo tail -f /var/log/exim4/rejectlog

# Exim panic log (errors)
sudo tail -f /var/log/exim4/paniclog

# Dovecot log (IMAP/POP3)
sudo tail -f /var/log/dovecot.log

# Mail log (general)
sudo tail -f /var/log/mail.log

# Mail error log
sudo tail -f /var/log/mail.err
```

## View Last 100 Lines

```bash
# Exim main log
sudo tail -100 /var/log/exim4/mainlog

# Dovecot log
sudo tail -100 /var/log/dovecot.log

# General mail log
sudo tail -100 /var/log/mail.log
```

## Search Logs for Specific Email

```bash
# Search by email address
sudo grep "user@example.com" /var/log/exim4/mainlog

# Search by domain
sudo grep "example.com" /var/log/exim4/mainlog

# Search for errors
sudo grep -i "error" /var/log/exim4/mainlog

# Search for rejected emails
sudo grep -i "rejected" /var/log/exim4/mainlog
```

## View Logs with Nano

```bash
# Open main log in nano
sudo nano /var/log/exim4/mainlog

# Open dovecot log
sudo nano /var/log/dovecot.log

# Open mail log
sudo nano /var/log/mail.log
```

## Check Mail Queue

```bash
# View mail queue
sudo exim -bp

# Count messages in queue
sudo exim -bpc

# View specific message
sudo exim -Mvh <message-id>
sudo exim -Mvb <message-id>

# Force delivery of all queued mail
sudo exim -qf

# Remove all frozen messages
sudo exim -bp | grep frozen | awk '{print $3}' | xargs sudo exim -Mrm
```

## HestiaCP Mail Commands

```bash
# List mail domains
sudo /usr/local/hestia/bin/v-list-mail-domains admin

# List mail accounts
sudo /usr/local/hestia/bin/v-list-mail-accounts admin domain.com

# Check mail domain config
sudo /usr/local/hestia/bin/v-list-mail-domain admin domain.com
```

## Service Status

```bash
# Check Exim status
sudo systemctl status exim4

# Check Dovecot status
sudo systemctl status dovecot

# Restart mail services
sudo systemctl restart exim4
sudo systemctl restart dovecot
```

## Troubleshooting

### Mail Not Sending

```bash
# Check exim queue
sudo exim -bp

# Test sending
echo "Test" | mail -s "Test Subject" your@email.com

# Check mainlog for errors
sudo tail -50 /var/log/exim4/mainlog
```

### Cannot Receive Mail

```bash
# Check dovecot status
sudo systemctl status dovecot

# Check dovecot log
sudo tail -50 /var/log/dovecot.log

# Verify MX records
dig MX yourdomain.com
```

### Authentication Failures

```bash
# Check for auth errors
sudo grep -i "auth" /var/log/dovecot.log
sudo grep -i "login" /var/log/exim4/mainlog
```
