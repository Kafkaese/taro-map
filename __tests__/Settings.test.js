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
  fireEvent.click(screen.getByText('US Dollar'));
  fireEvent.click(screen.getByText('Euro'));
  expect(setSettings).toHaveBeenCalledWith({
    ...defaultSettings,
    currency: { value: 'EUR', label: 'Euro', symbol: '€' },
  });
});

test('hovering the info icon shows the currency explanation, and hiding it removes it', () => {
  render(<Settings settings={defaultSettings} setSettings={() => {}} />);
  const infoText = /EUR is currency from original data/;
  expect(screen.queryByText(infoText)).not.toBeInTheDocument();
  fireEvent.mouseOver(screen.getByAltText('i'));
  expect(screen.getByText(infoText)).toBeInTheDocument();
  fireEvent.mouseOut(screen.getByAltText('i'));
  expect(screen.queryByText(infoText)).not.toBeInTheDocument();
});
