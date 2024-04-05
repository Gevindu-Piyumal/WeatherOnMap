const Weather = require('../models/weatherModel');

const postWeather = async (req, res) => {
    const { district, temperature, humidity, air_pressure } = req.body;
  
    if (!district || !temperature || !humidity || !air_pressure) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      await Weather.insertWeather(district, temperature, humidity, air_pressure);
      res.status(201).json({ message: 'Weather data successfully added' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

const getLatestWeather = async (req, res) => {
  try {
    const latestWeather = await Weather.getLatestWeather();
    res.json(latestWeather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLatestWeatherByDistrict = async (req, res) => {
  const { district, records } = req.params;
  try {
    const latestWeather = await Weather.getLatestWeatherByDistrict(district, records);
    res.json(latestWeather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  postWeather,
  getLatestWeather,
  getLatestWeatherByDistrict,
};
