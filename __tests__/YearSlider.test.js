/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import YearSlider from '../src/components/YearSlider';



jest.mock('react-slider', () => {
    const ReactSlider = ({ onChange }) => {
      const handleChange = (value) => {
        onChange(value);
      };
  
      return (
        <div>
          <input
            type="range"
            onChange={(e) => handleChange(parseInt(e.target.value))}
          />
        </div>
      );
    };
  
    return ReactSlider;
  });
  
  describe('YearSlider', () => {
    test('renders the slider component', () => {
      render(<YearSlider />);
      expect(screen.getByText('select year:')).toBeInTheDocument();
      expect(screen.getByText('2020')).toBeInTheDocument();
    });
  
    test('calls onYearChange prop when slider value changes', () => {
      const mockOnYearChange = jest.fn();
      render(<YearSlider onYearChange={mockOnYearChange} />);
      const inputRange = screen.getByRole('slider');
  
      fireEvent.change(inputRange, { target: { value: '2021' } });
  
      expect(mockOnYearChange).toHaveBeenCalledWith(2021);
    });
  });
  