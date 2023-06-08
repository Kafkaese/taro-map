import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './YearSlider.css';

const YearSlider = ({ onChange }) => {
    const [year, setYear] = useState(50);
  
    const handleChange = (newYear, index) => {
      setYear(newYear);
      // Call the onChange prop with the updated value
    };
  
    return (
      <div>
        <p>Current year: {year}</p>
        <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            max={2022}
            min={1996}
            onChange={handleChange}
        />
      </div>
    );
  }
  
  export default YearSlider;
  