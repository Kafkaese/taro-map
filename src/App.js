import React, { useState } from 'react';
import ExportMap from './components/ExportMap';
import ImportMap from './components/ImportMap';
import YearSlider from './components/YearSlider';
import ToggleButton from './components/ToggleButton';

import './App.css'

const App = () => {

  const [showExports, setShowExports] = useState(false) 

  const toggleComponent = (leftActive) => {
    
    leftActive ? setShowExports(false) : setShowExports(true);
  };


  // Displayed year
  const [year, setYear] = useState(2020)
  const handleYearChange = (newYear) => {
    setYear(newYear);
  }

  // Zoom
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.2); // Increase the zoom level
  };
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 1.2); // Decrease the zoom level
  };


  return (
    <div className="app">
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

      {showExports ? <ExportMap className='map' year={year} zoom={zoom}/> : <ImportMap className='map' year={year} zoom={zoom}/>}
      
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
