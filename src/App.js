import React, { useState, useEffect } from 'react';
import ExportMap from './components/ExportMap';
import ImportMap from './components/ImportMap';
import YearSlider from './components/YearSlider';
import ToggleButton from './components/ToggleButton';

import './App.css'

const App = () => {

  // API url 
  const HOST = 'localhost'
  const API_PORT = '8080'

  // Controls which map is shown
  const [showExports, setShowExports] = useState(false) 

  // Sets map active based on state of the button
  const toggleComponent = (leftActive) => {
    leftActive ? setShowExports(false) : setShowExports(true);
  };
  
  // Displayed year
  const [year, setYear] = useState(2020)
  const handleYearChange = (newYear) => {
    setYear(() => newYear);
  }

  // Zoom
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.2); // Increase the zoom level
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 1.2); // Decrease the zoom level
  };



  
  // Data for sidebar
  const [activeCountryData, setActiveCountryData] = useState({});

  // Needs to be tracked here for updating activeCountryData on year change
  const [activeCountryAlpha2, setActiveCountryAlpha2] = useState('')
  
  // Effect to update country on year change only once the state has actually been updated
  useEffect( () => {
    updateActiveCountry(activeCountryAlpha2)
  }, [year])

  const updateActiveCountry = async (alpha2) => {
    try {

      setActiveCountryAlpha2(alpha2)

      const name = await fetch(`http://${HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`)
      const democracyIndex = await fetch(`http://${HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`);
      const totalImports = await fetch(`http://${HOST}:${API_PORT}/imports/year?country_code=${alpha2}&year=${year}`);
      const peaceIndex = await fetch(`http://${HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`);
      const importSources = await fetch(`http://${HOST}:${API_PORT}/imports/arms/year_all?country_code=${alpha2}&year=${year}&limit=${5}`)
      const importTimeSeries = await fetch(`http://${HOST}:${API_PORT}/imports/arms/timeseries?country_code=${alpha2}`)
      const totalExports = await fetch(`http://${HOST}:${API_PORT}/exports/arms/year?country_code=${alpha2}&year=${year}`); 
      const exportSources = await fetch(`http://${HOST}:${API_PORT}/exports/arms/year_all?country_code=${alpha2}&year=${year}&limit=${5}`)
      const exportTimeSeries = await fetch(`http://${HOST}:${API_PORT}/exports/arms/timeseries?country_code=${alpha2}`)
      const merchExports = await fetch(`http://${HOST}:${API_PORT}/exports/merchandise/year?country_code=${alpha2}&year=${year}`)

      const nameData = await name.json();
      const democracyIndexData = await democracyIndex.json();
      const peaceIndexData = await peaceIndex.json();
      const totalImportsData = await totalImports.json();
      const importSourcesData = await importSources.json()
      const importTimeSeriesData = await importTimeSeries.json()
      const totalExportsData = await totalExports.json();
      const exportSourcesData = await exportSources.json()
      const exportTimeSeriesData = await exportTimeSeries.json()
      const merchExportData = await merchExports.json()

      // update object with new data
      setActiveCountryData({ 
        name: nameData, 
        democracyIndex: democracyIndexData,
        peaceIndex: peaceIndexData,
        totalImports: totalImportsData,
        importSources: importSourcesData,
        importTimeSeries: importTimeSeriesData,
        totalExports: totalExportsData,
        exportSources: exportSourcesData,
        exportTimeSeries: exportTimeSeriesData,
        merchExports: merchExportData
      });
        

    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }

  return (
    <div className="app" >
      <style jsx="true" global="true">{`
        body {
          margin: 0px;
          padding: 0px;
        }
      `}
      </style>
      <div className='header'>
      <img className='logo' src="/favicon.png" alt="Taro"></img>
        <div className='title'>Arms-Tracker</div>
      </div>
      <div className='toggle'>
        <ToggleButton left={"Imports"} right={"Exports"} onToggleChange={toggleComponent}/> 
      </div>

      <div className='zoom'>
        <button className='button' onClick={handleZoomIn}>+</button>
        <button className='button' onClick={handleZoomOut}>-</button>
      </div>

      {showExports ? <ExportMap className='map' year={year} zoom={zoom} activeCountryData={activeCountryData} updateActiveCountry={updateActiveCountry}/> : <ImportMap className='map' year={year} zoom={zoom} activeCountryData={activeCountryData} updateActiveCountry={updateActiveCountry}/>}
      
      <div className='slider-container'>
        <YearSlider onYearChange={handleYearChange}></YearSlider>
      </div>
      
      <div className='footer'>
        <span>[1]<a href='https://www.eiu.com/n/campaigns/democracy-index-2022/?utm_source=google&utm_medium=paid-search&utm_campaign=democracy-index-2022&gclid=CjwKCAjwscGjBhAXEiwAswQqNCehS0oTsWPWJxsIzvWrjv1LLuuN1smbXTqRXXEMllm3gkV0glNrYBoCg28QAvD_BwE'>Economist Intelligence Unit: Democracy Index Report 2022</a></span>
        <span>[2]<a href='https://www.visionofhumanity.org/'>Visions of Humanity: Global Peace Index</a></span>
      </div>
   </div>
  );
};

export default App;
