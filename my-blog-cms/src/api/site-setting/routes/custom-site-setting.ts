/**
 * Custom public routes for site-setting
 * These routes allow unauthenticated access to site settings
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/site-setting',
            handler: 'site-setting.find',
            config: {
                auth: false, // Allow public access
                policies: [],
                middlewares: [],
            },
        },
    ],
};
