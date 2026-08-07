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

test('lists every option', () => {
  render(<Dropdown options={options} onSelect={() => {}} />);
  expect(screen.getByRole('option', { name: 'US Dollar' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Euro' })).toBeInTheDocument();
});

test('reflects the currently selected value', () => {
  render(<Dropdown options={options} onSelect={() => {}} value={options[1]} />);
  expect(screen.getByRole('combobox')).toHaveValue('EUR');
});

test('selecting a different option calls onSelect with it', () => {
  const onSelect = jest.fn();
  render(<Dropdown options={options} onSelect={onSelect} value={options[0]} />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'EUR' } });
  expect(onSelect).toHaveBeenCalledWith(options[1]);
});

test('is a real <select>, so it is reachable and operable by keyboard', () => {
  render(<Dropdown options={options} onSelect={() => {}} value={options[0]} />);
  expect(screen.getByRole('combobox').tagName).toBe('SELECT');
});
