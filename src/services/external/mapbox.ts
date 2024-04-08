import ky from 'ky';
import { MapboxForwardSearchResponse } from 'astro-ws-types';

const api = ky.create({
  prefixUrl: 'https://api.mapbox.com/',
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [500, 503],
    backoffLimit: 500,
  },
});

const accessToken = process.env.MAPBOX_API_TOKEN;

export const getLocationsByQuery = async (query: string) => {
  try {
    return await api
      .get(`search/searchbox/v1/forward?q=${query}&access_token=${accessToken}`)
      .json<MapboxForwardSearchResponse>();
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
