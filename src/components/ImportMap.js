import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import './HoverBox.css';
import './Zoom.css';


const ImportMap = ({year}) => {

  // API url 
  const HOST = 'localhost'
  const API_PORT = '8080'

  // map defaulo colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';
  
  // Map states
  const [zoom, setZoom] = useState(1);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [countryData, setCountryData] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse and hover tool follow
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
    if (hoveredCountry) {
      setHoveredCountry({...hoveredCountry, position: mousePosition})
    }
  };
  
  // Mouse enter  for hover tool
  const handleMouseEnterBox = (event) => {
    console.log('MOUSE ENTER BOX')
    setHoveredCountry(null)
  }

  // Actual hover tool logic with API calls
  const handleCountryHover = async (alpha2, name, geography) => {
    console.log('Mouse Enter')
    try {
      const democracy_index = await fetch(`http://${HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`);
      const total_imports = await fetch(`http://${HOST}:${API_PORT}/imports/year?country_code=${alpha2}&year=${year}`);
      const peace_index = await fetch(`http://${HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`);
      
      const democracy_index_data = await democracy_index.json();
      const peace_index_data = await peace_index.json();
      const total_imports_data = await total_imports.json();
     
      setCountryData({ democracy_index: democracy_index_data, peace_index: peace_index_data,total_imports: total_imports_data});

      setHoveredCountry({ name, position: mousePosition });

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  
  // Remove hover tool whne leaving geometry
  const handleCountryLeave = (event) => {
    console.log('Mouse Leave')
    setHoveredCountry(null)
    event.target.setAttribute('fill', defaultColor);
  };

  // Zoom
  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.2); // Increase the zoom level
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 1.2); // Decrease the zoom level
  };

  // Color coding for democracy index
  const getDemocracyColor = (value) => {
    if (value >= 9.0) {
      return '#008000'
    } else if (value >= 7.0) {
      return '#98fb98'
    } else if (value >= 4.0) {
      return '#ffae42'
    } else if (value >= 0.0) {
      return '#8b0000'
    } else {
      return '#383838'
    }
      
  }

  // Color coding for peace index
  const getPeaceColor = (value) => {
    if (value < 1.0) {
      return '#00E676' // green
    } else if (value < 2.0) {
      return '#C6FF00' // green-yellow
    } else if (value < 3.0) {
      return '#FFFF00' // yellow
    } else if (value < 4.0) {
      return '#FFD600' // orange
    } else {
      return '#383838' // red
    }
      
  }

  // Color coding for USD import values
  const getUSDColor = (value) => {
    if (value >= 4713.75) {
      return '#8b0000'
    } else if (value >= 342.5) {
      return '#ffae42'
    } else if (value >= 0) {
      return '#008000'
    } else {
      return '#383838'}
  }

  // Formatting for USD import values to k, mn or bn
  const formatUSD = (value) => {
    console.log(value)
    if (value > 1000000000) {
      return `${(value / 1000000000).toFixed(2)} bn`
    } else if (value > 1000000) {
      return `${(value / 1000000).toFixed(2)} mn`
    } else if (value > 1000) {
      return `${(value / 1000).toFixed(2)} k`
    }else {
      return value
    }
  }

  return (
    <div>
      <div className='zoom'>
        <button className='button' onClick={handleZoomIn}>+</button>
        <button className='button' onClick={handleZoomOut}>-</button>
      </div>
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
                    onMouseOver={() => handleCountryHover(alpha2, name, geo)}
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
      <div className="hover-box-container" style={{top: hoveredCountry.position.y +5, left: hoveredCountry.position.x +10,}}
      onMouseEnter={handleMouseEnterBox}>
        <h3>{hoveredCountry.name}</h3>

        
        <div className="circle-container">
          
          <div className="money-wrapper">
            <div className="money" style={{ backgroundColor: getUSDColor(countryData.total_imports.value) }}>
              {formatUSD(countryData.total_imports.value)}
            </div>
            <div className='annotate'><div className='text'>billion</div></div>
            <span className='money-label'>Imports</span>
          </div>

          <div className='circle-wrapper'>
            <div className="circle" style={{ backgroundColor: getDemocracyColor(countryData.democracy_index.value) }}>
              {countryData.democracy_index.value}
            </div>
            <span className='circle-label'>Democracy Index<sup>[1]</sup></span>
          </div>

          <div className='circle-wrapper'>
            <div className="circle" style={{ backgroundColor: getPeaceColor(countryData.peace_index.value) }}>
              {countryData.peace_index.value}
            </div>
            <span className='circle-label'>Peace Index <sup>[2]</sup></span>
          </div>
          
        </div>
      </div>

)}


    </div>
  );
};

export default ImportMap;
