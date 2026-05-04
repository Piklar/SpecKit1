import { useState, useEffect } from 'react';
import api from '../services/api';

export default function usePests() {
  const [pests, setPests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPests = async () => {
      try {
        const { data } = await api.get('/pests');
        setPests(data);
      } catch (err) { 
        console.error(err); 
        setError('Failed to load pests.');
      } finally { 
        setLoading(false); 
      }
    };
    fetchPests();
  }, []);

  return { pests, loading, error };
}
