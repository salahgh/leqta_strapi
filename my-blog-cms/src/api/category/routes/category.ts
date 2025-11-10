/**
 * category router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::category.category', {
  config: {
    findByName: {
      auth: false,
    },
    findBySlug: {
      auth: false,
    },
    findFeatured: {
      auth: false,
    }
  }
});