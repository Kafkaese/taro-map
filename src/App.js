import React, { useState } from 'react';
import ExportMap from './components/ExportMap';
import ImportMap from './components/ImportMap';

const App = () => {

const [showExports, setShowExports] = useState(true) 

const toggleComponent = () => {
  setShowExports(!showExports);
};

  return (
    <div className="App">
      <button onClick={toggleComponent}>Toggle</button>

      {showExports ? <ExportMap /> : <ImportMap />}
   </div>
  );
};

export default App;
