/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideBarExports from '../src/components/SideBarExports';
import { buildCountryData, defaultSettings } from '../testUtils/fixtures';

test('renders country name and total exports', () => {
  const countryData = buildCountryData();
  render(
    <SideBarExports
      countryData={countryData}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('Germany')).toBeInTheDocument();
  expect(screen.getByText('800.00')).toBeInTheDocument(); // formatUSDvalue(800,000) -> thousands
});

test('clicking the close button calls onClose', () => {
  const onClose = jest.fn();
  render(
    <SideBarExports
      countryData={buildCountryData()}
      onClose={onClose}
      year={2020}
      settings={defaultSettings}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Close country details' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('shows "No data available" when there are no export destinations', () => {
  const countryData = buildCountryData({ exportSources: { value: 'no data' } });
  render(
    <SideBarExports
      countryData={countryData}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('No data available')).toBeInTheDocument();
});
