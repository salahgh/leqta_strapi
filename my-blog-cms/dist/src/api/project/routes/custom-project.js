"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/projects/findByTitle/:title',
            handler: 'project.findByTitle',
            config: {
                auth: false, // This makes it public
            }
        },
        {
            method: 'GET',
            path: '/projects/category/:category',
            handler: 'project.findByCategory',
            config: {
                auth: false, // This makes it public
            }
        },
        {
            method: 'GET',
            path: '/projects/featured',
            handler: 'project.findFeatured',
            config: {
                auth: false, // This makes it public
            }
        },
        {
            method: 'GET',
            path: '/projects/slug/:slug',
            handler: 'project.findBySlug',
            config: {
                auth: false, // This makes it public
            }
        }
    ]
};
