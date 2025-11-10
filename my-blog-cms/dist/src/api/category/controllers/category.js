"use strict";
/**
 * category controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::category.category', ({ strapi }) => ({
    // Get category by name with enhanced filtering
    async findByName(ctx) {
        const { name } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::category.category', {
            ...query,
            filters: {
                name: { $containsi: name }
            },
            populate: {
                blogs: {
                    filters: {
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
                }
            }
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('Category not found');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
        return this.transformResponse(sanitizedEntity);
    },
    // Get category by slug (SEO-friendly)
    async findBySlug(ctx) {
        const { slug } = ctx.params;
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::category.category', {
            ...query,
            filters: {
                slug: slug
            },
            populate: {
                blogs: {
                    filters: {
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
                    sort: { featured: 'desc', createdAt: 'desc' }
                }
            }
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('Category not found');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
        return this.transformResponse(sanitizedEntity);
    },
    // Get featured categories
    async findFeatured(ctx) {
        const { query } = ctx;
        const entity = await strapi.entityService.findMany('api::category.category', {
            ...query,
            filters: {
                featured: true
            },
            populate: {
                blogs: {
                    filters: {
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
                    sort: { featured: 'desc', createdAt: 'desc' },
                    limit: 5 // Limit blogs per category for performance
                }
            },
            sort: { order: 'asc', createdAt: 'desc' }
        });
        if (!entity || entity.length === 0) {
            return ctx.notFound('No featured categories found');
        }
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
    }
}));
