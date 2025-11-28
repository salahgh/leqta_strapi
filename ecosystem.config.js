/**
 * PM2 Ecosystem Configuration
 *
 * This file replaces .env files by defining environment variables directly.
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 start ecosystem.config.js --only strapi
 *   pm2 start ecosystem.config.js --only laqta
 *
 * On VPS, copy this file and edit with your production values:
 *   cp ecosystem.config.js ecosystem.production.js
 *   nano ecosystem.production.js
 *   pm2 start ecosystem.production.js
 */

module.exports = {
  apps: [
    // ==========================================
    // Strapi CMS
    // ==========================================
    {
      name: 'strapi',
      cwd: './my-blog-cms',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        // Server
        HOST: '0.0.0.0',
        PORT: 1337,
        NODE_ENV: 'production',

        // Security Keys (CHANGE THESE IN PRODUCTION!)
        // Generate with: openssl rand -base64 32
        APP_KEYS: 'key1,key2,key3,key4',
        API_TOKEN_SALT: 'your-api-token-salt',
        ADMIN_JWT_SECRET: 'your-admin-jwt-secret',
        TRANSFER_TOKEN_SALT: 'your-transfer-token-salt',
        JWT_SECRET: 'your-jwt-secret',

        // Database (MariaDB/MySQL)
        DATABASE_CLIENT: 'mysql',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: 3306,
        DATABASE_NAME: 'strapi',
        DATABASE_USERNAME: 'strapi_user',
        DATABASE_PASSWORD: 'your_secure_password',
        DATABASE_SSL: 'false',

        // Supabase Storage (optional)
        SUPABASE_API_URL: 'https://your-project.supabase.co',
        SUPABASE_API_KEY: 'your-supabase-key',
        SUPABASE_BUCKET: 'your-bucket-name',
      },
    },

    // ==========================================
    // Next.js Frontend (Laqta)
    // ==========================================
    {
      name: 'laqta',
      cwd: './laqta',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,

        // Strapi API URL
        NEXT_PUBLIC_STRAPI_URL_2: 'http://localhost:1337',
        // Or with domain: 'https://api.yourdomain.com'

        // Odoo Integration (if needed)
        ODOO_URL: 'https://your-odoo-instance.odoo.com',
        ODOO_DB: 'your-db',
        ODOO_USERNAME: 'your-username',
        ODOO_API_KEY: 'your-api-key',
      },
    },
  ],
};
