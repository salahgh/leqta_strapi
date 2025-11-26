Step 1: Find the Let's Encrypt Certificate

# Check where HestiaCP stores mail SSL
sudo ls -la /home/admin/conf/mail/leqta.com/
```
root@server2:~# sudo ls -la /home/mail_user/conf/mail/leqta.com/
total 56
drwxrwx--x 3 Debian-exim mail      4096 nov.  26 16:53 .
drwxr-xr-x 3 root        root      4096 nov.  26 08:43 ..
-rw-rw---- 1 Debian-exim mail        41 nov.  26 09:04 accounts
-rw-rw---- 1 Debian-exim mail         0 nov.  26 08:43 aliases
-rw-rw---- 1 Debian-exim mail         0 nov.  26 08:43 antispam
-rw-rw---- 1 Debian-exim mail         0 nov.  26 08:43 antivirus
-rw-r----- 1 root        mail_user 1375 nov.  26 16:53 apache2.conf
-rw-r----- 1 root        mail_user 1512 nov.  26 16:53 apache2.ssl.conf
-rw-rw---- 1 Debian-exim mail      1704 nov.  26 08:43 dkim.pem
-rw-rw---- 1 Debian-exim mail         0 nov.  26 08:43 fwd_only
-rw-rw---- 1 Debian-exim mail        14 nov.  26 08:43 ip
-rw-rw---- 1 Debian-exim mail        19 nov.  26 09:04 limits
-rw-r----- 1 root        mail_user 1074 nov.  26 16:53 nginx.conf
-rw-r--r-- 1 root        root       159 nov.  26 16:53 nginx.conf_letsencrypt
-rw-r--r-- 1 root        root        45 nov.  26 16:53 nginx.forcessl.conf
-rw-r----- 1 root        mail_user 1491 nov.  26 16:53 nginx.ssl.conf
lrwxrwxrwx 1 root        root        58 nov.  26 16:21 nginx.ssl.conf_letsencrypt -> /home/mail_user/conf/mail/leqta.com/nginx.conf_letsencrypt
-rw-rw---- 1 dovecot     mail       142 nov.  26 14:10 passwd
-rw-r--r-- 1 root        root         0 nov.  26 08:44 reject_spam
drwxr-x--- 2 root        mail      4096 nov.  26 16:53 ssl
```
# Check web domain SSL location
sudo ls -la /home/admin/conf/web/leqta.com/
```
root@server2:~# sudo ls -la /home/mail_user/conf/web/leqta.com/
total 32
drwxr-xr-x 3 root root      4096 nov.  26 17:38 .
drwxr-x--x 4 root root      4096 nov.  26 17:36 ..
-rw-r----- 1 root mail_user 1599 nov.  26 08:43 apache2.conf
-rw-r----- 1 root mail_user 1819 nov.  26 17:38 apache2.ssl.conf
-rw-r----- 1 root mail_user 1523 nov.  26 08:43 nginx.conf
-rw-r--r-- 1 root root       159 nov.  26 17:37 nginx.conf_letsencrypt
-rw-r----- 1 root mail_user 2002 nov.  26 17:38 nginx.ssl.conf
lrwxrwxrwx 1 root root        57 nov.  26 17:37 nginx.ssl.conf_letsencrypt -> /home/mail_user/conf/web/leqta.com/nginx.conf_letsencrypt
drwxr-xr-x 2 root root      4096 nov.  26 17:38 ssl
```
# Find all Let's Encrypt certificates
sudo find /home -name "*.crt" -path "*leqta.com*" 2>/dev/null
sudo find /etc/letsencrypt -name "*.pem" 2>/dev/null
```
root@server2:~# sudo find /home -name "*.crt" -path "*leqta.com*" 2>/dev/null
/home/mail_user/conf/mail/leqta.com/ssl/leqta.com.crt
/home/mail_user/conf/web/mail.leqta.com/ssl/mail.leqta.com.crt
/home/mail_user/conf/web/leqta.com/ssl/leqta.com.crt
```
Step 2: Check What Dovecot is Currently Using

# View Dovecot SSL config
sudo grep -r "ssl_cert\|ssl_key" /etc/dovecot/
```
root@server2:~# sudo grep -r "ssl_cert\|ssl_key" /etc/dovecot/
/etc/dovecot/dovecot-sql.conf.ext:#     ssl_cert, ssl_key      - For sending client-side certificates to server
/etc/dovecot/conf.d/10-ssl.conf:ssl_cert = </usr/local/hestia/ssl/certificate.crt
/etc/dovecot/conf.d/10-ssl.conf:ssl_key = </usr/local/hestia/ssl/certificate.key
/etc/dovecot/conf.d/domains/leqta.com.conf:  ssl_cert = </home/mail_user/conf/mail/leqta.com/ssl/leqta.com.pem
/etc/dovecot/conf.d/domains/leqta.com.conf:  ssl_key = </home/mail_user/conf/mail/leqta.com/ssl/leqta.com.key
```

# Check domain-specific config
sudo ls -la /etc/dovecot/conf.d/

Step 3: Update Dovecot to Use Correct Certificate

# Edit Dovecot SSL config
sudo nano /etc/dovecot/conf.d/10-ssl.conf
```
root@server2:~# sudo ls -la /etc/dovecot/conf.d/
total 96
drwxr-xr-x 3 root root 4096 nov.  26 18:39 .
drwxr-xr-x 6 root root 4096 nov.  26 16:50 ..
-rw-r--r-- 1 root root  138 nov.  25 18:05 10-auth.conf
-rw-r--r-- 1 root root 1781 août   6  2021 10-director.conf
-rw-r--r-- 1 root root   32 nov.  25 18:05 10-logging.conf
-rw-r--r-- 1 root root  221 nov.  25 18:05 10-mail.conf
-rw-r--r-- 1 root root  338 nov.  25 18:05 10-master.conf
-rw-r--r-- 1 root root  697 nov.  25 18:05 10-ssl.conf
-rw-r--r-- 1 root root  291 nov.   6 11:28 10-tcpwrapper.conf
-rw-r--r-- 1 root root 1657 août   6  2021 15-lda.conf
-rw-r--r-- 1 root root 2448 nov.  25 18:05 20-imap.conf
-rw-r--r-- 1 root root 3751 nov.  25 18:05 20-pop3.conf
-rw-r--r-- 1 root root  676 août   6  2021 90-acl.conf
-rw-r--r-- 1 root root  292 août   6  2021 90-plugin.conf
-rw-r--r-- 1 root root 2597 nov.  25 18:05 90-quota.conf
-rw-r--r-- 1 root root  499 août   6  2021 auth-checkpassword.conf.ext
-rw-r--r-- 1 root root  489 août   6  2021 auth-deny.conf.ext
-rw-r--r-- 1 root root  343 août   6  2021 auth-dict.conf.ext
-rw-r--r-- 1 root root  561 août   6  2021 auth-master.conf.ext
-rw-r--r-- 1 root root  200 nov.  25 18:05 auth-passwdfile.conf.ext
-rw-r--r-- 1 root root  788 août   6  2021 auth-sql.conf.ext
-rw-r--r-- 1 root root  611 août   6  2021 auth-static.conf.ext
-rw-r--r-- 1 root root 2182 août   6  2021 auth-system.conf.ext
drwxr-xr-x 2 root root 4096 nov.  26 16:53 domains
```

Change paths to point to Let's Encrypt certificate (likely one of these):

ssl_cert = </home/admin/conf/mail/leqta.com/ssl.crt
ssl_key = </home/admin/conf/mail/leqta.com/ssl.key

Or:

ssl_cert = </home/admin/conf/web/leqta.com/ssl/leqta.com.crt
ssl_key = </home/admin/conf/web/leqta.com/ssl/leqta.com.key

Step 4: Restart and Test
ssl_cert = </home/admin/conf/mail/leqta.com/ssl.crt
ssl_key = </home/admin/conf/mail/leqta.com/ssl.key


Or:

ssl_cert = </home/admin/conf/web/leqta.com/ssl/leqta.com.crt
ssl_key = </home/admin/conf/web/leqta.com/ssl/leqta.com.key

Step 4: Restart and Test

# Restart Dovecot
sudo systemctl restart dovecot

# Test immediately
openssl s_client -connect mail.leqta.com:993 2>/dev/null | openssl x509
-noout -issuer

Run Step 1 first and share the output - we need to find where the Let's
Encrypt certificate actually is.
