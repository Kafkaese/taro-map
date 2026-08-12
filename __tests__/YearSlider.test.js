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
  const { container } = render(<YearSlider onYearChange={onYearChange} />);
  const thumb = screen.getByRole('slider');
  // react-slider arms its keyboard handling on focus (attaching a
  // document-level keydown listener) then processes steps on keydown.
  fireEvent.focus(thumb);
  fireEvent.keyDown(thumb, { key: 'ArrowRight', keyCode: 39 });
  expect(onYearChange).toHaveBeenCalledWith(2021);
  // Scoped to the year badge specifically, not screen.getByText - 2021 is
  // also one of the 5-year labels under the track (see the labels test
  // below), so the plain text now matches two elements.
  expect(container.querySelector('.slider-year-info-box-element2')).toHaveTextContent('2021');
});

test('renders evenly-spaced year labels under the track, including the minimum year', () => {
  render(<YearSlider onYearChange={() => {}} />);
  expect(screen.getByText('1996')).toBeInTheDocument();
});

test('highlights the year label closest to the currently selected year', () => {
  // Default year is 2020; with 5-year labels starting at 1996 (1996, 2001,
  // ..., 2016, 2021, ...), 2021 is one year away while 2016 is four, so
  // 2021 is the closest and should be the one highlighted.
  const { container } = render(<YearSlider onYearChange={() => {}} />);
  const active = container.querySelector('.slider-year-labels .active');
  expect(active).toHaveTextContent('2021');
});
