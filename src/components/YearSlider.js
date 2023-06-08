import React, { useState } from 'react';
import Slider from 'react-slider';

function YearSlider({ onChange }) {
    const [year, setYear] = useState(50);
  
    const handleChange = (newYear) => {
      setValue(newYear);
      onChange(newYear); // Call the onChange prop with the updated value
    };
  
    return (
      <div>
        <Slider
          value={value}
          min={0}
          max={100}
          onChange={handleChange}
        />
        <p>Current year: {year}</p>
      </div>
    );
  }
  
  export default MySlider;
  