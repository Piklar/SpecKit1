const express = require('express');
const router = express.Router();
const { getFarms, createFarm, addCropToFarm } = require('../controllers/farmController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.route('/').get(authenticateJWT, getFarms).post(authenticateJWT, createFarm);
router.route('/:id/crops').post(authenticateJWT, addCropToFarm);

module.exports = router;
