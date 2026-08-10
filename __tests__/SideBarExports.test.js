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

test('renders a header above the historical export value chart', () => {
  render(
    <SideBarExports
      countryData={buildCountryData()}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('Export Value Over Time')).toBeInTheDocument();
});

test('does not show an expand button when there are 5 or fewer export destinations', () => {
  render(
    <SideBarExports
      countryData={buildCountryData()}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.queryByText(/^Show all/)).not.toBeInTheDocument();
});

test('limits the export-destinations bar plot to the top 5 by default, with an expand button to reveal the rest', () => {
  // recharts doesn't render actual bar/tick content under jsdom (no real
  // layout engine), but the height it's given -
  // visibleDestinations.length*30+20 - does survive as inline style on its
  // wrapper div, so that's what this asserts on (see the matching test in
  // SideBarImports.test.js).
  const exportSources = Array.from({ length: 8 }, (_, i) => ({
    name: `C${i}`,
    full_name: `Country ${i}`,
    value: 1000 - i,
  }));
  const countryData = buildCountryData({ exportSources });
  const { container } = render(
    <SideBarExports
      countryData={countryData}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );

  const chartContainer = () => container.querySelector('.barPlot .recharts-responsive-container');
  expect(chartContainer()).toHaveStyle({ height: '170px' }); // 5*30+20

  const expandButton = screen.getByRole('button', { name: 'Show all 8' });
  fireEvent.click(expandButton);

  expect(chartContainer()).toHaveStyle({ height: '260px' }); // 8*30+20
  expect(screen.getByRole('button', { name: 'Show top 5' })).toBeInTheDocument();
});
