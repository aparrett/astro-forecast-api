import express, { Response } from 'express';
import sls from 'serverless-http';

const app = express();

app.get('/test', (_, res: Response) => {
  res.status(200).send({ test: process.env.TEST_VAR });
});

app.get('/*', async (_, res: Response) => {
  res.status(200).send({ hello: 'Hello World!' });
});

export const server = sls(app);
