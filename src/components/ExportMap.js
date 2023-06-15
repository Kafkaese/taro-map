import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { getUSDColor, formatUSDorder, formatUSDvalue } from "./formattingUtils";
import PercentageCircle from './PercentageCircle';

const ExportMap = ({year, zoom, onCountryChange}) => {

  const HOST = 'localhost'
  const API_PORT = '8080'

  // map default colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';

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


  // Mouse enter  for hover tool
  const handleMouseEnterBox = (event) => {
    setHoveredCountry(null)
  }

  // Remove hover tool whne leaving geometry
  const handleCountryLeave = (event) => {
    setHoveredCountry(null)
    event.target.setAttribute('fill', defaultColor);
  };

  return (
    <div>
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '93vh' }}
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup zoom={zoom} center={[0, 0]} translateExtent={[[-Infinity, -100], [Infinity, 600]]}>
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
                    onClick={() => onCountryChange(alpha2)}
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
              <div className="money" style={{ backgroundColor: getUSDColor(countryData.arms_exports.value) }}>
                {formatUSDvalue(countryData.arms_exports.value)}
              </div>
              <div className='annotate'><div className='text'>{formatUSDorder(countryData.arms_exports.value)}</div></div>
              <span className='money-label'>'Exports</span>
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
