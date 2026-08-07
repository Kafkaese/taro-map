/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorldMap from '../src/components/WorldMap';
import { defaultSettings } from '../testUtils/fixtures';
import { mockFetchJson } from '../testUtils/mockFetch';

// react-simple-maps needs real topojson geometry to render anything; for
// these tests we only care about the fetch/state logic around the map, so
// swap it for a single fake, clickable/hoverable "country".
jest.mock('react-simple-maps', () => ({
  ComposableMap: ({ children, onMouseMove }) => <div onMouseMove={onMouseMove}>{children}</div>,
  ZoomableGroup: ({ children, zoom }) => (
    <div>
      <div data-testid="zoom-level">{zoom}</div>
      {children}
    </div>
  ),
  Geographies: ({ children }) =>
    children({ geographies: [{ rsmKey: 'DE', properties: { countryKey: 'DE' } }] }),
  Geography: ({ onMouseOver, onMouseLeave, onClick, onMouseMove }) => (
    <div
      data-testid="geography"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onMouseMove={onMouseMove}
    />
  ),
}));

const renderMap = (overrides = {}) =>
  render(
    <WorldMap
      mapModeImport={true}
      year={2020}
      activeCountryData={{}}
      updateActiveCountry={() => {}}
      settings={defaultSettings}
      API_HOST="api.example.com"
      API_PORT="443"
      {...overrides}
    />
  );

test('hovering a country in import mode requests the import endpoints for that country/year/currency', async () => {
  const fetchMock = mockFetchJson((url) => {
    if (url.includes('/metadata/name/short')) return { value: 'Germany' };
    if (url.includes('/metadata/democracy_index')) return { value: 8.67 };
    if (url.includes('/arms/imports/total')) return { value: 1500000 };
    if (url.includes('/metadata/peace_index')) return { value: 1.5 };
    return {};
  });
  renderMap();
  fireEvent.mouseOver(screen.getByTestId('geography'));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  const urls = fetchMock.mock.calls.map((call) => call[0]);
  expect(
    urls.some((u) => u.includes('/arms/imports/total?country_code=DE&year=2020&currency=USD'))
  ).toBe(true);
  expect(await screen.findByText('Germany')).toBeInTheDocument();
});

test('hovering a country in export mode requests the export endpoints for that country/year', async () => {
  const fetchMock = mockFetchJson((url) => {
    if (url.includes('/metadata/name/short')) return { value: 'Germany' };
    if (url.includes('/arms/exports/total')) return { value: 800000 };
    if (url.includes('/merchandise/exports/total')) return { value: 50000000 };
    return {};
  });
  renderMap({ mapModeImport: false });
  fireEvent.mouseOver(screen.getByTestId('geography'));
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  const urls = fetchMock.mock.calls.map((call) => call[0]);
  // Regression test for a bug where this path sent settings.currency (the
  // whole {value, label, symbol} object) instead of settings.currency.value.
  expect(
    urls.some((u) => u.includes('/arms/exports/total?country_code=DE&year=2020&currency=USD'))
  ).toBe(true);
  expect(
    urls.some((u) => u.includes('/merchandise/exports/total?country_code=DE&year=2020&currency=USD'))
  ).toBe(true);
});

test('clicking a country calls updateActiveCountry with its country code', () => {
  mockFetchJson(() => ({ value: 'x' }));
  const updateActiveCountry = jest.fn();
  renderMap({ updateActiveCountry });
  fireEvent.click(screen.getByTestId('geography'));
  expect(updateActiveCountry).toHaveBeenCalledWith('DE');
});

test('zoom in is clamped so it stabilizes once it reaches the max', () => {
  renderMap();
  const zoomIn = screen.getByText('+');
  for (let i = 0; i < 15; i += 1) fireEvent.click(zoomIn);
  const stable = screen.getByTestId('zoom-level').textContent;
  fireEvent.click(zoomIn);
  expect(screen.getByTestId('zoom-level').textContent).toBe(stable);
  expect(Number(stable)).toBeGreaterThanOrEqual(4);
});

test('zoom out never goes below the initial zoom level of 1', () => {
  renderMap();
  fireEvent.click(screen.getByText('-'));
  expect(screen.getByTestId('zoom-level').textContent).toBe('1');
});
