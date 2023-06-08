import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './YearSlider.css';

const YearSlider = ({ onChange }) => {
    const [year, setYear] = useState(50);
  
    const handleChange = (newYear) => {
      setYear(newYear);
      onChange(newYear); // Call the onChange prop with the updated value
    };
  
    return (
      <div>
        <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
        />
        <p>Current year: {year}</p>
      </div>
    );
  }
  
  export default YearSlider;
  