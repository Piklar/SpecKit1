const express = require('express');
const router = express.Router();
const { getFarms, createFarm } = require('../controllers/farmController');
const authenticateJWT = require('../middleware/authenticateJWT');
router.route('/').get(authenticateJWT, getFarms).post(authenticateJWT, createFarm);
module.exports = router;
