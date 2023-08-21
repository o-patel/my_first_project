'use strict';
// Never take constants here
module.exports = {
  plugin: {
    async register(server, options) {
      const API = require('api/auth.api');
      server.route([
        {
          method: 'POST',
          path: '/login',
          options: {
            auth: null,
            plugins: {
              policies: ['log.policy'],
            },
            tags: ['api', 'Authentication'],
            description: 'Login',
            notes: 'Login',
            validate: API.login.validate,
            pre: API.login.pre,
            handler: API.login.handler,
          },
        },
        {
          method: 'POST',
          path: '/signup',
          options: {
            auth: null,
            plugins: {
              policies: ['log.policy'],
            },
            tags: ['api', 'Authentication'],
            description: 'Signup',
            notes: 'Signup',
            validate: API.signup.validate,
            pre: API.signup.pre,
            handler: API.signup.handler,
          },
        },
        {
          method: 'GET',
          path: '/me',
          options: {
            auth: 'auth',
            plugins: {
              policies: [],
              'hapi-swagger': {
                security: [
                  {
                    ApiKeyAuth: [],
                  },
                ],
              },
            },
            tags: ['api', 'Authentication'],
            description: 'me',
            notes: 'me',
            validate: API.me.validate,
            pre: API.me.pre,
            handler: API.me.handler,
          },
        },
        {
          method: 'POST',
          path: '/signup123',
          options: {
            auth: null,
            plugins: {
              policies: ['log.policy'],
            },
            tags: ['api', 'Authentication'],
            description: 'signup123',
            notes: 'signup123',
            validate: API.signup123.validate,
            pre: API.signup123.pre,
            handler: API.signup123.handler,
          },
        },
      ]);
    },
    version: require('../../package.json').version,
    name: 'auth-routes',
  },
};
