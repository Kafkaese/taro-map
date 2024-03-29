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
 * @param {boolean} mapModeImport State of the map. If true: show imports, if false show exports.
 * @param {integer} year Year currently selected. Chnages data that is displayed in tooltip and sidebar.
 * @param {object} activeCountryData Data about the currently hovered over country on the Map. 
 * @param {object} settings Global app settings, including currency to be displayed and language (language settings currently not used).
 * @param {string} API_HOST Host (IP or Domain) of the API.
 * @param {string} API_PORT Port the API is listening on.
 *
 */
const WorldMap = ({mapModeImport, year, activeCountryData, updateActiveCountry, settings, API_HOST, API_PORT}) => {

  // geometry colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';
  const pressedColor = '#5b9e79';

  // Position and zoom level for ZoomableGroup
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  // Hover states
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  // Track mouse and let tooltip follow
  const handleMouseMove = (event) => {

    const { clientX, clientY } = event;

    setMousePosition({ x: clientX, y: clientY });

    if (hoveredCountry) {
      setHoveredCountry({...hoveredCountry, position: mousePosition})
    }

    // Ensures tooltip disappears as soon as Geography is left
    setHoveredCountry(null)
  };

  // Track mouse over Geography
  const handleMouseMoveOnGeo = (event) => {

    event.stopPropagation()

    const { clientX, clientY } = event;

    setMousePosition({ x: clientX, y: clientY });

    if (hoveredCountry) {
      setHoveredCountry({...hoveredCountry, position: mousePosition})
    }

  };

  
  // Get data for the tooltip if map mode is import
  const getImportTooltipData = async (alpha2) => {

    try {
      const fetchPromises = [
        fetch(`https://${API_HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`),
        fetch(`https://${API_HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`),
        fetch(`https://${API_HOST}:${API_PORT}/arms/imports/total?country_code=${alpha2}&year=${year}&currency=${settings.currency.value}`),
        fetch(`https://${API_HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`)
      ];
  
      const responses = await Promise.all(fetchPromises);
      
      if (responses.some(response => !response.ok)) {
        throw new Error('One or more fetch requests failed');
      }
  
      const [countryName, democracyIndex, totalArmsImports, peaceIndex] = await Promise.all(
        responses.map(response => response.json())
      );
  
      const data = {
        countryName,
        democracyIndex,
        totalArmsImports,
        peaceIndex
      };

      setHoveredCountry({...data, position: mousePosition});

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  } 

  // Get data for tooltuip if map mode export
  const getExportTooltipData = async (alpha2) => {

    try {
      const fetchPromises = [
        fetch(`https://${API_HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`),
        fetch(`https://${API_HOST}:${API_PORT}/arms/exports/total?country_code=${alpha2}&year=${year}&currency=${settings.currency}`),
        fetch(`https://${API_HOST}:${API_PORT}/merchandise/exports/total?country_code=${alpha2}&year=${year}&currency=${settings.currency}`)
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

  // Track selected Geography. Needed to keep last clicked country highlighted, and unhighlight if new one is selected.
  const [selectedGeography, setSelectedGeography] = useState(null);


  // Render
  return (
    <div className='map'>
      {typeof activeCountryData.name !== 'undefined' && activeCountryData.name.value !== 'no data' ? <SideBar mapModeImport={mapModeImport} countryData={activeCountryData} collapsed={collapsed} settings={settings} onCollapse={setCollapsed} year={year} setings={settings}></SideBar> : <div/>}
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '98vh' }}
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup onMoveEnd={handleMoveEnd} zoom={position.zoom} center={position.coordinates} translateExtent={[[-Infinity, -100], [Infinity, 600]]}> {/* [?,maxup,?, maxdown]*/}
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
                    onMouseMove={handleMouseMoveOnGeo}
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
      <div className='zoom'>
                <button className='button'
                    onClick={handleZoomIn}>+</button>
                <button className='button'
                    onClick={handleZoomOut}>-</button>
            </div>
      {hoveredCountry && (mapModeImport ? MapTooltipImports(hoveredCountry, settings) : MapTooltipExports(hoveredCountry, settings))}
    </div>
  );
};

export default WorldMap;
