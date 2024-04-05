/**
 * View full types at https://www.weather.gov/documentation/services-web-api
 * */

export interface PointResponse {
  properties: {
    forecastGridData: string;
  };
}

export interface Period {
  number: number;
  startTime: string; // '2024-04-05T09:00:00-05:00'
  endTime: string; // '2024-04-05T10:00:00-05:00'
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: 'F' | 'C';
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number;
  };
  dewpoint: {
    // returns Celsius
    unitCode: string;
    value: number;
  };
  relativeHumidity: {
    unitCode: string;
    value: number;
  };
  windSpeed: string; // '5 mph'
  windDirection: string;
  detailedForecast: '';
}

export interface ForecastValue {
  validTime: string;
  value: number;
}

interface ForecastData {
  uom: string;
  values: ForecastValue[];
}

export interface ForecastGridResponse {
  properties: {
    // Format 2024-04-05T14:11:21+00:00
    updateTime: string;
    /** uom: meters */
    elevation: {
      unitCode: string;
      value: number;
    };
    /** uom: Celcius */
    temperature: ForecastData;
    /** uom: Celcius */
    dewpoint: ForecastData;
    /** uom: percent */
    relativeHumidity: ForecastData;
    /** uom: Celcius */
    windChill: ForecastData;
    /** uom: percent */
    skyCover: ForecastData;
    /** uom: degree (angle) */
    windDirection: ForecastData;
    /** uom: km/hr */
    windSpeed: ForecastData;
    /** uom: km/hr */
    windGust: ForecastData;
    /** uom: percent */
    probabilityOfPrecipitation: ForecastData;
  };
}
