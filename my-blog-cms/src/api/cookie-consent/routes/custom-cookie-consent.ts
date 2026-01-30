/**
 * Custom cookie-consent routes for public access
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/cookie-consent',
            handler: 'cookie-consent.find',
            config: {
                auth: false, // Public access - no authentication required
            },
        },
    ],
};
