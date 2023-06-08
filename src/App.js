import React, { useState } from 'react';
import ExportMap from './components/ExportMap';
import ImportMap from './components/ImportMap';
import YearSlider from './components/YearSlider';

import './App.css'

const App = () => {

const [showExports, setShowExports] = useState(true) 

const toggleComponent = () => {
  setShowExports(!showExports);
};


// Displayed year
const [year, setYear] = useState(2022)
const handleYearChange = (newYear) => {
  setYear(newYear);
  console.log(year)
}

  return (
    <div className="App">
      <button onClick={toggleComponent}>Toggle</button>
      
      {showExports ? <ExportMap /> : <ImportMap year={year}/>}
      <YearSlider onYearChange={handleYearChange}></YearSlider>
      <div className='footer'>
      <span>[1]<a href='https://www.eiu.com/n/campaigns/democracy-index-2022/?utm_source=google&utm_medium=paid-search&utm_campaign=democracy-index-2022&gclid=CjwKCAjwscGjBhAXEiwAswQqNCehS0oTsWPWJxsIzvWrjv1LLuuN1smbXTqRXXEMllm3gkV0glNrYBoCg28QAvD_BwE'>Economist Intelligence Unit: Democracy Index Report 2022</a></span>
      <span>[2]<a href='https://www.visionofhumanity.org/'>Visions of Humanity: Global Peace Index</a></span>
      </div>
   </div>
  );
};

export default App;
