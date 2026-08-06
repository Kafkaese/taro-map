/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideBarExports from '../src/components/SideBarExports';
import { buildCountryData, defaultSettings } from '../testUtils/fixtures';

test('renders country name, total exports, and the export percentage circle', () => {
  const countryData = buildCountryData();
  render(
    <SideBarExports
      countryData={countryData}
      collapsed={false}
      onCollapse={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('Germany')).toBeInTheDocument();
  expect(screen.getByText('800.00')).toBeInTheDocument(); // formatUSDvalue(800,000) -> thousands
  expect(screen.getByText('<1%')).toBeInTheDocument(); // arms exports are a tiny share of merch exports in the fixture
});

test('clicking the collapse button toggles the sidebar', () => {
  const onCollapse = jest.fn();
  render(
    <SideBarExports
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

test('shows "No data available" when there are no export destinations', () => {
  const countryData = buildCountryData({ exportSources: { value: 'no data' } });
  render(
    <SideBarExports
      countryData={countryData}
      collapsed={false}
      onCollapse={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('No data available')).toBeInTheDocument();
});
