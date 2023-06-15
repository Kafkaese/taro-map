import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { getUSDColor, formatUSDorder, formatUSDvalue } from "./formattingUtils";
import PercentageCircle from './PercentageCircle';
import SideBarExports from './SideBarExports';
import { HOST, API_PORT } from './env';

/**
 * Renders world map with tooltip with export data and a conditional, collapsible sidebar with more detailed information.
 * Zoom level and year are controlled by parent component.
 * 
 * @param {integer} year Year currently selected. Chnages data that is displayed in tooltip and sidebar
 * @param {integer} zoom Zoom level for the zoomable component that contains the actual map
 * @returns 
 */
const ExportMap = ({year, zoom}) => {

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
  
  // Remove hover tool when leaving geometry
  const handleCountryLeave = (event) => {
    setHoveredCountry(null)
    event.target.setAttribute('fill', defaultColor);
  };

  // Tooltip data fetching
  const handleCountryHover = async (alpha2, name) => {
    try {
      const arms_export_response = await fetch(`http://${HOST}:${API_PORT}/exports/arms/year?country_code=${alpha2}&year=${year}`); 
      const arms_export_data = await arms_export_response.json();
      
      const merch_export_response = await fetch(`http://${HOST}:${API_PORT}/exports/merchandise/year?country_code=${alpha2}&year=${year}`)
      const merch_export_data = await merch_export_response.json()

      setHoveredCountryData({arms_exports: arms_export_data, merch_exports : merch_export_data});
      setHoveredCountry({ name, position: mousePosition });

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };


    // Collapse for sidebar
    const [collapsed, setCollapsed] = useState(false)

    // Data for sidebar
    const [activeCountryData, setActiveCountryData] = useState({});
  
    // Gets country data for sidebar from APIs
    const handleCountryClick = async (alpha2) => {
  
      try {
  
        const name = await fetch(`http://${HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`)
        const totalExports = await fetch(`http://${HOST}:${API_PORT}/exports/year?country_code=${alpha2}&year=${year}`);
        const sources = await fetch(`http://${HOST}:${API_PORT}/exports/arms/year_all?country_code=${alpha2}&year=${year}&limit=${5}`)
        const timeSeries = await fetch(`http://${HOST}:${API_PORT}/exports/arms/timeseries?country_code=${alpha2}`)
        const merchExports = await fetch(`http://${HOST}:${API_PORT}/exports/merchandise/year?country_code=${alpha2}&year=${year}`)
  
        const nameData = await name.json();
        const totalExportsData = await totalExports.json();
        const sourcesData = await sources.json()
        const timeSeriesData = await timeSeries.json()
        const merchExportData = await merchExports.json()
  
        // update object with new data
        setActiveCountryData({ name: nameData, totalExports: totalExportsData, sources: sourcesData, timeSeries: timeSeriesData, merchExports: merchExportData});
  
        // uncollpase sidebar if new country is selected
        setCollapsed(false)


      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

  return (
    <div>
      {typeof activeCountryData.name !== 'undefined' ? <SideBarExports countryData={activeCountryData} collapsed={collapsed} onCollapse={setCollapsed} year={year}></SideBarExports> : <div/>}
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
              <div className="money" style={{ backgroundColor: getUSDColor(hoveredCountryData.arms_exports.value) }}>
                {formatUSDvalue(hoveredCountryData.arms_exports.value)}
              </div>
              <div className='annotate'><div className='text'>{formatUSDorder(hoveredCountryData.arms_exports.value)}</div></div>
              <span className='money-label'>'Exports</span>
          </div>

          <div className='circle-wrapper'>
            <PercentageCircle percentage={((hoveredCountryData.arms_exports.value/1000000) / hoveredCountryData.merch_exports.value) * 100}/>
            <span className='circle-label'>Percentage of Exports<sup>[1]</sup></span>
          </div>
          
        </div>
      </div>

)}


    </div>
  );
};

export default ExportMap;
