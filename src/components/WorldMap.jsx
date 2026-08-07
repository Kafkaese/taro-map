import React, { useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import MapTooltipImports from './MapTooltipImports';
import MapTooltipExports from './MapTooltipExports';
import SideBar from './SideBar';
import {
  fetchCountryName,
  fetchDemocracyIndex,
  fetchPeaceIndex,
  fetchTotalImports,
  fetchTotalExports,
  fetchMerchandiseExports
} from '../api';

import './HoverBox.css';


/**
 * Renders world map with tooltip and a conditional, collapsible sidebar with more detailed information.
 * Zoom level and year are controlled by parent component.
 *
 * @param {boolean} mapModeImport State of the map. If true: show imports, if false show exports.
 * @param {integer} year Year currently selected. Chnages data that is displayed in tooltip and sidebar.
 * @param {object} activeCountryData Data about the currently hovered over country on the Map.
 * @param {function} onCountrySelect Called with a country's alpha-2 code when it's clicked. The parent is responsible for fetching its data.
 * @param {function} [onMapClick] Called on any click within the map area - both the background and a country - regardless of whether a country was actually selected.
 * @param {object} settings Global app settings, including currency to be displayed and language (language settings currently not used).
 *
 */
const WorldMap = ({mapModeImport, year, activeCountryData, onCountrySelect, onMapClick, settings}) => {

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

  // Tracks the in-flight tooltip request so hovering a new country (or
  // leaving one) can cancel a slower, now-stale one instead of letting it
  // resolve later and overwrite the current tooltip.
  const tooltipAbortControllerRef = useRef(null);


  // Track mouse over the map background. handleMouseMoveOnGeo (below) calls
  // stopPropagation while hovering a Geography, so this only ever fires
  // when the mouse is over open ocean/background - i.e. whenever it does
  // fire, no tooltip should be showing.
  const handleMouseMove = (event) => {

    const { clientX, clientY } = event;

    setMousePosition({ x: clientX, y: clientY });

    // Ensures tooltip disappears as soon as Geography is left
    setHoveredCountry(null)
  };

  // Track mouse over Geography, keeping the tooltip glued to the cursor.
  const handleMouseMoveOnGeo = (event) => {

    event.stopPropagation()

    const { clientX, clientY } = event;
    const position = { x: clientX, y: clientY };

    setMousePosition(position);

    if (hoveredCountry) {
      setHoveredCountry({...hoveredCountry, position})
    }

  };

  
  // Get data for the tooltip if map mode is import
  const getImportTooltipData = async (alpha2) => {

    tooltipAbortControllerRef.current?.abort();
    const controller = new AbortController();
    tooltipAbortControllerRef.current = controller;
    const { signal } = controller;

    try {
      const currency = settings.currency.value;

      const [countryName, democracyIndex, totalArmsImports, peaceIndex] = await Promise.all([
        fetchCountryName(alpha2, signal),
        fetchDemocracyIndex(alpha2, year, signal),
        fetchTotalImports(alpha2, year, currency, signal),
        fetchPeaceIndex(alpha2, year, signal)
      ]);

      const data = {
        countryName,
        democracyIndex,
        totalArmsImports,
        peaceIndex
      };

      setHoveredCountry({...data, position: mousePosition});

    } catch (error) {
      if (error.name === 'AbortError') return; // superseded by a newer hover, not a real failure
      console.error('Error fetching country data:', error);
    }
  }

  // Get data for tooltuip if map mode export
  const getExportTooltipData = async (alpha2) => {

    tooltipAbortControllerRef.current?.abort();
    const controller = new AbortController();
    tooltipAbortControllerRef.current = controller;
    const { signal } = controller;

    try {
      const currency = settings.currency.value;

      const [countryName, totalArmsExports, totalMerchExports] = await Promise.all([
        fetchCountryName(alpha2, signal),
        fetchTotalExports(alpha2, year, currency, signal),
        fetchMerchandiseExports(alpha2, year, currency, signal)
      ]);

      const data = {
        countryName,
        totalArmsExports,
        totalMerchExports
      };

      setHoveredCountry({...data, position: mousePosition});

    } catch (error) {
      if (error.name === 'AbortError') return; // superseded by a newer hover, not a real failure
      console.error('Error fetching country data:', error);
      throw error; // Rethrow the error to indicate that an error occurred
    }

  }

  // Remove hover tool when leaving geometry
  const handleCountryLeave = (event) => {
    tooltipAbortControllerRef.current?.abort();
    setHoveredCountry(null)
    event.target.setAttribute('fill', defaultColor);
  };


  // Collapse for sidebar
  const [collapsed, setCollapsed] = useState(false)

  // Gets country data for sidebar from APIs
  const handleCountryClick = (event, alpha2, geo) => {

    // Stop this from also reaching handleMapBackgroundClick below - a
    // country click should open the sidebar, not immediately close it.
    event.stopPropagation();

    // Set active Geography
    setSelectedGeography(geo);

    // Notify parent, which fetches this country's data
    onCountrySelect(alpha2);

    // uncollpase sidebar if new country is selected
    setCollapsed(false)

    onMapClick?.();
  };

  // Clicking the map background (anywhere that isn't a country) closes the
  // sidebar. Only reachable when the click doesn't land on a Geography,
  // since handleCountryClick stops propagation.
  const handleMapBackgroundClick = () => {
    setCollapsed(true);
    onMapClick?.();
  };

  // Track selected Geography. Needed to keep last clicked country highlighted, and unhighlight if new one is selected.
  const [selectedGeography, setSelectedGeography] = useState(null);


  // Render
  return (
    <div className='map'>
      {typeof activeCountryData.name !== 'undefined' && activeCountryData.name.value !== 'no data' ? <SideBar mapModeImport={mapModeImport} countryData={activeCountryData} collapsed={collapsed} settings={settings} onCollapse={setCollapsed} year={year} setings={settings}></SideBar> : <div/>}
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '98vh', cursor: 'grab' }}
        onMouseMove={handleMouseMove}
        onClick={handleMapBackgroundClick}
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
                    onClick={(event) => handleCountryClick(event, alpha2, geo)}
                    onMouseMove={handleMouseMoveOnGeo}
                    style={{
                      default: {
                        fill: selectedGeography === geo ? pressedColor : defaultColor,
                        stroke: '#607D8B',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.25,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: hoverColor,
                        stroke: '#607D8B',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.30,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: pressedColor,
                        stroke: '#FFFFFF',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.85,
                        outline: 'none',
                        cursor: 'pointer',
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
                    aria-label="Zoom in"
                    onClick={handleZoomIn}>+</button>
                <button className='button'
                    aria-label="Zoom out"
                    onClick={handleZoomOut}>-</button>
            </div>
      {hoveredCountry && (mapModeImport ? MapTooltipImports(hoveredCountry, settings) : MapTooltipExports(hoveredCountry, settings))}
    </div>
  );
};

export default WorldMap;
