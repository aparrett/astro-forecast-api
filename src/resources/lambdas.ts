export default {
  server: {
    handler: 'src/app.server',
    timeout: 29,
    events: [
      {
        http: {
          method: 'ANY',
          path: '/',
          cors: true
        },
      },
      {
        http: {
          method: 'ANY',
          path: '/{proxy+}',
          cors: true,
        },
      },
    ],
  },
};
