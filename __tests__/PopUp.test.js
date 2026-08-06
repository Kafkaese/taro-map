/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopUp from '../src/components/PopUp';

test('renders Impressum content', () => {
  render(<PopUp content="impressum" setShowPopUp={() => {}} />);
  expect(screen.getByText('Impressum')).toBeInTheDocument();
});

test('renders Data Sources content', () => {
  render(<PopUp content="data" setShowPopUp={() => {}} />);
  expect(screen.getByText('Data Sources')).toBeInTheDocument();
});

test('renders Mobile warning content', () => {
  render(<PopUp content="mobile" setShowPopUp={() => {}} />);
  expect(screen.getByText('We detected a mobile device being used.')).toBeInTheDocument();
});

test('close button calls setShowPopUp with "none"', () => {
  const setShowPopUp = jest.fn();
  render(<PopUp content="impressum" setShowPopUp={setShowPopUp} />);
  fireEvent.click(screen.getByText('X'));
  expect(setShowPopUp).toHaveBeenCalledWith('none');
});
