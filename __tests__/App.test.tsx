/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  // Async act lets the saved auth session finish restoring inside act().
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
