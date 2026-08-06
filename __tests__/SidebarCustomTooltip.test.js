/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SidebarCustomTooltip from '../src/components/SidebarCustomTooltip';
import { defaultSettings } from '../testUtils/fixtures';

test('renders nothing when inactive', () => {
  const { container } = render(
    <SidebarCustomTooltip active={false} payload={[]} settings={defaultSettings} />
  );
  expect(container).toBeEmptyDOMElement();
});

test('renders the full country name and the value with the currency symbol when active', () => {
  render(
    <SidebarCustomTooltip
      active={true}
      payload={[{ value: 12345, payload: { full_name: 'United States' } }]}
      settings={defaultSettings}
    />
  );
  expect(screen.getByText('United States')).toBeInTheDocument();
  expect(screen.getByText('12,345 $')).toBeInTheDocument();
});
