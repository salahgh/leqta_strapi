"use strict";
/**
 * service controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::service.service', ({ strapi }) => ({
    // Get published service by title
    async findByTitle(ctx) {
        const { title } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::service.service', {
            ...query,
            filters: {
                title: title,
                publishedAt: { $notNull: true }
            },
            sort: { order: 'asc', createdAt: 'desc' }
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('Service not found');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
        return this.transformResponse(sanitizedEntity);
    },
    // Get published service by slug
    async findBySlug(ctx) {
        const { slug } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::service.service', {
            ...query,
            filters: {
                slug: slug,
                publishedAt: { $notNull: true }
            },
            populate: '*', // Populate all relations including featured_image
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('Service not found');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
        return this.transformResponse(sanitizedEntity);
    }
}));
