module.exports = ({ env }) => ({
    i18n: {
        enabled: true,
        config: {
            defaultLocale: 'en',
            locales: ['en', 'ar', 'fr']
        }
    },
    documentation: {
        enabled: true,
        config: {
            openapi: '3.0.0',
            info: {
                version: '1.0.0',
                title: 'My Blog API',
                description: 'API documentation for my Strapi blog',
                contact: {
                    name: 'API Support',
                    email: 'support@myblog.com'
                }
            },
            servers: [
                {
                    url: 'http://localhost:1337/api',
                    description: 'Development server',
                }
            ],
        }
    },
    upload: {
        config: {
            sizeLimit: 10 * 1024 * 1024, // 10MB
        },
    },
    'color-picker': {
        enabled: true,
    },
});
