import { useState, useEffect } from 'react';
import api from '../services/api';

export default function usePests() {
  const [pests, setPests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPests = async () => {
      try {
        const { data } = await api.get('/pests');
        setPests(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchPests();
  }, []);

  return { pests, loading };
}
