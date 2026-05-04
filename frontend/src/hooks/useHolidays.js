import { useState, useEffect, useCallback } from 'react';
import * as holidayService from '../services/holidayService';

// Frontend caching for holidays
const holidayCache = {};

export const useHolidays = (year) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHolidays = useCallback(async () => {
    if (!year) return;
    
    // Check cache first (T051 Add caching for holiday data in frontend)
    if (holidayCache[year]) {
      setHolidays(holidayCache[year]);
      return;
    }

    setLoading(true);
    try {
      const data = await holidayService.getHolidays(year);
      holidayCache[year] = data;
      setHolidays(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  return { holidays, loading, error };
};
