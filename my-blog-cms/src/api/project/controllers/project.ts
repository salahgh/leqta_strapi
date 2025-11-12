/**
 * project controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
  // Get published project by title
  async findByTitle(ctx) {
    const { title } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::project.project', {
      ...query,
      filters: {
        title: title,
        publishedAt: { $notNull: true }
      },
      populate: {
        featured_image: true,
        gallery: true
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('Project not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get projects by category
  async findByCategory(ctx) {
    const { category } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::project.project', {
      ...query,
      filters: {
        category: {
          $containsi: category
        },
        publishedAt: { $notNull: true }
      },
      populate: {
        featured_image: true,
        gallery: true
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get featured projects
  async findFeatured(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::project.project', {
      ...query,
      filters: {
        featured: true,
        publishedAt: { $notNull: true }
      },
      populate: {
        featured_image: true,
        gallery: true
      },
      sort: { order: 'asc', createdAt: 'desc' }
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Get published project by slug
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::project.project', {
      ...query,
      filters: {
        slug: slug,
        publishedAt: { $notNull: true }
      },
      populate: '*', // Populate all relations including featured_image
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('Project not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));