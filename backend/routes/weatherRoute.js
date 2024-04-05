const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.post('/', weatherController.postWeather);
router.get('/', weatherController.getLatestWeather);
router.get('/:district/:records', weatherController.getLatestWeatherByDistrict);

module.exports = router;
