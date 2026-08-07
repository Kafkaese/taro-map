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
jest.mock('../src/components/WorldMap', () => (props) => (
  <div data-testid="world-map">
    {JSON.stringify({ mapModeImport: props.mapModeImport, year: props.year })}
    <button onClick={() => props.onCountrySelect('DE')}>select-country</button>
  </div>
));

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
});

afterEach(() => {
  delete document.documentElement.ontouchstart;
});

test('renders the header and defaults to import mode', () => {
  render(<App />);
  expect(screen.getByText('Arms-Tracker')).toBeInTheDocument();
  expect(screen.getByTestId('world-map').textContent).toContain('"mapModeImport":true');
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

test('selecting a country issues exactly one batch of 10 fetches, concurrently', async () => {
  // Regression test for two bugs: (1) each fetch used to be awaited before
  // starting the next, serializing 10 round-trips instead of firing them
  // together, and (2) the fetch batch used to fire *twice* per click (once
  // from the direct call, once from an effect reacting to the resulting
  // state change) - so this asserts exactly 10, not just "at least 10".
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
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(10));

  await act(async () => {
    pending.forEach((resolve) => resolve());
  });
});

test('changing the year while a country is selected refetches its data for the new year', async () => {
  const fetchMock = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  global.fetch = fetchMock;

  render(<App />);
  fireEvent.click(screen.getByText('select-country'));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(10));

  const thumb = screen.getByRole('slider');
  fireEvent.focus(thumb);
  fireEvent.keyDown(thumb, { key: 'ArrowRight', keyCode: 39 });

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(20));
  const urls = fetchMock.mock.calls.map((call) => call[0]);
  expect(urls.filter((u) => u.includes('year=2021')).length).toBeGreaterThan(0);
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

  await waitFor(() => expect(pending.length).toBe(10));
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

test('shows the mobile warning popup for touch devices with a mobile user agent', () => {
  document.documentElement.ontouchstart = null;
  Object.defineProperty(window.navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS) Mobi/15E148',
    configurable: true,
  });
  render(<App />);
  expect(screen.getByText('We detected a mobile device being used.')).toBeInTheDocument();
});
