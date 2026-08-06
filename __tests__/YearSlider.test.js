/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import YearSlider from '../src/components/YearSlider';

test('renders the default year 2020', () => {
  render(<YearSlider onYearChange={() => {}} />);
  expect(screen.getByText('2020')).toBeInTheDocument();
});

test('pressing the right arrow key on the thumb advances the year and notifies the parent', () => {
  const onYearChange = jest.fn();
  render(<YearSlider onYearChange={onYearChange} />);
  const thumb = screen.getByRole('slider');
  // react-slider arms its keyboard handling on focus (attaching a
  // document-level keydown listener), than processes steps on keydown.
  fireEvent.focus(thumb);
  fireEvent.keyDown(thumb, { key: 'ArrowRight', keyCode: 39 });
  expect(onYearChange).toHaveBeenCalledWith(2021);
  expect(screen.getByText('2021')).toBeInTheDocument();
});
