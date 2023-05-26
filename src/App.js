import React, { useState } from 'react';
import ExportMap from './components/ExportMap';
import ImportMap from './components/ImportMap';

import './App.css'

const App = () => {

const [showExports, setShowExports] = useState(true) 

const toggleComponent = () => {
  setShowExports(!showExports);
};

  return (
    <div className="App">
      <button onClick={toggleComponent}>Toggle</button>

      {showExports ? <ExportMap /> : <ImportMap />}

      <div className='footer'>Info goes here</div>
   </div>
  );
};

export default App;
