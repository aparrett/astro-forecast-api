import express, { Response } from 'express';
import sls from 'serverless-http';
import cors from 'cors';
import forecast from './services/forecast';
import locations from './services/locations';
import { rateLimit } from 'express-rate-limit';

const app = express();

const corsOptions = {
  origin: 'https://d6vmy0uap08yx.cloudfront.net',
  optionsSuccessStatus: 200,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 50 requests per `window`
  standardHeaders: 'draft-7', 
  legacyHeaders: false, 
});

const router = express.Router();

router.use('/forecast', forecast);
router.use('/locations', locations);
router.get('/ping', async (_, res: Response) => {
  res.status(200).send('Ping success.');
});

app.use(cors(corsOptions));
app.use(limiter);
app.use('/', router);

export const server = sls(app);
