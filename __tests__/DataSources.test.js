/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import DataSources from '../src/components/DataSources';

test('renders without crashing', () => {
  render(<DataSources />);
  expect(screen.getByText('Data Sources')).toBeInTheDocument();
});
