/**
 * Custom partner-request routes
 */

export default {
    routes: [
        {
            method: 'POST',
            path: '/partner-requests/submit',
            handler: 'partner-request.submit',
            config: {
                auth: false,
            },
        },
    ],
};
