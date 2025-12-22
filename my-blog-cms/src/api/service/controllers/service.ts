/**
 * service controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::service.service', ({ strapi }) => ({
  // Override default find to sort by order field
  async find(ctx) {
    // Add default sort by order if not specified
    if (!ctx.query.sort) {
      ctx.query.sort = { order: 'asc', createdAt: 'desc' };
    }

    // Call the default find method
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

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

  // Get published service by slug with i18n support
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { query } = ctx;
    const locale = query.locale || 'en';

    const entity = await strapi.entityService.findMany('api::service.service', {
      filters: {
        slug: slug,
        publishedAt: { $notNull: true }
      },
      populate: query.populate || '*',
      locale: locale,
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('Service not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));