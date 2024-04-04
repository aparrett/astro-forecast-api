import lambdas from './src/resources/lambdas';
import type { AWS } from '@serverless/typescript';

const slsConfig: AWS = {
  service: 'astro-forecast-api',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: "${opt:stage, env:STAGE, 'local'}",
    deploymentBucket: '${self:custom.AWS_ACCOUNT}-astro-forecast-lambdas',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: '*',
            Resource: '*',
          },
        ],
      },
    },
    region: 'us-east-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps',
      ENV: '${self:provider.stage}',
    },
    apiGateway: {
      shouldStartNameWithService: true,
    },
  },
  functions: lambdas,
  package: { individually: true },
  custom: {
    AWS_ACCOUNT: 433987512250,
    test_var: '${env:TEST_VAR}',
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

// must use module.exports for sls offline
module.exports = slsConfig;
