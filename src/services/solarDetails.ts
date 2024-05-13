import express, { Request, Response } from 'express';
import { getSolarDetails } from './external/sunrise-sunset';
import { GetSolarDetailsParams } from 'astro-ws-types';

const router = express.Router();

router.get('/', async (req: Request<{}, {}, {}, GetSolarDetailsParams>, res: Response) => {
  const params = req.query;
  try {
    validateParams(params);
  } catch (e) {
    return res.status(400).send({ message: (e as Error).message });
  }

  try {
    const solarDetailsResponse = await getSolarDetails(params.lat, params.long, params.date);
    return res.status(200).send(solarDetailsResponse);
  } catch (e: any) {
    console.error(e);
    if (e.status === 404) {
      return res.status(404).send({ message: e.detail });
    }
    return res.status(500).send({ message: e.detail || 'Unable to retrieve solar data. Please try again later.' });
  }
});

const validateParams = (params: GetSolarDetailsParams) => {
  if (!params.lat || !params.long || !params.date) {
    throw new Error('Parameters "lat", "long", and "date" are required.');
  }
  if (isNaN(Number(params.lat))) {
    throw new Error('Given latitude is not a number. For south values use a negative number.');
  }
  if (isNaN(Number(params.long))) {
    throw new Error('Given longitude is not a number. For west values use a negative number.');
  }
};

export default router
