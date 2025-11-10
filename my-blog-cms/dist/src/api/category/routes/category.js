"use strict";
/**
 * category router
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreRouter('api::category.category', {
    config: {
        findByName: {
            auth: false,
        },
        findBySlug: {
            auth: false,
        },
        findFeatured: {
            auth: false,
        }
    }
});
