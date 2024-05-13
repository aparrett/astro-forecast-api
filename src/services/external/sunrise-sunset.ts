import { GetSolarDetailsResponse, SunriseSunsetResponse } from 'astro-ws-types';
import ky from 'ky';

const api = ky.create({
  prefixUrl: 'https://api.sunrise-sunset.org/',
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [500, 503],
    backoffLimit: 500, // milliseconds
  },
});

export const getSolarDetails = async (lat: string, long: string, date: string) => {
  try {
    const details = await api.get(`json?lat=${lat}&lng=${long}&formatted=0&date=${date}`).json<SunriseSunsetResponse>();
    return transform(details);
  } catch (e: any) {
    if (e?.name === 'HTTPError') {
      const error = await e.response.json();
      console.error(error.detail);
      throw error;
    } else {
      throw new Error('Unable to fetch sun details from the API.');
    }
  }
};

const transform = ({ results }: SunriseSunsetResponse): GetSolarDetailsResponse => ({
  sunrise: results.sunrise,
  sunset: results.sunset,
  civilTwilightBegin: results.civil_twilight_begin,
  civilTwilightEnd: results.civil_twilight_end,
  nauticalTwilightBegin: results.nautical_twilight_begin,
  nauticalTwilightEnd: results.nautical_twilight_end,
  astronomicalTwilightBegin: results.astronomical_twilight_begin,
  astronomicalTwilightEnd: results.astronomical_twilight_end,
});
