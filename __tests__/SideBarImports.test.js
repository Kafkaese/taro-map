/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideBarImports from '../src/components/SideBarImports';
import { buildCountryData, defaultSettings } from '../testUtils/fixtures';

test('renders country name, total imports, and index values', () => {
  const countryData = buildCountryData();
  render(
    <SideBarImports
      countryData={countryData}
      collapsed={false}
      onCollapse={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('Germany')).toBeInTheDocument();
  expect(screen.getByText('1.50')).toBeInTheDocument(); // formatUSDvalue(1,500,000) -> millions
  expect(screen.getByText('8.67')).toBeInTheDocument(); // democracy index
  expect(screen.getByText('1.5')).toBeInTheDocument(); // peace index
});

test('clicking the collapse button toggles the sidebar', () => {
  const onCollapse = jest.fn();
  render(
    <SideBarImports
      countryData={buildCountryData()}
      collapsed={false}
      onCollapse={onCollapse}
      year={2020}
      settings={defaultSettings}
    />
  );
  fireEvent.click(screen.getByText('<'));
  expect(onCollapse).toHaveBeenCalledWith(true);
});

test('shows "No data available" when there are no import sources', () => {
  const countryData = buildCountryData({ importSources: { value: 'no data' } });
  render(
    <SideBarImports
      countryData={countryData}
      collapsed={false}
      onCollapse={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('No data available')).toBeInTheDocument();
});
