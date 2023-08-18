import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { getDemocracyColor, getPeaceColor, getUSDColor, formatUSDorder, formatUSDvalue } from "./formattingUtils";
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

  // API vars from env
  const HOST = process.env.REACT_APP_API_HOST
  const API_PORT = process.env.REACT_APP_API_PORT

  // Conrols wether to show import or export data
  const [mapMode, setMapMode] = useState('import');

  // geometry colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';
  const pressedColor = '#80dbfc';

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
  
  // Get data for the tooltip if map mode is import
  const getImportTooltipData = async (alpha2) => {
    try {
      const democracyIndex = await fetch(`http://${HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`);
      const totalImports = await fetch(`http://${HOST}:${API_PORT}/arms/imports/total?country_code=${alpha2}&year=${year}`);
      const peaceIndex = await fetch(`http://${HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`);
      
      const democracyIndexData = await democracyIndex.json();
      const peaceIndexData = await peaceIndex.json();
      const totalImportsData = await totalImports.json();

      return { democracyIndex: democracyIndexData, peaceIndex: peaceIndexData,totalImports: totalImportsData}

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  } 

  // Get data for tooltuip if map mode export
  const getExportTooltipData = async (alpha2) => {

    try {
      const arms_export_response = await fetch(`http://${HOST}:${API_PORT}/arms/exports/total?country_code=${alpha2}&year=${year}`); 
      const arms_export_data = await arms_export_response.json();
      
      const merch_export_response = await fetch(`http://${HOST}:${API_PORT}/merchandise/exports/total?country_code=${alpha2}&year=${year}`)
      const merch_export_data = await merch_export_response.json()

      return {arms_exports: arms_export_data, merch_exports : merch_export_data}


    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }

  // Tooltip data fetching 
  const handleCountryHover = async (alpha2, name) => {
   
    // data
    var data = {}

    // Get data based on mapMode 
    mapMode === 'import' ? data = getImportTooltipData(alpha2) : data = getExportTooltipData(alpha2);
    
    // Populate data for tooltip with API resonses
    setHoveredCountryData(data);

    // Set hovered country state
    setHoveredCountry({ name, position: mousePosition });

  };

  // Remove hover tool when leaving geometry
  const handleCountryLeave = (event) => {
    setHoveredCountry(null)
    event.target.setAttribute('fill', defaultColor);
  };


  // Collapse for sidebar
  const [collapsed, setCollapsed] = useState(false)

  // Gets country data for sidebar from APIs
  const handleCountryClick = (alpha2, geo, style) => {
    
    // Set active Geography
    setSelectedGeography(geo);

    // Call update function on parent
    updateActiveCountry(alpha2);

    // uncollpase sidebar if new country is selected
    setCollapsed(false)
  };

  const [selectedGeography, setSelectedGeography] = useState(null);



  return (
    <div>
      {typeof activeCountryData.name !== 'undefined' && activeCountryData.name.value !== 'no data' ? <SideBarImports countryData={activeCountryData} collapsed={collapsed} onCollapse={setCollapsed} year={year}></SideBarImports> : <div/>}
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '93vh' }}
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup zoom={zoom} center={[0, 0]} translateExtent={[[-Infinity, -100], [Infinity, 600]]}> {/* [?,maxup,?, maxdown]*/}
          <Geographies geography="/world-new.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const { 'countryName': name } = geo.properties;
                const { 'countryKey': alpha2 } = geo.properties;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseOver={() => handleCountryHover(alpha2, name, geo)}
                    onMouseLeave={handleCountryLeave}
                    onClick={() => handleCountryClick(alpha2, geo)}
                    style={{
                      default: {
                        fill: selectedGeography === geo ? pressedColor : defaultColor,
                        stroke: '#607D8B',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.25,
                        outline: 'none',
                      },
                      hover: {
                        fill: hoverColor,
                        stroke: '#607D8B',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.30,
                        outline: 'none',
                      },
                      pressed: {
                        fill: pressedColor,
                        stroke: '#607D8B',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.85,
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
