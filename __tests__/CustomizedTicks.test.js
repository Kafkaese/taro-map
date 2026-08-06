/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import CustomizedTick from '../src/components/CustomizedTicks';

test('renders a flag image for the given country code', () => {
  const { container } = render(
    <svg>
      <CustomizedTick x={10} y={10} payload={{ value: 'us' }} />
    </svg>
  );
  const img = container.querySelector('img');
  expect(img).toHaveAttribute('src', expect.stringContaining('us.svg'));
});
