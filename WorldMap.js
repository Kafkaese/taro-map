import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const WorldMap = () => {
  const [highlightedCountry, setHighlightedCountry] = useState(null);

  const handleCountryHover = (event) => {
    const countryName = event.target.feature.properties.name;
    setHighlightedCountry(countryName);
  };

  const resetHighlight = () => {
    setHighlightedCountry(null);
  };

  return (
    <MapContainer style={{ height: '500px', width: '100%' }} zoom={2} center={[0, 0]}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <GeoJSON
        style={(feature) => ({
          fillColor: feature.properties.name === highlightedCountry ? 'blue' : 'gray',
          weight: 1,
          color: 'white',
          fillOpacity: 0.7,
        })}
        onEachFeature={(feature, layer) => {
          layer.on({
            mouseover: handleCountryHover,
            mouseout: resetHighlight,
          });
        }}
        data="https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
      />
    </MapContainer>
  );
};

export default WorldMap;