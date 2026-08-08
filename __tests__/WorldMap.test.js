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
// swap it for a single fake, clickable/hoverable "country". FAKE_GEO is
// hoisted outside the mock components so it's the *same* object reference
// across re-renders - WorldMap.jsx compares selectedGeography === geo by
// identity, which a freshly-recreated-per-render object would never match.
jest.mock('react-simple-maps', () => {
  const FAKE_GEO = { rsmKey: 'DE', properties: { countryKey: 'DE' } };
  return {
    ComposableMap: ({ children, onMouseMove, onClick, style }) => (
      <div data-testid="composable-map" onMouseMove={onMouseMove} onClick={onClick} style={style}>
        {children}
      </div>
    ),
    ZoomableGroup: ({ children, zoom, onMoveEnd, translateExtent }) => (
      <div>
        <div data-testid="zoom-level">{zoom}</div>
        <div data-testid="translate-extent">{JSON.stringify(translateExtent)}</div>
        <button
          data-testid="move-end"
          onClick={(event) => {
            // A real drag/zoom gesture ending doesn't also fire a click on
            // the map background - only this test button's own click does,
            // as a side effect of being nested inside it in the DOM.
            event.stopPropagation();
            onMoveEnd({ coordinates: [0, 0], zoom });
          }}
        >
          end drag/zoom gesture
        </button>
        {children}
      </div>
    ),
    Geographies: ({ children }) => children({ geographies: [FAKE_GEO] }),
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
  };
});

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

test('hovering a country on a mobile device does not fetch or show the tooltip', async () => {
  // Touch devices don't have reliable hover, so it's suppressed entirely
  // rather than left glitchy - tapping still selects the country normally
  // (covered separately below), just without the cursor-following tooltip.
  const fetchMock = mockFetchJson(() => ({ value: 'Germany' }));
  renderMap({ isMobile: true });
  fireEvent.mouseOver(screen.getByTestId('geography'));
  await new Promise((resolve) => setTimeout(resolve, 0)); // let any stray microtasks flush
  // Excludes the data-availability bulk fetch, which fires on mount
  // regardless of hover (see the "aborts the previous hover fetch" test
  // below for the same exclusion).
  const hoverUrls = fetchMock.mock.calls
    .map((call) => call[0])
    .filter((url) => !url.includes('/available'));
  expect(hoverUrls).toHaveLength(0);
  expect(screen.queryByText('Germany')).not.toBeInTheDocument();
});

test('a country is still fully clickable/selectable on a mobile device', () => {
  mockFetchJson(() => ({ value: 'x' }));
  const onCountrySelect = jest.fn();
  renderMap({ isMobile: true, onCountrySelect });
  fireEvent.click(screen.getByTestId('geography'));
  expect(onCountrySelect).toHaveBeenCalledWith('DE');
});

test('clicking a country calls onCountrySelect with its country code', () => {
  mockFetchJson(() => ({ value: 'x' }));
  const onCountrySelect = jest.fn();
  renderMap({ onCountrySelect });
  fireEvent.click(screen.getByTestId('geography'));
  expect(onCountrySelect).toHaveBeenCalledWith('DE');
});

test('clicking a country dismisses its hover tooltip instead of leaving it lingering behind the sidebar', async () => {
  // Regression test: clicking doesn't itself fire onMouseLeave, so without
  // explicitly clearing hoveredCountry on click, the tooltip stayed up
  // (rendering behind the newly-opened sidebar, which sits at a higher
  // z-index) whenever the mouse hadn't actually left the country yet.
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
  expect(await screen.findByText('Germany')).toBeInTheDocument();

  fireEvent.click(geo);

  expect(screen.queryByText('Germany')).not.toBeInTheDocument();
});

test('a country missing from the availability list is greyed out', async () => {
  mockFetchJson((url) => {
    if (url.includes('/arms/imports/available')) return []; // DE has no data
    return { value: 'x' };
  });
  renderMap();
  await waitFor(() =>
    expect(screen.getByTestId('geography')).toHaveStyle({ fill: '#8B95A1' })
  );
});

test('a country present in the availability list keeps the normal color', async () => {
  mockFetchJson((url) => {
    if (url.includes('/arms/imports/available')) return ['DE'];
    return { value: 'x' };
  });
  renderMap();
  await waitFor(() =>
    expect(screen.getByTestId('geography')).toHaveStyle({ fill: '#84B098' })
  );
});

test('a greyed-out (no-data) country is still selectable and shows its hover tooltip', async () => {
  mockFetchJson((url) => {
    if (url.includes('/arms/imports/available')) return []; // DE has no data
    if (url.includes('/metadata/name/short')) return { value: 'Germany' };
    if (url.includes('/metadata/democracy_index')) return { value: 8.67 };
    if (url.includes('/arms/imports/total')) return { value: 0 };
    if (url.includes('/metadata/peace_index')) return { value: 1.5 };
    return {};
  });
  const onCountrySelect = jest.fn();
  renderMap({ onCountrySelect });

  await waitFor(() =>
    expect(screen.getByTestId('geography')).toHaveStyle({ fill: '#8B95A1' })
  );

  fireEvent.mouseOver(screen.getByTestId('geography'));
  expect(await screen.findByText('Germany')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('geography'));
  expect(onCountrySelect).toHaveBeenCalledWith('DE');
});

test('export mode fetches export availability instead of import', async () => {
  const fetchMock = mockFetchJson((url) => {
    if (url.includes('/arms/exports/available')) return ['DE'];
    return { value: 'x' };
  });
  renderMap({ mapModeImport: false });
  await waitFor(() => {
    const urls = fetchMock.mock.calls.map((call) => call[0]);
    expect(urls.some((u) => u.includes('/arms/exports/available?year=2020'))).toBe(true);
  });
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

test('onMapClick also fires when a drag/zoom gesture ends, not just on click', () => {
  const onMapClick = jest.fn();
  renderMap({ onMapClick });

  fireEvent.click(screen.getByTestId('move-end'));

  expect(onMapClick).toHaveBeenCalledTimes(1);
});

test('clicking the map background closes the sidebar by calling onCountryDeselect', () => {
  // The sidebar only renders while the parent's activeCountryData has a
  // name - WorldMap itself doesn't own that state, so closing it means
  // asking the parent to clear it via onCountryDeselect, not toggling a
  // local collapsed flag.
  const onCountryDeselect = jest.fn();
  renderMap({ activeCountryData: buildCountryData(), onCountryDeselect });

  fireEvent.click(screen.getByTestId('composable-map'));

  expect(onCountryDeselect).toHaveBeenCalledTimes(1);
});

test('clicking the sidebar close button also calls onCountryDeselect', () => {
  const onCountryDeselect = jest.fn();
  renderMap({ activeCountryData: buildCountryData(), onCountryDeselect });

  fireEvent.click(screen.getByRole('button', { name: 'Close country details' }));

  expect(onCountryDeselect).toHaveBeenCalledTimes(1);
});

test('clicking the map background un-highlights the previously selected country', () => {
  mockFetchJson(() => ({ value: 'x' }));
  renderMap();
  const geo = screen.getByTestId('geography');

  fireEvent.click(geo);
  expect(geo).toHaveStyle({ fill: '#5b9e79' }); // pressedColor - selected

  fireEvent.click(screen.getByTestId('composable-map'));
  expect(geo).toHaveStyle({ fill: '#84B098' }); // defaultColor - back to unhighlighted
});

test('clicking a country does not also trigger the background-click deselect', () => {
  mockFetchJson(() => ({ value: 'x' }));
  const onCountryDeselect = jest.fn();
  renderMap({ activeCountryData: buildCountryData(), onCountryDeselect });

  fireEvent.click(screen.getByTestId('geography'));

  expect(onCountryDeselect).not.toHaveBeenCalled();
});

test('the map cannot be dragged infinitely off the west/east edge', () => {
  // Regression test: translateExtent's X bound used to be [-Infinity,
  // Infinity], so there was no limit at all on how far you could drag west.
  renderMap();
  const extentText = screen.getByTestId('translate-extent').textContent;
  expect(extentText).not.toContain('null'); // Infinity serializes to null via JSON.stringify
  expect(JSON.parse(extentText)).toEqual([[-100, -100], [900, 600]]);
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
    // Excludes the data-availability bulk fetch (WorldMap.test.js's own
    // separate tests cover that one) - it also fires on mount and would
    // otherwise land at signals[0], shifting the tooltip fetch signal out.
    if (options.signal && !url.includes('/available')) signals.push(options.signal);
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
    if (options.signal && !url.includes('/available')) signals.push(options.signal);
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
