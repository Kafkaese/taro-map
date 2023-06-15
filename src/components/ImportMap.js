import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { getDemocracyColor, getPeaceColor, getUSDColor, formatUSDorder, formatUSDvalue } from "./formattingUtils";
import { HOST, API_PORT } from './env';
import SideBarImports from './SideBarImports';

import './HoverBox.css';

/**
 * Renders world map with tooltip with import data and a conditional, collapsible sidebar with more detailed information.
 * Zoom level and year are controlled by parent component.
 * 
 * @param {integer} year Year currently selected. Chnages data that is displayed in tooltip and sidebar
 * @param {integer} zoom Zoom level for the zoomable component that contains the actual map
 * @returns 
 */
const ImportMap = ({year, zoom, activeCountryData, updateActiveCountry}) => {

  // geometry colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';

  // Hover states
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoveredCountryData, setHoveredCountryData] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse and let tooltip follow
  const handleMouseMove = (event) => {

    const { clientX, clientY } = event;

    setMousePosition({ x: clientX, y: clientY });

    if (hoveredCountry) {
      setHoveredCountry({...hoveredCountry, position: mousePosition})
    }

  };

  // Mouse enter  for hover tool
  const handleMouseEnterBox = (event) => {
    setHoveredCountry(null)
  }
  
  // Tooltip data fetching 
  const handleCountryHover = async (alpha2, name) => {
    try {
      const democracyIndex = await fetch(`http://${HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`);
      const totalImports = await fetch(`http://${HOST}:${API_PORT}/imports/year?country_code=${alpha2}&year=${year}`);
      const peaceIndex = await fetch(`http://${HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`);
      
      const democracyIndexData = await democracyIndex.json();
      const peaceIndexData = await peaceIndex.json();
      const totalImportsData = await totalImports.json();
     
      // Populate data for tooltip with API resonses
      setHoveredCountryData({ democracyIndex: democracyIndexData, peaceIndex: peaceIndexData,totalImports: totalImportsData});

      // Set hovered country state
      setHoveredCountry({ name, position: mousePosition });

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  // Remove hover tool when leaving geometry
  const handleCountryLeave = (event) => {
    setHoveredCountry(null)
    event.target.setAttribute('fill', defaultColor);
  };


  // Collapse for sidebar
  const [collapsed, setCollapsed] = useState(false)

  // Gets country data for sidebar from APIs
  const handleCountryClick = (alpha2) => {
    
    // Call update function on parent
    updateActiveCountry(alpha2);

    // uncollpase sidebar if new country is selected
    setCollapsed(false)
  };


  return (
    <div>
      {typeof activeCountryData.name !== 'undefined' && activeCountryData.name.value !== 'no data' ? <SideBarImports countryData={activeCountryData} collapsed={collapsed} onCollapse={setCollapsed} year={year}></SideBarImports> : <div/>}
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '93vh' }}
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup zoom={zoom} center={[0, 0]} translateExtent={[[-Infinity, -100], [Infinity, 600]]}> /* [?,maxup,?, maxdown]*/
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
                    onClick={() => handleCountryClick(alpha2)}
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
            <div className="money" style={{ backgroundColor: getUSDColor(hoveredCountryData.totalImports.value) }}>
              {formatUSDvalue(hoveredCountryData.totalImports.value)}
            </div>
            <div className='annotate'><div className='text'>{formatUSDorder(hoveredCountryData.totalImports.value)}</div></div>
            <span className='money-label'>Imports</span>
          </div>

          <div className='circle-wrapper'>
            <div className="circle" style={{ backgroundColor: getDemocracyColor(hoveredCountryData.democracyIndex.value) }}>
              {hoveredCountryData.democracyIndex.value}
            </div>
            <span className='circle-label'>Democracy Index<sup>[1]</sup></span>
          </div>

          <div className='circle-wrapper'>
            <div className="circle" style={{ backgroundColor: getPeaceColor(hoveredCountryData.peaceIndex.value) }}>
              {hoveredCountryData.peaceIndex.value}
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
