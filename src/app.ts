import express, { Response } from 'express';
import sls from 'serverless-http';

const app = express();

app.get('/test', (_, res: Response) => {
  res.status(200).send({ stage: process.env.ENV || 'undefined' });
});

app.get('/*', async (_, res: Response) => {
  res.status(200).send({ hello: 'Hello World!' });
});

export const server = sls(app);
