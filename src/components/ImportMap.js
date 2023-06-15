import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { getDemocracyColor, getPeaceColor, getUSDColor, formatUSDorder, formatUSDvalue } from "./formattingUtils";
import { HOST, API_PORT } from './env';
import SideBarImports from './SideBarImports';

import './HoverBox.css';

const ImportMap = ({year, zoom, onCountryChange}) => {

  // map defaulo colors
  const defaultColor = '#84B098';
  const hoverColor = '#66B087';
  
  // Data fot sidebar
  const [activeCountryData, setActiveCountryData] = useState({});

  // Map states
  //const [zoom, setZoom] = useState(1);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [countryData, setCountryData] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Collapse for sidebar
  const [collapsed, setCollapsed] = useState(false)

  // Track mouse and hover tool follow
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
    if (hoveredCountry) {
      setHoveredCountry({...hoveredCountry, position: mousePosition})
    }
  };
  
  // Gets country data for sidebar from APIs
  const handleCountryClick = async (alpha2, name, geography) => {

    try {

      const name = await fetch(`http://${HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`)
      const democracy_index = await fetch(`http://${HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`);
      const total_imports = await fetch(`http://${HOST}:${API_PORT}/imports/year?country_code=${alpha2}&year=${year}`);
      const peace_index = await fetch(`http://${HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`);
      const sources = await fetch(`http://${HOST}:${API_PORT}/imports/arms/year_all?country_code=${alpha2}&year=${year}&limit=${5}`)

      const name_data = await name.json();
      const democracy_index_data = await democracy_index.json();
      const peace_index_data = await peace_index.json();
      const total_imports_data = await total_imports.json();
      const sources_data = await sources.json()

      // update object with new data
      setActiveCountryData({ name: name_data, democracy_index: democracy_index_data, peace_index: peace_index_data, total_imports: total_imports_data, sources: sources_data});

      setCollapsed(false)

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
  // Mouse enter  for hover tool
  const handleMouseEnterBox = (event) => {
    setHoveredCountry(null)
  }

  // Actual hover tool logic with API calls
  const handleCountryHover = async (alpha2, name, geography) => {
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
    setHoveredCountry(null)
    event.target.setAttribute('fill', defaultColor);
  };

  return (
    <div>
      {typeof activeCountryData.name !== 'undefined' ? <SideBarImports countryData={activeCountryData} collapsed={collapsed} onCollapse={setCollapsed}></SideBarImports> : <div/>}
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
                    onClick={() => handleCountryClick(alpha2, name, geo)}
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
              {formatUSDvalue(countryData.total_imports.value)}
            </div>
            <div className='annotate'><div className='text'>{formatUSDorder(countryData.total_imports.value)}</div></div>
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
