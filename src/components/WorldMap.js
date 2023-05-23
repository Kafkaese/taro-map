import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const WorldMap = () => {
  const [zoom, setZoom] = useState(1);
  const defaultColor = '#ECEFF1';
  const hoverColor = '#c4ced4';

  const handleCountryHover = (event) => {
    event.target.setAttribute('fill', hoverColor);
  };

  const handleCountryLeave = (event) => {
    event.target.setAttribute('fill', defaultColor);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.2); // Increase the zoom level
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 1.2); // Decrease the zoom level
  };

  return (
    <div>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: 'auto' }}
        width={800}
        height={400}
      >
        <ZoomableGroup zoom={zoom} center={[0, 0]}>
          <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json">
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
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
