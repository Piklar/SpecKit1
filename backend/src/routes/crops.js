const express = require('express');
const router = express.Router();
const { getCrops, getCropById } = require('../controllers/cropsController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/', authenticateJWT, getCrops);
router.get('/:id', authenticateJWT, getCropById);

module.exports = router;
