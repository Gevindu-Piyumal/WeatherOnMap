import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DistrictBorderData } from './data';
import './App.css';
import { fetchLatestWeatherData, fetchLastRecords } from './api';

export default function App() {
  const [latestWeatherData, setLatestWeatherData] = useState([]);
  const [lastRecords, setLastRecords] = useState(null);
  const center = [7.8731, 80.7718];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLatestWeatherData();
        setLatestWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDistrictClick = async (districtName) => {
    try {
      const data = await fetchLastRecords(districtName, 10);
      setLastRecords(data);
    } catch (error) {
      console.error(`Error fetching last records for ${districtName}:`, error);
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={8}
      style={{ width: '100vw', height: '100vh' }}
    >

      <TileLayer
        url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=TRf2ueSa5fdmCgl7S2Pm"
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      />
      {
        DistrictBorderData.features.map((district) => {
          const coordinates = district.geometry.coordinates[0].map((item) => [item[1], item[0]]);
          const weather = latestWeatherData.find((item) => item.district === district.name);
          return (
            <Polygon
              pathOptions={{
                fillColor: 'green',
                fillOpacity: 0.1,
                weight: 3,
                opacity: 1,
                dashArray: 1,
                color: 'white'
              }}
              positions={coordinates}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    dashArray: "",
                    fillColor: "green",
                    fillOpacity: 0.3,
                    weight: 2,
                    opacity: 1,
                    color: "white",
                  })
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.1,
                    weight: 3,
                    dashArray: "1",
                    color: 'white',
                    fillColor: 'green'
                  });
                },
                click: (e) => {
                  handleDistrictClick(district.name);
                  console.log(lastRecords);
                }
              }}
            >
              <Tooltip>
                {
                  weather && (
                    <div className="weather-card">
                      <h2>{weather.district}</h2>
                      <p><b>Temperature:</b> {weather.temperature} °C</p>
                      <p><b>Humidity:</b> {weather.humidity}%</p>
                      <p><b>Air Pressure:</b> {weather.air_pressure} hPa</p>
                      <p><b>Last updated at:</b> {new Date(weather.timestamp).toLocaleString()}</p>
                    </div>
                  )
                }
              </Tooltip>
            </Polygon>)
        })
      }
    </MapContainer>
  );
}