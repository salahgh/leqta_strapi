"use strict";
/**
 * author controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::author.author', ({ strapi }) => ({
    async findByEmail(ctx) {
        try {
            const { email } = ctx.params;
            if (!email) {
                return ctx.badRequest('Email parameter is required');
            }
            const authors = await strapi.entityService.findMany('api::author.author', {
                filters: { email: { $eqi: email } }, // Case-insensitive email search
                populate: ['avatar', 'blogs'],
                locale: ctx.query.locale || 'en',
            });
            if (!authors || authors.length === 0) {
                return ctx.notFound('Author not found with the provided email');
            }
            return ctx.send({
                data: authors[0],
            });
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
    async findByName(ctx) {
        try {
            const { name } = ctx.params;
            if (!name) {
                return ctx.badRequest('Name parameter is required');
            }
            const authors = await strapi.entityService.findMany('api::author.author', {
                filters: { name: { $containsi: name } }, // Case-insensitive partial match
                populate: ['avatar', 'blogs'],
                locale: ctx.query.locale || 'en',
            });
            return ctx.send({
                data: authors,
                meta: {
                    total: authors.length,
                },
            });
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
}));
