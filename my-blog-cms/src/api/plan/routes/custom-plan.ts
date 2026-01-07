/**
 * Custom public routes for plan
 * These routes allow unauthenticated access to plans
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/plans',
            handler: 'plan.find',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/plans/:id',
            handler: 'plan.findOne',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
