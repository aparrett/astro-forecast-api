import express, { Response } from 'express';
import sls from 'serverless-http';
import { getForecastByPoint } from './services/nws';

const app = express();

app.get('/forecast', async (_, res: Response) => {
  const forecast = await getForecastByPoint('38.92', '-91.7');
  res.status(200).send(forecast);
});

app.get('/ping', async (_, res: Response) => {
  res.status(200).send({ hello: 'Hello World!' });
});

export const server = sls(app);
