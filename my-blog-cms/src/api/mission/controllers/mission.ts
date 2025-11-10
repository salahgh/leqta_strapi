/**
 * mission controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::mission.mission', ({ strapi }) => ({
  // Get published mission by title
  async findByTitle(ctx) {
    const { title } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::mission.mission', {
      ...query,
      filters: {
        title: { $containsi: title },
        publishedAt: { $notNull: true }
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('Mission not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get featured missions
  async findFeatured(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::mission.mission', {
      ...query,
      filters: {
        featured: true,
        publishedAt: { $notNull: true }
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('No featured missions found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));