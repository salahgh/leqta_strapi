/**
 * testimonial controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::testimonial.testimonial', ({ strapi }) => ({
  // Get featured testimonials
  async findFeatured(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::testimonial.testimonial', {
      ...query,
      filters: {
        featured: true,
        publishedAt: { $notNull: true }
      },
      sort: { createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('No featured testimonials found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get testimonials by role
  async findByRole(ctx) {
    const { role } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::testimonial.testimonial', {
      ...query,
      filters: {
        role: { $containsi: role },
        publishedAt: { $notNull: true }
      },
      sort: { createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('No testimonials found for this role');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));