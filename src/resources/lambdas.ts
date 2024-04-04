export default {
  server: {
    handler: 'src/app.server',
    timeout: 29,
    events: [
      {
        // keep the lambda warm
        eventBridge: {
          // every 5 minutes between 7AM and 11PM
          schedule: 'cron(0/5 12-24 * * ? *)',
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
