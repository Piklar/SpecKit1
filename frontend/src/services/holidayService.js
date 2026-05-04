import axios from 'axios';

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Retry wrapper — retries once on server/network error (not 4xx).
 */
const withRetry = async (fn, retries = 1, delayMs = 500) => {
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

export const getHolidays = async (year) => {
  return withRetry(async () => {
    const response = await axios.get(`${getBaseUrl()}/api/holidays/${year}`);
    return response.data;
  });
};
