/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from '../src/components/Dropdown';

const options = [
  { value: 'USD', label: 'US Dollar' },
  { value: 'EUR', label: 'Euro' },
];

test('shows a placeholder when no default value is given', () => {
  render(<Dropdown options={options} onSelect={() => {}} />);
  expect(screen.getByText('Select language')).toBeInTheDocument();
});

test('shows the default value label when provided', () => {
  render(<Dropdown options={options} onSelect={() => {}} defaultValue={options[0]} />);
  expect(screen.getByText('US Dollar')).toBeInTheDocument();
});

test('opens on click and lists all options', () => {
  render(<Dropdown options={options} onSelect={() => {}} />);
  fireEvent.click(screen.getByText('Select language'));
  expect(screen.getByText('Euro')).toBeInTheDocument();
});

test('selecting an option calls onSelect and closes the list', () => {
  const onSelect = jest.fn();
  render(<Dropdown options={options} onSelect={onSelect} />);
  fireEvent.click(screen.getByText('Select language'));
  fireEvent.click(screen.getByText('Euro'));
  expect(onSelect).toHaveBeenCalledWith(options[1]);
  expect(screen.queryByText('US Dollar')).not.toBeInTheDocument();
});
