"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/newsletters/subscribe',
            handler: 'newsletter.subscribe',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/newsletters/unsubscribe',
            handler: 'newsletter.unsubscribe',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
