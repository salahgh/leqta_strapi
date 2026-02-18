/**
 * Custom tracking-pixel routes for public access
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/tracking-pixel',
            handler: 'tracking-pixel.find',
            config: {
                auth: false,
            },
        },
    ],
};
