const express = require('express');
const router = express.Router();
const { getWeather, getCurrent, getForecast } = require('../controllers/weatherController');

// GET /api/weather — Legacy cached weather (backward compat)
router.get('/', getWeather);

// GET /api/weather/current?lat=&lon= — Live current weather (Feature 004)
router.get('/current', getCurrent);

// GET /api/weather/forecast?lat=&lon= — Live 5-day forecast (Feature 004)
router.get('/forecast', getForecast);

module.exports = router;
