import express, { Request, Response } from 'express';
import { GetLocationsParams } from 'astro-ws-types';
import { getLocationsByQuery } from './external/mapbox';

const router = express.Router();

router.get('/', async (req: Request<{}, {}, {}, GetLocationsParams>, res: Response) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).send({ message: '"location" is a required query parameter.' });
  }
  try {
    const queryResponse = await getLocationsByQuery(location);
    const locations = queryResponse.features.map(({ properties }) => ({
      name: properties.place_formatted,
      coordinates: properties.coordinates,
    }));
    return res.status(200).send(locations);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Unable to retrieve location results. Please try again later.' });
  }
});

export default router;
