/**
 * OpenWeather API Configuration — Feature 004
 */

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getApiKey = () => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    throw new Error('OPENWEATHER_API_KEY is not set in environment variables. Please add it to your .env file.');
  }
  return key;
};

module.exports = { BASE_URL, getApiKey };
