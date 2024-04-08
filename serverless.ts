import lambdas from './src/resources/lambdas';
import type { AWS } from '@serverless/typescript';

const slsConfig: AWS = {
  service: 'astro-forecast-api',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: "${env:ENV, 'local'}",
    deploymentBucket: '${self:custom.AWS_ACCOUNT}-deployment',
    region: 'us-east-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps',
      ENV: "${env:ENV, 'local'}",
      // myweatherapp is a fake API Key for local
      NWS_API_KEY: '${env:NWS_API_KEY}',
      MAPBOX_API_TOKEN: '${env:MAPBOX_API_TOKEN}',
    },
    apiGateway: {
      shouldStartNameWithService: true,
    },
  },
  functions: lambdas,
  package: { individually: true },
  custom: {
    AWS_ACCOUNT: 433987512250,
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
  resources: {
    Resources: {
      ServerLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          RetentionInDays: '7',
        },
      },
    },
  },
};

// must use module.exports for sls offline
module.exports = slsConfig;
