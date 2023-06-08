import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './YearSlider.css';

const YearSlider = ({ onChange }) => {
    const [year, setYear] = useState(2022);
  
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
            marks={[1996, 2001, 2006, 2011, 2016, 2021]}
            markClassName="example-mark"
            trackClassName="example-track"
            defaultValue={2022}
            max={2022}
            min={1996}
            onChange={handleChange}
        />
      </div>
    );
  }
  
  export default YearSlider;
  