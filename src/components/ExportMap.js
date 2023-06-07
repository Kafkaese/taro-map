import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const ExportMap = () => {

  const HOST = 'localhost'
  const API_PORT = '8080'

  const [zoom, setZoom] = useState(1);
  const defaultColor = '#ECEFF1';
  const hoverColor = '#c4ced4';
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const [countryData, setCountryData] = useState({});


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };
  

  const handleCountryHover = async (name, geography) => {
    try {
      const response = await fetch(`http://${HOST}:${API_PORT}/total?country_name=${name}`); 
      const data = await response.json();
      setCountryData(data);
      setHoveredCountry({ name, position: mousePosition });
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  

  const handleCountryLeave = (event) => {
    setHoveredCountry(null)
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
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup zoom={zoom} center={[0, 0]}>
          <Geographies geography="/world-countries-topo.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const { name } = geo.properties;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleCountryHover(name, geo)}
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
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {hoveredCountry && (
  <div
    style={{
      position: 'fixed',
      top: hoveredCountry.position.y,
      left: hoveredCountry.position.x,
      backgroundColor: '#fff',
      padding: '4px 8px',
      border: '1px solid #ccc',
    }}
  >
    <h3>{hoveredCountry.name}</h3>
    {countryData.value && countryData.value !== 'no data' && <p>Total Exports since 1998: {(countryData.value/1000000).toFixed(2)} million €</p>}
    {countryData.value && countryData.value === 'no data' && "No data available"}
    {countryData.gdp && <p>GDP: {countryData.gdp}</p>}
    {/* Add additional data fields as needed */}
  </div>
)}


    </div>
  );
};

export default ExportMap;
