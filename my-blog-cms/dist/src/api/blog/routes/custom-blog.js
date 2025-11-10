"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/blogs/title/:title',
            handler: 'blog.findByTitle',
            config: {
                auth: false, // This makes it public
            }
        },
        {
            method: 'GET',
            path: '/blogs/featured',
            handler: 'blog.findFeatured',
            config: {
                auth: false, // This makes it public
            }
        },
        {
            method: 'GET',
            path: '/blogs/category/:category',
            handler: 'blog.findByCategory',
            config: {
                auth: false, // This makes it public
            }
        }
    ]
};
