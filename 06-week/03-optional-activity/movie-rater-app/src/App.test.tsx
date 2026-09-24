import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('shows the Movie Rater title on the home screen', async () => {
  const { findAllByText } = render(<App />);
  expect((await findAllByText('Movie Rater')).length).toBeGreaterThan(0);
});
