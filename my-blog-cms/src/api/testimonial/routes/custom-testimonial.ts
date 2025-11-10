export default {
  routes: [
    {
      method: 'GET',
      path: '/testimonials/featured',
      handler: 'testimonial.findFeatured',
      config: {
        auth: false, // This makes it public
      }
    },
    {
      method: 'GET',
      path: '/testimonials/role/:role',
      handler: 'testimonial.findByRole',
      config: {
        auth: false, // This makes it public
      }
    }
  ]
};