const Weather = require('../models/Weather');

// In a real scenario, this would call an external API like OpenWeatherMap
const fetchWeatherData = async () => {
  console.log('Fetching fresh weather data for Pampanga...');
  // Mock data simulation
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

// Hourly caching cron simulation
setInterval(updateWeatherCache, 60 * 60 * 1000); // 1 hour

const getCachedWeather = async () => {
  let weather = await Weather.findOne({ location: 'Pampanga' });
  if (!weather || (Date.now() - new Date(weather.lastUpdated).getTime() > 60 * 60 * 1000)) {
    await updateWeatherCache();
    weather = await Weather.findOne({ location: 'Pampanga' });
  }
  return weather;
};

module.exports = { getCachedWeather, updateWeatherCache };
