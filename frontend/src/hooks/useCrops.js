import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useCrops(season = 'all') {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/crops?season=${season}`);
        setCrops(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch crops');
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [season]);

  return { crops, loading, error };
}
