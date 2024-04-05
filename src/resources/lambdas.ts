export default {
  server: {
    handler: 'src/app.server',
    timeout: 29,
    events: [
      {
        // keep the lambda warm
        eventBridge: {
          // every 5 minutes
          schedule: 'cron(0/5 * * * ? *)',
        },
      },
      {
        http: {
          method: 'ANY',
          path: '/',
          cors: true,
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
