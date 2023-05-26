import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import './HoverBox.css';


const ImportMap = () => {
  const [zoom, setZoom] = useState(1);
  const defaultColor = '#c4ced4';
  const hoverColor = '#ECEFF1';
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const [countryData, setCountryData] = useState({});


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };
  

  const handleCountryHover = async (alpha2, name, geography) => {
    try {
      const democracy_index = await fetch(`http://localhost:8000/metadata/democracy_index?country_code=${alpha2}&year=2021`);
      const total_imports = await fetch(`http://localhost:8000/imports/total?country_code=${alpha2}`);
      
      const democracy_index_data = await democracy_index.json();
      const total_imports_data = await total_imports.json();
     
      setCountryData({ democracy_index: democracy_index_data, total_imports: total_imports_data});

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

  const getColor = (value) => {
    if (value >= 9.0) {
      return '#008000'
    } else if (value >= 7.0) {
      return '#98fb98'
    } else if (value >= 4.0) {
      return '#ffae42'
    } else {
      return '#8b0000'}
  }

  const getUSDColor = (value) => {
    if (value >= 4713.75) {
      return '#8b0000'
    } else if (value >= 342.5) {
      return '#ffae42'
    } else {
      return '#008000'}
  }

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
                const { 'Alpha-2': alpha2 } = geo.properties;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleCountryHover(alpha2, name, geo)}
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
        <div className="hover-box-container" style={{top: hoveredCountry.position.y, left: hoveredCountry.position.x,}}>
        <h3>{hoveredCountry.name}</h3>

        <div className="circle-container">
          <div className="circle" style={{ backgroundColor: getUSDColor(countryData.total_imports.value) }}>
            {countryData.total_imports.value}
          </div>

          <div className="circle" style={{ backgroundColor: getColor(countryData.democracy_index.value) }}>
            {countryData.democracy_index.value}
          </div>

          <div className="circle" style={{ backgroundColor: getColor(countryData.value) }}>
            {countryData.value}
          </div>
        </div>
      </div>

)}


    </div>
  );
};

export default ImportMap;
