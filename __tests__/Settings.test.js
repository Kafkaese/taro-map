/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../src/components/Settings';
import { defaultSettings } from '../testUtils/fixtures';

test('renders the currently selected currency', () => {
  render(<Settings settings={defaultSettings} setSettings={() => {}} />);
  expect(screen.getByText('US Dollar')).toBeInTheDocument();
});

test('selecting a new currency calls setSettings with the merged settings object', () => {
  const setSettings = jest.fn();
  render(<Settings settings={defaultSettings} setSettings={setSettings} />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'EUR' } });
  expect(setSettings).toHaveBeenCalledWith({
    ...defaultSettings,
    currency: { value: 'EUR', label: 'Euro', symbol: '€' },
  });
});

test('hovering the info icon shows the currency explanation, and hiding it removes it', () => {
  render(<Settings settings={defaultSettings} setSettings={() => {}} />);
  const infoText = /EUR is currency from original data/;
  const infoButton = screen.getByRole('button', { name: 'Currency information' });
  expect(screen.queryByText(infoText)).not.toBeInTheDocument();
  fireEvent.mouseOver(infoButton);
  expect(screen.getByText(infoText)).toBeInTheDocument();
  fireEvent.mouseOut(infoButton);
  expect(screen.queryByText(infoText)).not.toBeInTheDocument();
});

test('focusing the info icon via keyboard also shows the currency explanation', () => {
  // Regression test for the accessibility fix: the info box used to only
  // open on mouse hover, making it unreachable by keyboard.
  render(<Settings settings={defaultSettings} setSettings={() => {}} />);
  const infoText = /EUR is currency from original data/;
  const infoButton = screen.getByRole('button', { name: 'Currency information' });
  fireEvent.focus(infoButton);
  expect(screen.getByText(infoText)).toBeInTheDocument();
  fireEvent.blur(infoButton);
  expect(screen.queryByText(infoText)).not.toBeInTheDocument();
});
