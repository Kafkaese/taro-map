import React, { useState, useRef, useEffect } from 'react';
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
  fetchAvailableImportCountries,
  fetchAvailableExportCountries
} from '../api';

import './HoverBox.css';


/**
 * Renders world map with tooltip and a sidebar with more detailed information,
 * shown only while a country is selected.
 * Zoom level and year are controlled by parent component. Countries with no
 * data at all for the current year/mode are greyed out (see availableCountries
 * below) but remain fully clickable/hoverable.
 *
 * @param {boolean} mapModeImport State of the map. If true: show imports, if false show exports.
 * @param {integer} year Year currently selected. Chnages data that is displayed in tooltip and sidebar.
 * @param {object} activeCountryData Data about the currently hovered over country on the Map.
 * @param {function} onCountrySelect Called with a country's alpha-2 code when it's clicked. The parent is responsible for fetching its data.
 * @param {function} [onCountryDeselect] Called when the sidebar's close button is clicked, or the map background is clicked while a country is selected. The parent is responsible for clearing activeCountryData, which is what actually makes the sidebar disappear.
 * @param {function} [onMapClick] Called on any click within the map area - both the background and a country - regardless of whether a country was actually selected.
 * @param {object} settings Global app settings, including currency to be displayed and language (language settings currently not used).
 * @param {boolean} [isMobile] Touch devices don't have reliable hover, so the cursor-following hover tooltip is suppressed entirely when true - tapping a country still selects it and opens the sidebar as normal.
 *
 */
const WorldMap = ({mapModeImport, year, activeCountryData, onCountrySelect, onCountryDeselect, onMapClick, settings, isMobile}) => {

  // geometry colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';
  const pressedColor = '#5b9e79';

  // Muted grey used for countries with no data at all for the selected
  // year/mode - close in lightness to the pastel green "has data" default
  // (#84B098, ~59% lightness) but desaturated/neutral, so it reads as a
  // clearly distinct grey without looking like a bright off-white/bone
  // (too pale) or dominating the map with a heavy dark grey (too strong).
  // Same lightest->darkest progression as the green states above.
  const noDataColor = '#8B95A1';
  const noDataHoverColor = '#5B6675';
  const noDataPressedColor = '#3D4652';

  // Bulk set of country codes that have any data for the current year/mode,
  // used to grey out the rest. null means "not yet loaded" - deliberately
  // treated as "assume every country has data" below, so the map doesn't
  // flash all-grey before this resolves.
  const [availableCountries, setAvailableCountries] = useState(null);
  const availabilityAbortControllerRef = useRef(null);

  useEffect(() => {
    availabilityAbortControllerRef.current?.abort();
    const controller = new AbortController();
    availabilityAbortControllerRef.current = controller;

    const fetchAvailability = mapModeImport ? fetchAvailableImportCountries : fetchAvailableExportCountries;

    fetchAvailability(year, controller.signal)
      .then((countryCodes) => setAvailableCountries(new Set(countryCodes)))
      .catch((error) => {
        if (error.name === 'AbortError') return; // superseded by a newer year/mode, not a real failure
        console.error('Error fetching country data availability:', error);
        setAvailableCountries(null);
      });

    return () => controller.abort();
  }, [year, mapModeImport]);

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
    // Dragging/panning (or scroll/pinch-zooming) the map is just as much
    // "engaging with it" as clicking, so it should dismiss the hint too.
    onMapClick?.();
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

      const [countryName, totalArmsExports] = await Promise.all([
        fetchCountryName(alpha2, signal),
        fetchTotalExports(alpha2, year, currency, signal)
      ]);

      const data = {
        countryName,
        totalArmsExports
      };

      setHoveredCountry({...data, position: mousePosition});

    } catch (error) {
      if (error.name === 'AbortError') return; // superseded by a newer hover, not a real failure
      console.error('Error fetching country data:', error);
      throw error; // Rethrow the error to indicate that an error occurred
    }

  }

  // Remove hover tool when leaving geometry. resetFill is this geography's
  // already-resolved "resting" color (accounting for both selection and
  // data-availability) - passed in rather than hardcoding defaultColor here,
  // since that would flash a no-data (grey) country green for a moment.
  const handleCountryLeave = (event, resetFill) => {
    tooltipAbortControllerRef.current?.abort();
    setHoveredCountry(null)
    event.target.setAttribute('fill', resetFill);
  };


  // Gets country data for sidebar from APIs
  const handleCountryClick = (event, alpha2, geo) => {

    // Stop this from also reaching handleMapBackgroundClick below - a
    // country click should open the sidebar, not immediately close it.
    event.stopPropagation();

    // Set active Geography
    setSelectedGeography(geo);

    // Notify parent, which fetches this country's data
    onCountrySelect(alpha2);

    // The sidebar now shows this country's full detail, so the cursor
    // tooltip is redundant - without this it would linger (since clicking
    // doesn't itself fire onMouseLeave) and end up rendering behind the
    // newly-opened sidebar instead of disappearing. Also aborts any
    // in-flight tooltip fetch, so a response that lands just after the
    // click can't resurrect it a moment later.
    tooltipAbortControllerRef.current?.abort();
    setHoveredCountry(null);

    onMapClick?.();
  };

  // Clicking the map background (anywhere that isn't a country) closes the
  // sidebar. Only reachable when the click doesn't land on a Geography,
  // since handleCountryClick stops propagation.
  const handleMapBackgroundClick = () => {
    // Un-highlight the previously selected country too - the sidebar it
    // was showing detail for is now closed, so it shouldn't still look selected.
    setSelectedGeography(null);
    onCountryDeselect?.();
    onMapClick?.();
  };

  // Called from the sidebar's own close button - same effect as clicking
  // the map background (unhighlight + tell the parent to drop the data),
  // just triggered from inside the panel instead.
  const handleSidebarClose = () => {
    setSelectedGeography(null);
    onCountryDeselect?.();
  };

  // Track selected Geography. Needed to keep last clicked country highlighted, and unhighlight if new one is selected.
  const [selectedGeography, setSelectedGeography] = useState(null);


  // Render
  return (
    <div className='map'>
      {typeof activeCountryData.name !== 'undefined' && activeCountryData.name.value !== 'no data' ? <SideBar mapModeImport={mapModeImport} countryData={activeCountryData} settings={settings} onClose={handleSidebarClose} year={year}></SideBar> : <div/>}
      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '98vh', cursor: 'grab' }}
        onMouseMove={handleMouseMove}
        onClick={handleMapBackgroundClick}
      >
        {/* Bounds how far the map can be dragged, in ComposableMap's internal
            800x600 coordinate space (its default viewBox size - unrelated to
            the CSS-rendered size set via style above). Y already had a real
            bound (-100 to 600, i.e. the map height plus a bit of slack at the
            top); X previously had none at all ([-Infinity, Infinity]), which
            is what let you drag infinitely west into empty space - bounded
            here the same way, roughly the map width (800) plus matching
            slack on each side. True east-west wrapping isn't realistic with
            react-simple-maps (it renders one static SVG projection of the
            whole world, not repeating map tiles the way Leaflet/Google Maps
            do), so this just stops the drag at a sane edge instead. */}
        <ZoomableGroup onMoveEnd={handleMoveEnd} zoom={position.zoom} center={position.coordinates} translateExtent={[[-100, -100], [900, 600]]}>
          <Geographies geography="/world-new.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const { 'countryKey': alpha2 } = geo.properties;
                const hasData = availableCountries === null || availableCountries.has(alpha2);
                const restingFill = !hasData ? noDataColor : (selectedGeography === geo ? pressedColor : defaultColor);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseOver={isMobile ? undefined : () => mapModeImport ? getImportTooltipData(alpha2) : getExportTooltipData(alpha2)}
                    onMouseLeave={(event) => handleCountryLeave(event, restingFill)}
                    onClick={(event) => handleCountryClick(event, alpha2, geo)}
                    onMouseMove={handleMouseMoveOnGeo}
                    style={{
                      default: {
                        fill: restingFill,
                        stroke: '#607D8B',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.25,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: hasData ? hoverColor : noDataHoverColor,
                        stroke: '#607D8B',
                        strokeLinejoin: 'round',
                        strokeWidth: 0.30,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: hasData ? pressedColor : noDataPressedColor,
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
      {hoveredCountry && (mapModeImport
        ? <MapTooltipImports hoveredCountry={hoveredCountry} settings={settings} />
        : <MapTooltipExports hoveredCountry={hoveredCountry} settings={settings} />)}
    </div>
  );
};

export default WorldMap;
