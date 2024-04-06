import express, { Response } from 'express';
import sls from 'serverless-http';
import forecast from './services/forecast';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: 'https://d6vmy0uap08yx.cloudfront.net',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const router = express.Router();

router.use('/forecast', forecast);
router.get('/ping', async (_, res: Response) => {
  res.status(200).send('Ping success.');
});

app.use('/', router);

export const server = sls(app);
