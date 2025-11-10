"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/services/findByTitle/:title',
            handler: 'service.findByTitle',
            config: {
                auth: false, // This makes it public
            }
        }
    ]
};
