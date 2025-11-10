"use strict";
/**
 * mission router
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreRouter('api::mission.mission', {
    config: {
        findByTitle: {
            auth: false, // Make it publicly accessible
        },
        findFeatured: {
            auth: false, // Make it publicly accessible
        }
    }
});
