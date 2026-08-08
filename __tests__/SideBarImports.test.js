/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideBarImports from '../src/components/SideBarImports';
import { buildCountryData, buildConflict, defaultSettings } from '../testUtils/fixtures';

test('renders country name, total imports, and index values', () => {
  const countryData = buildCountryData();
  render(
    <SideBarImports
      countryData={countryData}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('Germany')).toBeInTheDocument();
  expect(screen.getByText('1.50')).toBeInTheDocument(); // formatUSDvalue(1,500,000) -> millions
  expect(screen.getByText('8.67')).toBeInTheDocument(); // democracy index
  expect(screen.getByText('1.5')).toBeInTheDocument(); // peace index
});

test('clicking the close button calls onClose', () => {
  const onClose = jest.fn();
  render(
    <SideBarImports
      countryData={buildCountryData()}
      onClose={onClose}
      year={2020}
      settings={defaultSettings}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Close country details' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('shows "No data available" when there are no import sources', () => {
  const countryData = buildCountryData({ importSources: { value: 'no data' } });
  render(
    <SideBarImports
      countryData={countryData}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('No data available')).toBeInTheDocument();
});

test('does not render the Ongoing Conflicts section when the country has no conflicts', () => {
  render(
    <SideBarImports
      countryData={buildCountryData()}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.queryByText('Ongoing Conflicts')).not.toBeInTheDocument();
});

test('renders the Ongoing Conflicts section when the country is a belligerent in at least one conflict', () => {
  const countryData = buildCountryData({ conflicts: [buildConflict()] });
  render(
    <SideBarImports
      countryData={countryData}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('Ongoing Conflicts')).toBeInTheDocument();
  expect(screen.getByText('Sudanese civil wars')).toBeInTheDocument();
});

test('renders a header above the historical import value chart', () => {
  render(
    <SideBarImports
      countryData={buildCountryData()}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('Import Value Over Time')).toBeInTheDocument();
});

test('gives the historical import value chart an explicit height', () => {
  // Regression test: this chart's ResponsiveContainer used to have no
  // height prop at all, relying on .timeSeries' CSS (min-height: 35%) to
  // give it one - percentage-height-inside-flexbox is inconsistently
  // resolved across browsers, and once .timeSeries moved inside the new
  // .scrollable-content wrapper, that chain silently resolved to 0 and the
  // chart stopped rendering entirely. An explicit height prop sidesteps
  // that CSS resolution entirely, matching how the bar plot already sizes
  // itself.
  const { container } = render(
    <SideBarImports
      countryData={buildCountryData()}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  const chartContainer = container.querySelector('.timeSeries .recharts-responsive-container');
  expect(chartContainer).toHaveStyle({ height: '200px' });
});

test('does not show an expand button when there are 5 or fewer import sources', () => {
  render(
    <SideBarImports
      countryData={buildCountryData()}
      onClose={() => {}}
      year={2020}
      settings={defaultSettings}
    />
  );
  expect(screen.queryByText(/^Show all/)).not.toBeInTheDocument();
});

test('limits the import-sources bar plot to the top 5 by default, with an expand button to reveal the rest', () => {
  // recharts doesn't render actual bar/tick content under jsdom (no real
  // layout engine, ResponsiveContainer's measured size collapses to 0x0),
  // but the height it's given - visibleSources.length*30+20 - does survive
  // as inline style on its wrapper div, so that's what this asserts on
  // rather than counting rendered bars directly.
  const importSources = Array.from({ length: 8 }, (_, i) => ({
    name: `C${i}`,
    full_name: `Country ${i}`,
    value: 1000 - i,
  }));
  const countryData = buildCountryData({ importSources });
  const { container } = render(
    <SideBarImports
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
