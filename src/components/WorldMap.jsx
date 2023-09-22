import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import MapTooltipImports from './MapTooltipImports';
import MapTooltipExports from './MapTooltipExports';
import SideBar from './SideBar';

import './HoverBox.css';


/**
 * Renders world map with tooltip and a conditional, collapsible sidebar with more detailed information.
 * Zoom level and year are controlled by parent component.
 * 
 * @param {integer} year Year currently selected. Chnages data that is displayed in tooltip and sidebar
 * @param {integer} zoom Zoom level for the zoomable component that contains the actual map
 *
 */
const WorldMap = ({mapModeImport, year, zoom, activeCountryData, updateActiveCountry}) => {

  // API vars from env
  const API_HOST = process.env.REACT_APP_API_HOST
  const API_PORT = process.env.REACT_APP_API_PORT


  // geometry colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';
  const pressedColor = '#5b9e79';

  // Hover states
  const [hoveredCountry, setHoveredCountry] = useState(null);
  //const [hoveredCountryData, setHoveredCountryData] = useState({});
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
      const fetchPromises = [
        fetch(`http://${API_HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`),
        fetch(`http://${API_HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`),
        fetch(`http://${API_HOST}:${API_PORT}/arms/imports/total?country_code=${alpha2}&year=${year}`),
        fetch(`http://${API_HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`)
      ];
  
      const responses = await Promise.all(fetchPromises);
      
      if (responses.some(response => !response.ok)) {
        throw new Error('One or more fetch requests failed');
      }
  
      const [countryName, democracyIndex, totalImports, peaceIndex] = await Promise.all(
        responses.map(response => response.json())
      );
  
      const data = {
        countryName,
        democracyIndex,
        totalImports,
        peaceIndex
      };

      setHoveredCountry({...data, position: mousePosition});

    } catch (error) {
      console.error('Error fetching country data:', error);
      throw error; // Rethrow the error to indicate that an error occurred
    }
  } 

  // Get data for tooltuip if map mode export
  const getExportTooltipData = async (alpha2) => {

    try {
      const fetchPromises = [
        fetch(`http://${API_HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`),
        fetch(`http://${API_HOST}:${API_PORT}/arms/exports/total?country_code=${alpha2}&year=${year}`),
        fetch(`http://${API_HOST}:${API_PORT}/merchandise/exports/total?country_code=${alpha2}&year=${year}`)
      ];
  
      const responses = await Promise.all(fetchPromises);
      
      if (responses.some(response => !response.ok)) {
        throw new Error('One or more fetch requests failed');
      }
  
      const [countryName, totalArmsExports, totalMerchExports] = await Promise.all(
        responses.map(response => response.json())
      );
  
      const data = {
        countryName,
        totalArmsExports,
        totalMerchExports
      };

      setHoveredCountry({...data, position: mousePosition});

    } catch (error) {
      console.error('Error fetching country data:', error);
      throw error; // Rethrow the error to indicate that an error occurred
    }

  }

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
      {typeof activeCountryData.name !== 'undefined' && activeCountryData.name.value !== 'no data' ? <SideBar mapModeImport={mapModeImport} countryData={activeCountryData} collapsed={collapsed} onCollapse={setCollapsed} year={year}></SideBar> : <div/>}
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '93vh' }}
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup zoom={zoom} center={[0, 0]} translateExtent={[[-Infinity, -100], [Infinity, 600]]}> {/* [?,maxup,?, maxdown]*/}
          <Geographies geography="/world-new.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const { 'countryKey': alpha2 } = geo.properties;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseOver={() => mapModeImport ? getImportTooltipData(alpha2) : getExportTooltipData(alpha2)}
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
                        stroke: '#FFFFFF',
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
      {hoveredCountry && (mapModeImport ? MapTooltipImports(hoveredCountry, handleMouseEnterBox) : MapTooltipExports(hoveredCountry, handleMouseEnterBox))}
    </div>
  );
};

export default WorldMap;
