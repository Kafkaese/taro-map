import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const WorldMap = () => {
  // Define the colors for default and hover states
  const defaultColor = '#ECEFF1';
  const hoverColor = '#FF5722';

  // Handle the country hover event
  const handleCountryHover = (event) => {
    // Update the country color on hover
    event.target.setAttribute('fill', hoverColor);
  };

  // Handle the country mouse leave event
  const handleCountryLeave = (event) => {
    // Reset the country color on mouse leave
    event.target.setAttribute('fill', defaultColor);
  };

  return (
    <ComposableMap projection="geoMercator">
      <Geographies geography="https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onMouseEnter={handleCountryHover}
              onMouseLeave={handleCountryLeave}
              style={{
                default: {
                  fill: defaultColor,
                  stroke: '#607D8B',
                  strokeWidth: 0.75,
                  outline: 'none',
                },
                hover: {
                  fill: hoverColor,
                  stroke: '#607D8B',
                  strokeWidth: 0.75,
                  outline: 'none',
                },
                pressed: {
                  fill: hoverColor,
                  stroke: '#607D8B',
                  strokeWidth: 0.75,
                  outline: 'none',
                },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default WorldMap;
