const axios = require('axios');
const { BASE_URL, getApiKey } = require('../config/openweather');
const Weather = require('../models/Weather');

/**
 * WeatherService — Feature 004 (Updated)
 * Now supports live OpenWeather API in addition to the legacy cache mechanism.
 * Default location: Pampanga, Philippines (15.0794° N, 120.6200° E)
 */

const DEFAULT_LAT = 15.0794;
const DEFAULT_LON = 120.62;

// ── Live OpenWeather API methods (Feature 004) ────────────────────────────────

/**
 * Get current weather for a location from OpenWeather API.
 * @param {number} lat - Latitude (defaults to Pampanga)
 * @param {number} lon - Longitude (defaults to Pampanga)
 */
const getCurrentWeather = async (lat = DEFAULT_LAT, lon = DEFAULT_LON) => {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

/**
 * Get 5-day / 3-hour forecast for a location from OpenWeather API.
 * @param {number} lat - Latitude (defaults to Pampanga)
 * @param {number} lon - Longitude (defaults to Pampanga)
 */
const getForecast = async (lat = DEFAULT_LAT, lon = DEFAULT_LON) => {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

// ── Legacy cache methods (kept for backward compatibility) ────────────────────

const fetchWeatherData = async () => {
  console.log('Fetching fresh weather data for Pampanga...');
  return {
    location: 'Pampanga',
    temperature: 32 + Math.floor(Math.random() * 5),
    humidity: 70 + Math.floor(Math.random() * 20),
    description: 'Partly Cloudy',
    forecast: [
      { date: new Date(Date.now() + 86400000), temp: 33, description: 'Sunny' },
      { date: new Date(Date.now() + 172800000), temp: 31, description: 'Rainy' }
    ]
  };
};

const updateWeatherCache = async () => {
  try {
    const data = await fetchWeatherData();
    await Weather.findOneAndUpdate(
      { location: 'Pampanga' },
      { ...data, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Failed to update weather cache:', error);
  }
};

setInterval(updateWeatherCache, 60 * 60 * 1000);

const getCachedWeather = async () => {
  let weather = await Weather.findOne({ location: 'Pampanga' });
  if (!weather || (Date.now() - new Date(weather.lastUpdated).getTime() > 60 * 60 * 1000)) {
    await updateWeatherCache();
    weather = await Weather.findOne({ location: 'Pampanga' });
  }
  return weather;
};

module.exports = { getCachedWeather, updateWeatherCache, getCurrentWeather, getForecast };
