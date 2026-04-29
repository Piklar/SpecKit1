const express = require('express');
const router = express.Router();
const { getPests, getPestById } = require('../controllers/pestsController');
router.get('/', getPests);
router.get('/:id', getPestById);
module.exports = router;
