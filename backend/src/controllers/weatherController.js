const weatherService = require('../services/weatherService');

const getWeather = async (req, res, next) => {
  try {
    const weather = await weatherService.getCachedWeather();
    res.json(weather);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = { getWeather };
