/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Impressum from '../src/components/Impressum';

test('renders without crashing', () => {
  render(<Impressum />);
  expect(screen.getByText('Impressum')).toBeInTheDocument();
});
