export default {
  routes: [
    {
      method: 'GET',
      path: '/categories/name/:name',
      handler: 'category.findByName',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/categories/slug/:slug',
      handler: 'category.findBySlug',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/categories/featured',
      handler: 'category.findFeatured',
      config: {
        auth: false,
      }
    }
  ]
};