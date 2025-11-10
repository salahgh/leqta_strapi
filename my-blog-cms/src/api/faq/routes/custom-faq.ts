export default {
  routes: [
    {
      method: 'GET',
      path: '/faqs/question/:question',
      handler: 'faq.findByQuestion',
      config: {
        auth: false, // This makes it public
      }
    },
    {
      method: 'GET',
      path: '/faqs/featured',
      handler: 'faq.findFeatured',
      config: {
        auth: false, // This makes it public
      }
    },
    {
      method: 'GET',
      path: '/faqs/category/:category',
      handler: 'faq.findByCategory',
      config: {
        auth: false, // This makes it public
      }
    }
  ]
};