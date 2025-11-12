export default {
  routes: [
    {
      method: 'GET',
      path: '/services/findByTitle/:title',
      handler: 'service.findByTitle',
      config: {
        auth: false, // This makes it public
      }
    },
    {
      method: 'GET',
      path: '/services/slug/:slug',
      handler: 'service.findBySlug',
      config: {
        auth: false, // This makes it public
      }
    }
  ]
};