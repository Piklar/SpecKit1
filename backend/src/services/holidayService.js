const Holidays = require('date-holidays');

/**
 * HolidayService — Feature 004
 * Fetches Philippine public holidays using the date-holidays package.
 * Results are cached in-memory per year to avoid redundant computation.
 */

const cache = {};

/**
 * Get Philippine public holidays for a given year.
 * @param {number} year - The year to fetch holidays for
 * @returns {Array<{ date: string, name: string, type: string }>}
 */
const getPhilippineHolidays = (year) => {
  const key = String(year);
  if (cache[key]) return cache[key];

  const hd = new Holidays('PH');
  const holidays = hd.getHolidays(year).map((h) => ({
    date: h.date.split(' ')[0], // "YYYY-MM-DD"
    name: h.name,
    type: h.type, // 'public', 'bank', 'optional', etc.
  }));

  cache[key] = holidays;
  return holidays;
};

module.exports = { getPhilippineHolidays };
