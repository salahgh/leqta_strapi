"use strict";
/**
 * blog router
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreRouter('api::blog.blog', {
    config: {
        findByTitle: {
            auth: false, // Make it publicly accessible
        },
        findFeatured: {
            auth: false, // Make it publicly accessible
        },
        findByCategory: {
            auth: false, // Make it publicly accessible
        }
    }
});
