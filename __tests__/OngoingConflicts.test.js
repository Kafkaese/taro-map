/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OngoingConflicts from '../src/components/OngoingConflicts';
import { buildConflict } from '../testUtils/fixtures';

test('renders nothing when there are no conflicts', () => {
  const { container } = render(<OngoingConflicts conflicts={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('renders nothing when conflicts is undefined', () => {
  const { container } = render(<OngoingConflicts conflicts={undefined} />);
  expect(container).toBeEmptyDOMElement();
});

test('renders a card with name, start year, severity and headline death toll', () => {
  render(<OngoingConflicts conflicts={[buildConflict()]} />);

  expect(screen.getByText('Ongoing Conflicts')).toBeInTheDocument();
  expect(screen.getByText('Sudanese civil wars')).toBeInTheDocument();
  // total_deaths_est: 1,600,000 -> Critical (>= 1,000,000), formatted "1.6M"
  expect(screen.getByText(/Since 1955/)).toBeInTheDocument();
  expect(screen.getByText('Critical')).toBeInTheDocument();
  expect(screen.getByText(/~1\.6M killed/)).toBeInTheDocument();
});

test('caps the belligerent flag cluster and summarizes the rest as "+N"', () => {
  const conflict = buildConflict({
    belligerents: [
      { country_name: 'A', alpha2: 'AA' },
      { country_name: 'B', alpha2: 'BB' },
      { country_name: 'C', alpha2: 'CC' },
      { country_name: 'D', alpha2: 'DD' },
      { country_name: 'E', alpha2: 'EE' },
      { country_name: 'F', alpha2: 'FF' },
    ],
  });
  render(<OngoingConflicts conflicts={[conflict]} />);

  expect(screen.getByText('+2')).toBeInTheDocument();
});

test('shows the military/civilian split and displacement figures in the card detail', () => {
  render(<OngoingConflicts conflicts={[buildConflict()]} />);

  expect(screen.getByText(/Military 240K/)).toBeInTheDocument();
  expect(screen.getByText(/Civilian 1\.4M/)).toBeInTheDocument();
  expect(screen.getByText('Refugees')).toBeInTheDocument();
  expect(screen.getByText('3.5M')).toBeInTheDocument();
  expect(screen.getByText('Internally Displaced')).toBeInTheDocument();
  expect(screen.getByText('8.9M')).toBeInTheDocument();
  expect(screen.getByText('low confidence')).toBeInTheDocument();
});

test('links to the conflict\'s specific Wikipedia article', () => {
  render(<OngoingConflicts conflicts={[buildConflict()]} />);

  const link = screen.getByRole('link', { name: /Wikipedia/ });
  expect(link).toHaveAttribute(
    'href',
    'https://en.wikipedia.org/wiki/Sudanese_civil_war_(2023%E2%80%93present)'
  );
});

test('renders one card per conflict, most severe first as returned by the API', () => {
  const major = buildConflict({ conflict_id: 1, name: 'Arab-Israeli / Iran-Israel conflict', total_deaths_est: 258000 });
  const critical = buildConflict({ conflict_id: 3, name: 'Sudanese civil wars', total_deaths_est: 1600000 });
  render(<OngoingConflicts conflicts={[critical, major]} />);

  expect(screen.getByText('Sudanese civil wars')).toBeInTheDocument();
  expect(screen.getByText('Arab-Israeli / Iran-Israel conflict')).toBeInTheDocument();
  expect(screen.getByText('Critical')).toBeInTheDocument();
  expect(screen.getByText('Major')).toBeInTheDocument();
});

test('clicking the disclaimer link opens the full methodology dialog, closable via the close button', () => {
  render(<OngoingConflicts conflicts={[buildConflict()]} />);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Read the full disclaimer here.'));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'About the conflict data' })).toBeInTheDocument();
  expect(screen.getByText(/Political bias & propaganda/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('clicking the overlay outside the dialog also closes it', () => {
  render(<OngoingConflicts conflicts={[buildConflict()]} />);

  fireEvent.click(screen.getByText('Read the full disclaimer here.'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('dialog').parentElement);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
