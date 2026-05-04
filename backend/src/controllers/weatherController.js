const weatherService = require('../services/weatherService');

/**
 * WeatherController — Feature 004 (Updated)
 * Supports both legacy cached endpoint and new live OpenWeather API endpoints.
 */

// ── Legacy endpoint (backward compat) ────────────────────────────────────────

const getWeather = async (req, res, next) => {
  try {
    const weather = await weatherService.getCachedWeather();
    res.json(weather);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// ── New live OpenWeather endpoints (Feature 004) ──────────────────────────────

/**
 * GET /api/weather/current?lat=&lon=
 * Returns current weather. Defaults to Pampanga if no lat/lon provided.
 */
const getCurrent = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const data = await weatherService.getCurrentWeather(
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined
    );
    res.json(data);
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid OpenWeather API key. Please check your OPENWEATHER_API_KEY.' });
    }
    if (error.message?.includes('OPENWEATHER_API_KEY')) {
      return res.status(500).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * GET /api/weather/forecast?lat=&lon=
 * Returns 5-day / 3-hour forecast. Defaults to Pampanga if no lat/lon provided.
 */
const getForecast = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const data = await weatherService.getForecast(
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined
    );
    res.json(data);
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid OpenWeather API key.' });
    }
    if (error.message?.includes('OPENWEATHER_API_KEY')) {
      return res.status(500).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = { getWeather, getCurrent, getForecast };
