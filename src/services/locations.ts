import express, { Request, Response } from 'express';
import { GetLocationsParams } from 'astro-ws-types';
import { getLocationsByQuery } from './external/mapbox';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({
  stdTTL: 86400, // one day
  checkperiod: 43200, // twice per day
});

router.get('/', async (req: Request<{}, {}, {}, GetLocationsParams>, res: Response) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).send({ message: '"location" is a required query parameter.' });
  }
  const cached = cache.get(location);
  if (cached) {
    return res.status(200).send(cached);
  }
  try {
    const queryResponse = await getLocationsByQuery(location);
    const locations = queryResponse.features.map(({ properties }) => ({
      name: properties.place_formatted,
      coordinates: properties.coordinates,
    }));
    cache.set(location, locations);
    return res.status(200).send(locations);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Unable to retrieve location results. Please try again later.' });
  }
});

export default router;
