import React from 'react';

import './Dropdown.css'

/**
 * Dropdown for selecting an option from a list. Backed by a native
 * <select> so keyboard navigation (arrow keys, type-to-select) and screen
 * reader semantics come for free instead of being reimplemented by hand.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.options - An array of option objects, each containing a 'value' and 'label'.
 * @param {Function} props.onSelect - A callback function to handle the selected option.
 * @param {Object} props.value - The currently selected option.
 */
const Dropdown = ({ options, onSelect, value }) => {
  const handleChange = (event) => {
    const selected = options.find((option) => option.value === event.target.value);
    onSelect(selected);
  };

  return (
    <select className="dropdown" value={value ? value.value : ''} onChange={handleChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
