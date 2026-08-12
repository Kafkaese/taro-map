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
const currentYear = new Date().getFullYear();
const MIN_YEAR = 1996;

// Evenly-spaced 5-year labels under the track, always including the exact
// max (currentYear) even when it doesn't land on a clean 5-year step from
// MIN_YEAR - keeps this correct as currentYear advances, unlike the
// hardcoded [1996, 2001, 2006, 2011, 2016, 2021] list this replaces.
const yearLabels = [];
for (let y = MIN_YEAR; y < currentYear; y += 5) {
    yearLabels.push(y);
}
yearLabels.push(currentYear);

const YearSlider = ({ onYearChange }) => {
    const [year, setYear] = useState(2020);

    const handleChange = (newYear, index) => {
      setYear(newYear);
      onYearChange(newYear)
      // Call the onChange prop with the updated value
    };

    // Highlights whichever label is numerically closest to the selected
    // year, rather than requiring an exact match - the labels are fixed
    // 5-year steps but the slider itself is continuous, so the two only
    // land on the same value one year in five.
    const activeLabel = yearLabels.reduce((closest, label) =>
        Math.abs(label - year) < Math.abs(closest - year) ? label : closest
    );

    return (
      <div className='slider-container'>
        <div className='slider-year-info-box'>
          <div className='slider-year-info-box-element1'>select year: </div>
          <div className='slider-year-info-box-element2'>{year}</div>
        </div>
        <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            defaultValue={2020}
            max={currentYear}
            min={MIN_YEAR}
            onChange={handleChange}
        />
        <div className="slider-year-labels">
          {yearLabels.map((label) => (
            <span key={label} className={label === activeLabel ? 'active' : undefined}>{label}</span>
          ))}
        </div>
      </div>
    );
  }

  export default YearSlider;
