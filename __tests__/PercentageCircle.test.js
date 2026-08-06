/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PercentageCircle from '../src/components/PercentageCircle';

test('shows the rounded percentage', () => {
  render(<PercentageCircle percentage={42.4} />);
  expect(screen.getByText('42%')).toBeInTheDocument();
});

test('shows "<1%" for values that round to 0 but are greater than 0', () => {
  render(<PercentageCircle percentage={0.3} />);
  expect(screen.getByText('<1%')).toBeInTheDocument();
});

test('shows "?%" for NaN', () => {
  render(<PercentageCircle percentage={NaN} />);
  expect(screen.getByText('?%')).toBeInTheDocument();
});

test('shows "?%" for Infinity', () => {
  render(<PercentageCircle percentage={Infinity} />);
  expect(screen.getByText('?%')).toBeInTheDocument();
});
