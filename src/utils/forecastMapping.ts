import { ForecastValue } from '../services/external/nws.types';

export const mapToFarenheit = (values: ForecastValue[]): ForecastValue[] =>
  values.map((v) => ({
    validTime: v.validTime,
    value: Math.round(celciusToFarenheit(v.value)),
  }));

export const celciusToFarenheit = (t: number) => (9 / 5) * t + 32;

export const mapToMph = (values: ForecastValue[]): ForecastValue[] =>
  values.map((v) => ({
    validTime: v.validTime,
    value: Math.round(kphToMph(v.value)),
  }));

export const kphToMph = (s: number) => s * 0.6213711922;
