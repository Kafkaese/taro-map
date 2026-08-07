/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorldMap from '../src/components/WorldMap';
import { defaultSettings, buildCountryData } from '../testUtils/fixtures';
import { mockFetchJson } from '../testUtils/mockFetch';

// react-simple-maps needs real topojson geometry to render anything; for
// these tests we only care about the fetch/state logic around the map, so
// swap it for a single fake, clickable/hoverable "country".
jest.mock('react-simple-maps', () => ({
  ComposableMap: ({ children, onMouseMove, onClick, style }) => (
    <div data-testid="composable-map" onMouseMove={onMouseMove} onClick={onClick} style={style}>
      {children}
    </div>
  ),
  ZoomableGroup: ({ children, zoom }) => (
    <div>
      <div data-testid="zoom-level">{zoom}</div>
      {children}
    </div>
  ),
  Geographies: ({ children }) =>
    children({ geographies: [{ rsmKey: 'DE', properties: { countryKey: 'DE' } }] }),
  Geography: ({ onMouseOver, onMouseLeave, onClick, onMouseMove, style }) => (
    <div
      data-testid="geography"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onMouseMove={onMouseMove}
      style={style?.default}
    />
  ),
}));

const renderMap = (overrides = {}) =>
  render(
    <WorldMap
      mapModeImport={true}
      year={2020}
      activeCountryData={{}}
      onCountrySelect={() => {}}
      settings={defaultSettings}
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

test('clicking a country calls onCountrySelect with its country code', () => {
  mockFetchJson(() => ({ value: 'x' }));
  const onCountrySelect = jest.fn();
  renderMap({ onCountrySelect });
  fireEvent.click(screen.getByTestId('geography'));
  expect(onCountrySelect).toHaveBeenCalledWith('DE');
});

test('onMapClick fires for both a country click and a background click', () => {
  mockFetchJson(() => ({ value: 'x' }));
  const onMapClick = jest.fn();
  renderMap({ onMapClick });

  fireEvent.click(screen.getByTestId('geography'));
  expect(onMapClick).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByTestId('composable-map'));
  expect(onMapClick).toHaveBeenCalledTimes(2);
});

test('clicking the map background closes (collapses) the sidebar', () => {
  renderMap({ activeCountryData: buildCountryData() });
  const panel = document.querySelector('.panel');
  expect(panel).not.toHaveStyle({ width: '0%' });

  fireEvent.click(screen.getByTestId('composable-map'));

  expect(panel).toHaveStyle({ width: '0%' });
});

test('clicking a country does not also trigger the background-click collapse', () => {
  mockFetchJson(() => ({ value: 'x' }));
  renderMap({ activeCountryData: buildCountryData() });

  fireEvent.click(screen.getByTestId('geography'));

  expect(document.querySelector('.panel')).not.toHaveStyle({ width: '0%' });
});

test('the map background has a grab cursor, and countries have a pointer cursor', () => {
  renderMap();
  expect(screen.getByTestId('composable-map')).toHaveStyle({ cursor: 'grab' });
  expect(screen.getByTestId('geography')).toHaveStyle({ cursor: 'pointer' });
});

test('the tooltip follows the current mouse position immediately, not one event behind', async () => {
  // Regression test for a stale-closure bug: the position update used to
  // read the previous render's mousePosition state instead of this event's
  // own coordinates, so the tooltip lagged one mousemove behind the cursor.
  mockFetchJson((url) => {
    if (url.includes('/metadata/name/short')) return { value: 'Germany' };
    if (url.includes('/metadata/democracy_index')) return { value: 8.67 };
    if (url.includes('/arms/imports/total')) return { value: 1500000 };
    if (url.includes('/metadata/peace_index')) return { value: 1.5 };
    return {};
  });
  renderMap();
  const geo = screen.getByTestId('geography');

  fireEvent.mouseOver(geo);
  await screen.findByText('Germany');

  fireEvent.mouseMove(geo, { clientX: 100, clientY: 200 });

  const tooltip = screen.getByText('Germany').closest('.hover-box-container');
  expect(tooltip).toHaveStyle({ left: '110px', top: '205px' });
});

test('hovering again aborts the previous hover fetch instead of letting it resolve later and overwrite the current one', async () => {
  const signals = [];
  global.fetch = jest.fn((url, options = {}) => {
    if (options.signal) signals.push(options.signal);
    return new Promise(() => {}); // never resolves - only the abort behavior is under test
  });

  renderMap();
  const geo = screen.getByTestId('geography');

  fireEvent.mouseOver(geo);
  await waitFor(() => expect(signals.length).toBeGreaterThan(0));
  const firstSignal = signals[0];
  expect(firstSignal.aborted).toBe(false);

  fireEvent.mouseOver(geo);
  await waitFor(() => expect(firstSignal.aborted).toBe(true));
});

test('leaving a country aborts its in-flight tooltip fetch', async () => {
  const signals = [];
  global.fetch = jest.fn((url, options = {}) => {
    if (options.signal) signals.push(options.signal);
    return new Promise(() => {});
  });

  renderMap();
  const geo = screen.getByTestId('geography');

  fireEvent.mouseOver(geo);
  await waitFor(() => expect(signals.length).toBeGreaterThan(0));
  expect(signals[0].aborted).toBe(false);

  fireEvent.mouseLeave(geo);
  await waitFor(() => expect(signals[0].aborted).toBe(true));
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
