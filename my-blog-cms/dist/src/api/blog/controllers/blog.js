"use strict";
/**
 * blog controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::blog.blog', ({ strapi }) => ({
    // Get published blog by title
    async findByTitle(ctx) {
        const { title } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::blog.blog', {
            ...query,
            filters: {
                title: { $containsi: title },
                publishedAt: { $notNull: true }
            },
            populate: {
                category: true,
                tags: true,
                author: {
                    populate: ['avatar']
                },
                featured_image: true
            },
            sort: { createdAt: 'desc' }
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('Blog post not found');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
        return this.transformResponse(sanitizedEntity);
    },
    // Get featured blog posts
    async findFeatured(ctx) {
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::blog.blog', {
            ...query,
            filters: {
                featured: true,
                publishedAt: { $notNull: true }
            },
            populate: {
                category: true,
                tags: true,
                author: {
                    populate: ['avatar']
                },
                featured_image: true
            },
            sort: { createdAt: 'desc' }
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('No featured blog posts found');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
    },
    // Get blog posts by category
    async findByCategory(ctx) {
        const { category } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::blog.blog', {
            ...query,
            filters: {
                category: {
                    name: { $containsi: category }
                },
                publishedAt: { $notNull: true }
            },
            populate: {
                category: true,
                tags: true,
                author: {
                    populate: ['avatar']
                },
                featured_image: true
            },
            sort: { createdAt: 'desc' }
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('No blog posts found for this category');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
    }
}));
