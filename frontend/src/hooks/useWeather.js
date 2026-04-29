import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data } = await api.get('/weather');
        setWeather(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weather, loading, error };
}
