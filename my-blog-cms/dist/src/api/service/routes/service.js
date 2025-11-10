"use strict";
/**
 * service router
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreRouter('api::service.service', {
    config: {
        findByTitle: {
            auth: false, // Make it publicly accessible
        }
    }
});
