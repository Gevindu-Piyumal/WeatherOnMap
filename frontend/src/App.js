import React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from './data';
import './App.css';

const center = [7.8731, 80.7718];

export default function App() {
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
        statesData.features.map((state) => {
          const coordinates = state.geometry.coordinates[0].map((item) => [item[1], item[0]]);
          return (<Polygon
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
                window.alert(state.properties.name + " " + state.properties.density)
              }
            }}
          >
            <Tooltip>{state.properties.name}</Tooltip>
          </Polygon>)
        })
      }
    </MapContainer>
  );
}