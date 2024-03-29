import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './YearSlider.css';

/**
 * Year Slider component for for changing the yer of the displayed data. Contains a slider and shows the 
 * currently selected year.
 * 
 * @param {function} onYearChange Function to be called when the year is changed via the slider by the user.
 * 
 */
const YearSlider = ({ onYearChange }) => {
    const [year, setYear] = useState(2020);
  
    const handleChange = (newYear, index) => {
      setYear(newYear);
      onYearChange(newYear)
      // Call the onChange prop with the updated value
    };
  
    return (
      <div className='slider-container'>
        <div className='slider-year-info-box'>
          <div className='slider-year-info-box-element1'>select year: </div>
          <div className='slider-year-info-box-element2'>{year}</div>  
        </div>
        <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            //marks={[1996, 2001, 2006, 2011, 2016, 2021]}
            markClassName="example-mark"
            trackClassName="example-track"
            defaultValue={2020}
            max={2022}
            min={1996}
            onChange={handleChange}
        />
      </div>
    );
  }
  
  export default YearSlider;
  