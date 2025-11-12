import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Little Shop heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Little Shop/i);
  expect(headingElement).toBeInTheDocument();
});