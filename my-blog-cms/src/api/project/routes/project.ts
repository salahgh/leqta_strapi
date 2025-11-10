/**
 * project router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::project.project', {
  config: {
    findByTitle: {
      auth: false, // Make it publicly accessible
    },
    findByCategory: {
      auth: false, // Make it publicly accessible
    },
    findFeatured: {
      auth: false, // Make it publicly accessible
    }
  }
});