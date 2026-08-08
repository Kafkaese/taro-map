/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Impressum from '../src/components/Impressum';

test('renders without crashing', () => {
  render(<Impressum />);
  expect(screen.getByText('Impressum')).toBeInTheDocument();
});

test('github profile link has an absolute URL, not a bare host+path', () => {
  // Regression test: without the scheme, the browser resolves
  // "github.com/Kafkaese" as a path relative to the current page
  // (e.g. https://www.arms-tracker.app/github.com/Kafkaese) instead of
  // as an absolute URL to GitHub.
  render(<Impressum />);
  expect(screen.getByText('github.com/Kafkaese')).toHaveAttribute('href', 'https://github.com/Kafkaese');
});
