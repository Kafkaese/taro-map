import React, { useState } from 'react';
import ExportMap from './components/ExportMap';
import ImportMap from './components/ImportMap';
import YearSlider from './components/YearSlider';
import ToggleButton from 'react-toggle-button'

import './App.css'

const App = () => {

const [showExports, setShowExports] = useState(true) 

const toggleComponent = () => {
  setShowExports(!showExports);
};


// Displayed year
const [year, setYear] = useState(2020)
const handleYearChange = (newYear) => {
  setYear(newYear);
  console.log(year)
}

  return (
    <div className="app">
      <div className='toggle'>
        <ToggleButton 
          value={ showExports }
          onToggle={toggleComponent}
          activeLabel={"Exports"}
          inactiveLabel={'Imports'}
          className='slider'
          thumbStyle={{
            height: "100%",
            with: "100%",
            borderRadius: 5,
          }}
          trackStyle={{
            height: "100%",
            width: "100%",
            borderRadius: 5
            }}>
        </ToggleButton>
      </div>

      {showExports ? <ExportMap year={year}/> : <ImportMap year={year}/>}
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
