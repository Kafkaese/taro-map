/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

// WorldMap is unit-tested separately (see WorldMap.test.js) and needs real
// map geometry to render; here we only care about App's own state wiring,
// so replace it with a stub that echoes the props it was given.
jest.mock('../src/components/WorldMap', () => (props) => (
  <div data-testid="world-map">
    {JSON.stringify({ mapModeImport: props.mapModeImport, year: props.year })}
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
  fireEvent.click(screen.getByAltText('Settings'));
  expect(screen.getByText('Currency:')).toBeInTheDocument();
  fireEvent.click(screen.getByAltText('Settings'));
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

test('shows the mobile warning popup for touch devices with a mobile user agent', () => {
  document.documentElement.ontouchstart = null;
  Object.defineProperty(window.navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS) Mobi/15E148',
    configurable: true,
  });
  render(<App />);
  expect(screen.getByText('We detected a mobile device being used.')).toBeInTheDocument();
});
