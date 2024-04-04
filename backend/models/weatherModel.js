const { sql, poolPromise } = require('../db');

const insertWeather = async (district, temperature, humidity, air_pressure, timestamp) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('district', sql.VarChar, district)
      .input('temperature', sql.Decimal(5, 2), temperature)
      .input('humidity', sql.Decimal(5, 2), humidity)
      .input('air_pressure', sql.Decimal(7, 2), air_pressure)
      .input('timestamp', sql.DateTime, timestamp)
      .query('INSERT INTO Weather (district, temperature, humidity, air_pressure, timestamp) VALUES (@district, @temperature, @humidity, @air_pressure, @timestamp)');
    console.log('Weather data inserted successfully');
  } catch (err) {
    throw new Error(`Error inserting weather data: ${err}`);
  }
};

const getLatestWeather = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query('SELECT DISTINCT district, temperature, humidity, air_pressure, timestamp FROM weather ORDER BY timestamp DESC');
    return result.recordset;
  } catch (err) {
    throw new Error(`Error getting latest weather data: ${err}`);
  }
};

const getLatestWeatherByDistrict = async (district, records) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('district', sql.VarChar, district)
      .input('records', sql.Int, records)
      .query(`SELECT TOP (${records}) district, temperature, humidity, air_pressure, timestamp FROM weather WHERE district = @district ORDER BY timestamp DESC`);
    return result.recordset;
  } catch (err) {
    throw new Error(`Error getting latest weather data for ${district}: ${err}`);
  }
};

module.exports = {
  insertWeather,
  getLatestWeather,
  getLatestWeatherByDistrict,
};
