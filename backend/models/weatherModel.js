const { sql, poolPromise } = require('../db');

const insertWeather = async (district, temperature, humidity, air_pressure) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('district', sql.VarChar, district)
      .input('temperature', sql.Decimal(5, 2), temperature)
      .input('humidity', sql.Decimal(5, 2), humidity)
      .input('air_pressure', sql.Decimal(7, 2), air_pressure)
      .query('INSERT INTO Weather (district, temperature, humidity, air_pressure) VALUES (@district, @temperature, @humidity, @air_pressure)');
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
      .query('WITH LatestWeather AS (SELECT district, temperature, humidity, air_pressure, timestamp, ROW_NUMBER() OVER (PARTITION BY district ORDER BY timestamp DESC) AS rn FROM weather ) SELECT district, temperature, humidity, air_pressure, timestamp FROM LatestWeather WHERE rn = 1; ');
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
