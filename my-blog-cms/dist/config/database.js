"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => {
    // Use PostgreSQL for development, MariaDB (mysql client) for production
    // Auto-detect based on NODE_ENV, or use DATABASE_CLIENT if explicitly set
    const nodeEnv = env('NODE_ENV', 'development');
    const defaultClient = nodeEnv === 'production' ? 'mysql' : 'postgres';
    const client = env('DATABASE_CLIENT', defaultClient);
    const connections = {
        mysql: {
            connection: {
                host: env('DATABASE_HOST', 'localhost'),
                port: env.int('DATABASE_PORT', 3306),
                database: env('DATABASE_NAME', 'strapi_db_leqta_2'),
                user: env('DATABASE_USERNAME', 'root'),
                password: env('DATABASE_PASSWORD', ''),
                ssl: env.bool('DATABASE_SSL', false) && {
                    key: env('DATABASE_SSL_KEY', undefined),
                    cert: env('DATABASE_SSL_CERT', undefined),
                    ca: env('DATABASE_SSL_CA', undefined),
                    capath: env('DATABASE_SSL_CAPATH', undefined),
                    cipher: env('DATABASE_SSL_CIPHER', undefined),
                    rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
                },
            },
            pool: {
                min: env.int('DATABASE_POOL_MIN', 2),
                max: env.int('DATABASE_POOL_MAX', 10)
            },
        },
        postgres: {
            connection: {
                connectionString: env('DATABASE_URL'),
                host: env('DATABASE_HOST', ''),
                port: env.int('DATABASE_PORT'),
                database: env('DATABASE_NAME', ''),
                user: env('DATABASE_USERNAME', ''),
                password: env('DATABASE_PASSWORD', ''),
                ssl: env.bool('DATABASE_SSL', false) ? {
                    rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
                } : false,
                schema: env('DATABASE_SCHEMA', 'public'),
            },
            pool: {
                min: env.int('DATABASE_POOL_MIN', 2),
                max: env.int('DATABASE_POOL_MAX', 10),
                acquireTimeoutMillis: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
            },
        }
    };
    return {
        connection: {
            client,
            ...connections[client],
            acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
        },
    };
};
