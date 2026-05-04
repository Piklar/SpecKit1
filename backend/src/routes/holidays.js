const express = require('express');
const router = express.Router();
const { getHolidaysByYear } = require('../controllers/holidayController');

// GET /api/holidays/:year — Get Philippine holidays for a year
router.get('/:year', getHolidaysByYear);

module.exports = router;
