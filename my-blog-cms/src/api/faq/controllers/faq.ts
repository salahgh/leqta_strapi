/**
 * faq controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::faq.faq', ({ strapi }) => ({
  // Get published FAQ by question
  async findByQuestion(ctx) {
    const { question } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::faq.faq', {
      ...query,
      filters: {
        question: { $containsi: question },
        publishedAt: { $notNull: true }
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('FAQ not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get featured FAQs
  async findFeatured(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::faq.faq', {
      ...query,
      filters: {
        featured: true,
        publishedAt: { $notNull: true }
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('No featured FAQs found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get FAQs by category
  async findByCategory(ctx) {
    const { category } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::faq.faq', {
      ...query,
      filters: {
        category: { $containsi: category },
        publishedAt: { $notNull: true }
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('No FAQs found for this category');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));