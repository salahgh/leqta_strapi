whrite a comprehensive pv for the work that have been done on the vps
- configuring required ports for diffrent applications to run on 
both the hestiaCP firewall and ecosnet firewall 
- create simple table for port namber , reason , and used by
rdp , ssh , http , https , 443 , 8080 , 3389 , 8083 , 21 , 12000 , 12100 , 20 , 3306 , 143.993 , 110,995 , 25,465 , 857 , 80 , 443 , 1337 , 3000
- installation of light-weight desktop environment on the vps (XFCE)
  (can be accessed throw windows remote desktop)
- configuring ftp server (vsftpd) with two 3 users 
one for chohrati (read-write)
one for laqta (read-only)
one for laqta-strapi (read-write)
see ftp config for details
- configurring maria db with root password and creating a new user for laqta-strapi
with read-write access to the laqta_strapi database
- configuring the environment variables for laqta-strapi
  (STRAPI_URL, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
- configuring hestiaCP mail server 
- deploying strapi cms
- deploying laqta
