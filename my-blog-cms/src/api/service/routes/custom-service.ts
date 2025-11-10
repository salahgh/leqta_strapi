export default {
  routes: [
    {
      method: 'GET',
      path: '/services/findByTitle/:title',
      handler: 'service.findByTitle',
      config: {
        auth: false, // This makes it public
      }
    }
  ]
};