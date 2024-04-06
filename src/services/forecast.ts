import express, { Request, Response } from 'express';
import { getForecastByPoint } from './external/nws';
import { mapToFarenheit, mapToMph } from '../utils/forecastMapping';
import { GetForecastParams } from 'astro-ws-types'

const router = express.Router();

router.get('/', async (req: Request<{}, {}, {}, GetForecastParams>, res: Response) => {
  const params = req.query;
  try {
    validateParams(params);
  } catch (e) {
    return res.status(400).send({ message: (e as Error).message });
  }

  const units = params.units || 'imperial';
  try {
    const nwsForecastResponse = await getForecastByPoint(params.lat, params.long);
    const forecast = transform(nwsForecastResponse, units);
    return res.status(200).send(forecast);
  } catch (e: any) {
    if (e.status === 404) {
      return res.status(404).send({ message: e.detail });
    }
    return res
      .status(500)
      .send({ message: e.detail || 'Unable to retrieve weather data from the NWS. Please try again later.' });
  }
});

const validateParams = (params: GetForecastParams) => {
  if (!params.lat || !params.long) {
    throw new Error('Parameters "lat" and "long" are required.');
  }
  if (isNaN(Number(params.lat))) {
    throw new Error('Given latitude is not a number. For south values use a negative number.');
  }
  if (isNaN(Number(params.long))) {
    throw new Error('Given longitude is not a number. For west values use a negative number.');
  }
  if (params.units && params.units !== 'imperial' && params.units !== 'metric') {
    throw new Error('Invalid units. Valid values are "imperial" and "metric".');
  }
};

const transform = ({ properties }: ForecastGridResponse, units: Units) => {
  if (units === 'metric') {
    return {
      updateTime: properties.updateTime,
      elevation: properties.elevation,
      temperature: properties.temperature.values,
      dewpoint: properties.dewpoint.values,
      relativeHumidity: properties.relativeHumidity.values,
      windChill: properties.windChill.values,
      skyCover: properties.skyCover.values,
      windDirection: properties.windDirection.values,
      windSpeed: properties.windSpeed.values,
      windGust: properties.windGust.values,
      probabilityOfPrecipitation: properties.probabilityOfPrecipitation.values,
    };
  }

  return {
    updateTime: properties.updateTime,
    elevation: properties.elevation,
    temperature: mapToFarenheit(properties.temperature.values),
    dewpoint: mapToFarenheit(properties.dewpoint.values),
    relativeHumidity: properties.relativeHumidity.values,
    windChill: mapToFarenheit(properties.windChill.values),
    skyCover: properties.skyCover.values,
    windDirection: properties.windDirection.values,
    windSpeed: mapToMph(properties.windSpeed.values),
    windGust: mapToMph(properties.windGust.values),
    probabilityOfPrecipitation: properties.probabilityOfPrecipitation.values,
  };
};

export default router;
