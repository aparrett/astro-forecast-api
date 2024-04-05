import ky from 'ky';
import { ForecastGridResponse, PointResponse } from './nws.types';

const api = ky.create({
  prefixUrl: 'https://api.weather.gov/',
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [500, 503],
    backoffLimit: 500, // milliseconds
  },
  headers: {
    'User-Agent': process.env.NWS_API_KEY,
  },
});

export const getForecastByPoint = async (lat: string, long: string) => {
  try {
    const pointDetails = await api.get(`points/${lat},${long}`).json<PointResponse>();
    const gridForecast = await api
      .get(pointDetails.properties.forecastGridData, { prefixUrl: '' })
      .json<ForecastGridResponse>();
    return gridForecast;
  } catch (e: any) {
    if (e?.name === 'HTTPError') {
      const error = await e.response.json();
      console.error(error.detail);
      throw error;
    } else {
      throw new Error('Unable to fetch weather data from the NWS.');
    }
  }
};
