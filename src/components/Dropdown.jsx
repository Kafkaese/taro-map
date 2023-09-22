import React, { useState } from 'react';

import './Dropdown.css'

/**
 * Dropdown component for selecting an option from a list.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.options - An array of option objects, each containing a 'value' and 'label'.
 * @param {Function} props.onSelect - A callback function to handle the selected option.
 */
const Dropdown = ({ options, onSelect, defaultValue}) => {
  // State to manage the selected option and dropdown open/close state.
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown open/close state.
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle the selection of an option and close the dropdown.
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedOption ? selectedOption.label : 'Select language'}
        <i className={`arrow ${isOpen ? 'up' : 'down'}`}></i>
      </div>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <li
              key={option.value}
              className="dropdown-option"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
