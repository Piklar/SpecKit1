const holidayService = require('../services/holidayService');

/**
 * HolidayController — Feature 004
 * Serves Philippine holiday data with in-service caching.
 */

/**
 * GET /api/holidays/:year
 * Returns Philippine public holidays for the specified year.
 */
const getHolidaysByYear = (req, res, next) => {
  try {
    const year = parseInt(req.params.year, 10);
    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ message: 'Invalid year. Must be between 2000 and 2100.' });
    }
    const holidays = holidayService.getPhilippineHolidays(year);
    res.json(holidays);
  } catch (err) {
    next(err);
  }
};

module.exports = { getHolidaysByYear };
