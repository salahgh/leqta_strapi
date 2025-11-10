export default {
  routes: [
    {
      method: 'GET',
      path: '/authors/email/:email',
      handler: 'author.findByEmail',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/authors/name/:name',
      handler: 'author.findByName',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
