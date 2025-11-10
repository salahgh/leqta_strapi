"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/missions/title/:title',
            handler: 'mission.findByTitle',
            config: {
                auth: false, // This makes it public
            }
        },
        {
            method: 'GET',
            path: '/missions/featured',
            handler: 'mission.findFeatured',
            config: {
                auth: false, // This makes it public
            }
        }
    ]
};
