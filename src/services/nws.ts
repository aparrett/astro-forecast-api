import ky from 'ky';
import { PointResponse } from './nws.types';

const api = ky.create({
  prefixUrl: 'https://api.weather.gov/',
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [500, 503],
    backoffLimit: 500,
  },
  headers: {
    'User-Agent': process.env.NWS_API_KEY,
  },
});

export const getForecastByPoint = async (lat: string, long: string) => {
  console.log('API KEY', process.env.NWS_API_KEY?.length || 'undefined')
  const pointDetails = await api.get(`points/${lat},${long}`).json<PointResponse>();
  return pointDetails;
};
