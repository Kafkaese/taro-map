/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../src/App';

// WorldMap is unit-tested separately (see WorldMap.test.js) and needs real
// map geometry to render; here we only care about App's own state wiring,
// so replace it with a stub that echoes the props it was given, plus a
// button to trigger onCountrySelect the same way a real country click would.
// A real country click fires both onCountrySelect and onMapClick (see
// WorldMap.jsx's handleCountryClick) - the mock buttons below replicate
// that pairing so App-level tests see the same composition production does.
jest.mock('../src/components/WorldMap', () => (props) => (
  <div data-testid="world-map">
    {JSON.stringify({
      mapModeImport: props.mapModeImport,
      year: props.year,
      hasCountryData: typeof props.activeCountryData.name !== 'undefined',
      isMobile: props.isMobile,
    })}
    <button
      onClick={() => {
        props.onCountrySelect('DE');
        props.onMapClick();
      }}
    >
      select-country
    </button>
    <button
      onClick={() => {
        props.onCountrySelect('FR');
        props.onMapClick();
      }}
    >
      select-other-country
    </button>
    <button onClick={() => props.onMapClick()}>click-map-background</button>
    <button onClick={() => props.onCountryDeselect()}>deselect-country</button>
  </div>
));

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
});

afterEach(() => {
  delete document.documentElement.ontouchstart;
  // Restores jsdom's own default userAgent getter, undoing the
  // Object.defineProperty override the mobile-user-agent test below uses -
  // without this it leaks into every later test in this file (userAgent is
  // an own-property override on the shared jsdom window/navigator, not
  // reset between individual tests, only between files). This went
  // unnoticed under Jest 27's older bundled jsdom, where
  // 'ontouchstart' in document.documentElement was false by default and
  // masked the leak by itself making isMobile false regardless; the jsdom
  // bundled with Jest 30 exposes ontouchstart unconditionally, so the
  // leaked user agent alone was enough to flip isMobile back to true.
  delete window.navigator.userAgent;
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

test('renders the header and defaults to import mode', () => {
  render(<App />);
  expect(screen.getByText('Arms-Tracker')).toBeInTheDocument();
  expect(screen.getByTestId('world-map').textContent).toContain('"mapModeImport":true');
});

test('shows the "click a country" hint until the user clicks anywhere on the map', () => {
  render(<App />);
  const hint = /Click on Country for more Details/;
  expect(screen.getByText(hint)).toBeInTheDocument();

  fireEvent.click(screen.getByText('click-map-background'));

  expect(screen.queryByText(hint)).not.toBeInTheDocument();
});

test('the "click a country" hint also disappears once a country is actually selected', () => {
  render(<App />);
  fireEvent.click(screen.getByText('select-country'));
  expect(screen.queryByText(/Click on Country for more Details/)).not.toBeInTheDocument();
});

test('toggling Imports/Exports flips the mode passed down to the map', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Exports'));
  expect(screen.getByTestId('world-map').textContent).toContain('"mapModeImport":false');
});

test('changing the year slider updates the year passed down to the map', () => {
  render(<App />);
  const thumb = screen.getByRole('slider');
  fireEvent.focus(thumb);
  fireEvent.keyDown(thumb, { key: 'ArrowRight', keyCode: 39 });
  expect(screen.getByTestId('world-map').textContent).toContain('"year":2021');
});

test('the settings gear toggles the currency settings panel', () => {
  render(<App />);
  expect(screen.queryByText('Currency:')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  expect(screen.getByText('Currency:')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  expect(screen.queryByText('Currency:')).not.toBeInTheDocument();
});

test('defaults to system color mode, which sets no explicit data-theme override', () => {
  render(<App />);
  expect(document.documentElement.getAttribute('data-theme')).toBeNull();
});

test('choosing a color mode in Settings stamps data-theme on <html> and persists it', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));

  fireEvent.change(screen.getByRole('combobox', { name: 'Theme' }), { target: { value: 'light' } });
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  expect(localStorage.getItem('colorMode')).toBe('light');

  fireEvent.change(screen.getByRole('combobox', { name: 'Theme' }), { target: { value: 'dark' } });
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('colorMode')).toBe('dark');

  // Back to 'system' removes the override entirely rather than setting
  // data-theme="system" (which App.css's selectors don't know about) -
  // the @media (prefers-color-scheme) rules take over again from here.
  fireEvent.change(screen.getByRole('combobox', { name: 'Theme' }), { target: { value: 'system' } });
  expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  expect(localStorage.getItem('colorMode')).toBe('system');
});

test('a previously saved color mode is restored on the next visit', () => {
  localStorage.setItem('colorMode', 'dark');
  render(<App />);
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('clicking Data Sources in the footer opens the Data Sources popup', () => {
  render(<App />);
  expect(screen.queryByRole('heading', { name: 'Data Sources' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Data Sources'));
  expect(screen.getByRole('heading', { name: 'Data Sources' })).toBeInTheDocument();
});

test('clicking Impressum in the footer opens the Impressum popup', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Impressum'));
  expect(screen.getByRole('heading', { name: 'Impressum' })).toBeInTheDocument();
});

test('selecting a country issues exactly one batch of 9 fetches, concurrently', async () => {
  // Regression test for two bugs: (1) each fetch used to be awaited before
  // starting the next, serializing 9 round-trips instead of firing them
  // together, and (2) the fetch batch used to fire *twice* per click (once
  // from the direct call, once from an effect reacting to the resulting
  // state change) - so this asserts exactly 9, not just "at least 9".
  const pending = [];
  global.fetch = jest.fn(
    () =>
      new Promise((resolve) => {
        pending.push(() => resolve({ ok: true, json: () => Promise.resolve({}) }));
      })
  );

  render(<App />);
  fireEvent.click(screen.getByText('select-country'));

  // If the fetches were still sequential, only the first would ever be
  // issued, since execution would block on it forever (none of these
  // promises resolve).
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(9));

  await act(async () => {
    pending.forEach((resolve) => resolve());
  });
});

test('changing the year while a country is selected refetches its data for the new year', async () => {
  const fetchMock = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  global.fetch = fetchMock;

  render(<App />);
  fireEvent.click(screen.getByText('select-country'));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(9));

  const thumb = screen.getByRole('slider');
  fireEvent.focus(thumb);
  fireEvent.keyDown(thumb, { key: 'ArrowRight', keyCode: 39 });

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(18));
  const urls = fetchMock.mock.calls.map((call) => call[0]);
  expect(urls.filter((u) => u.includes('year=2021')).length).toBeGreaterThan(0);
});

test('selecting a new country aborts the in-flight fetch for the previous one', async () => {
  const signals = [];
  global.fetch = jest.fn((url, options = {}) => {
    if (options.signal) signals.push(options.signal);
    return new Promise(() => {}); // never resolves - only the abort behavior is under test
  });

  render(<App />);
  fireEvent.click(screen.getByText('select-country'));
  await waitFor(() => expect(signals.length).toBeGreaterThan(0));
  const firstSignal = signals[0];
  expect(firstSignal.aborted).toBe(false);

  fireEvent.click(screen.getByText('select-other-country'));
  await waitFor(() => expect(firstSignal.aborted).toBe(true));
});

test('shows a loading indicator while country data is being fetched, then hides it', async () => {
  const pending = [];
  global.fetch = jest.fn(
    () =>
      new Promise((resolve) => {
        pending.push(() => resolve({ ok: true, json: () => Promise.resolve({}) }));
      })
  );

  render(<App />);
  fireEvent.click(screen.getByText('select-country'));

  expect(await screen.findByText('Loading country data…')).toBeInTheDocument();

  await waitFor(() => expect(pending.length).toBe(9));
  await act(async () => {
    pending.forEach((resolve) => resolve());
  });

  await waitFor(() =>
    expect(screen.queryByText('Loading country data…')).not.toBeInTheDocument()
  );
});

test('shows an error message if fetching country data fails, instead of failing silently', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
  );

  render(<App />);
  fireEvent.click(screen.getByText('select-country'));

  expect(
    await screen.findByText('Could not load data for this country. Please try again.')
  ).toBeInTheDocument();
  expect(screen.queryByText('Loading country data…')).not.toBeInTheDocument();
});

test('deselecting a country clears activeCountryData, hiding the sidebar', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ value: 'x' }) })
  );

  render(<App />);
  fireEvent.click(screen.getByText('select-country'));
  await waitFor(() =>
    expect(screen.getByTestId('world-map').textContent).toContain('"hasCountryData":true')
  );

  fireEvent.click(screen.getByText('deselect-country'));

  expect(screen.getByTestId('world-map').textContent).toContain('"hasCountryData":false');
});

test('passes isMobile down to the map for touch devices with a mobile user agent', () => {
  document.documentElement.ontouchstart = null;
  Object.defineProperty(window.navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS) Mobi/15E148',
    configurable: true,
  });
  render(<App />);
  expect(screen.getByTestId('world-map').textContent).toContain('"isMobile":true');
});

test('isMobile is false on a regular desktop browser', () => {
  render(<App />);
  expect(screen.getByTestId('world-map').textContent).toContain('"isMobile":false');
});
