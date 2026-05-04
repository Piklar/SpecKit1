import axios from 'axios';

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Retry wrapper — retries once on server/network error (not 4xx).
 */
const withRetry = async (fn, retries = 1, delayMs = 800) => {
  try {
    return await fn();
  } catch (err) {
    const status = err.response?.status;
    if (retries > 0 && (!status || status >= 500)) {
      await new Promise((res) => setTimeout(res, delayMs));
      return withRetry(fn, retries - 1, delayMs);
    }
    throw err;
  }
};

export const getCurrentWeather = async (lat, lon) => {
  return withRetry(async () => {
    let url = `${getBaseUrl()}/api/weather/current`;
    if (lat && lon) url += `?lat=${lat}&lon=${lon}`;
    const response = await axios.get(url);
    return response.data;
  });
};

export const getForecast = async (lat, lon) => {
  return withRetry(async () => {
    let url = `${getBaseUrl()}/api/weather/forecast`;
    if (lat && lon) url += `?lat=${lat}&lon=${lon}`;
    const response = await axios.get(url);
    return response.data;
  });
};
