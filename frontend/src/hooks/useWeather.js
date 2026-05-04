import { useState, useEffect, useCallback } from 'react';
import * as weatherService from '../services/weatherService';

export const useWeather = (lat, lon) => {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getForecast(lat, lon)
      ]);
      setCurrent(currentData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { current, forecast, loading, error, refreshWeather: fetchWeather };
};
