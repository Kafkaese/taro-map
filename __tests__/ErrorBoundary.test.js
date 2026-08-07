/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../src/components/ErrorBoundary';

const Bomb = () => {
  throw new Error('boom');
};

test('renders children normally when there is no error', () => {
  render(
    <ErrorBoundary>
      <div>all good</div>
    </ErrorBoundary>
  );
  expect(screen.getByText('all good')).toBeInTheDocument();
});

test('renders a fallback instead of a blank page when a child throws', () => {
  // React logs the caught error to the console itself, on top of our own
  // componentDidCatch logging - expected noise, suppressed for this test.
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  expect(screen.queryByText('all good')).not.toBeInTheDocument();

  consoleError.mockRestore();
});

test('the reload button reloads the page', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const reload = jest.fn();
  delete window.location;
  window.location = { reload };

  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  fireEvent.click(screen.getByText('Reload'));
  expect(reload).toHaveBeenCalled();

  consoleError.mockRestore();
});
