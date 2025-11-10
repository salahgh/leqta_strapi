/**
 * service controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::service.service', ({ strapi }) => ({
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
  }
}));