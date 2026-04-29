import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const FarmContext = createContext();
export const useFarm = () => useContext(FarmContext);

export const FarmProvider = ({ children }) => {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchFarms = async () => {
      try {
        const { data } = await api.get('/farm');
        setFarms(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchFarms();
  }, [user]);

  const addFarm = async (farmData) => {
    const { data } = await api.post('/farm', farmData);
    setFarms([...farms, data]);
  };

  return (
    <FarmContext.Provider value={{ farms, loading, addFarm }}>
      {children}
    </FarmContext.Provider>
  );
};
