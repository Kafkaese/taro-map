import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import PercentageCircle from './PercentageCircle';

import './Zoom.css'

const ExportMap = ({year}) => {

  const HOST = 'localhost'
  const API_PORT = '8080'

  // map default colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';

  const [zoom, setZoom] = useState(1);

  const [hoveredCountry, setHoveredCountry] = useState(null);

  const [countryData, setCountryData] = useState({});


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };
  

  const handleCountryHover = async (alpha2, name, geography) => {
    try {
      const arms_export_response = await fetch(`http://${HOST}:${API_PORT}/exports/arms/year?country_code=${alpha2}&year=${year}`); 
      const arms_export_data = await arms_export_response.json();
      
      const merch_export_response = await fetch(`http://${HOST}:${API_PORT}/exports/merchandise/year?country_code=${alpha2}&year=${year}`)
      const merch_export_data = await merch_export_response.json()

      setCountryData({arms_exports: arms_export_data, merch_exports : merch_export_data});
      setHoveredCountry({ name, position: mousePosition });

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };


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

  
  /*
  const getPercentageColor = (value) => {
    switch(value) {
      case :
        // code block
        break;
      case y:
        // code block
        break;
      default:
        // code block
    } 
  }
*/

  // Mouse enter  for hover tool
  const handleMouseEnterBox = (event) => {
    //console.log('MOUSE ENTER BOX')
    setHoveredCountry(null)
  }

  // Remove hover tool whne leaving geometry
  const handleCountryLeave = (event) => {
    //console.log('Mouse Leave')
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
          
          <div className="circle-wrapper">
            <div className="circle" style={{ backgroundColor: getUSDColor(countryData.arms_exports.value) }}>
              {formatUSD(countryData.arms_exports.value)}
            </div>
            <span className='circle-label'>Exports</span>
          </div>

          <div className='circle-wrapper'>
            <PercentageCircle percentage={((countryData.arms_exports.value/1000000) / countryData.merch_exports.value) * 100}/>
            <span className='circle-label'>Percentage of Exports<sup>[1]</sup></span>
          </div>
          
        </div>
      </div>

)}


    </div>
  );
};

export default ExportMap;
