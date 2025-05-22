// src/App.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';
import App from './App';

test('renders the User Management heading', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  
  expect(screen.getByText(/user management/i)).toBeInTheDocument();
});
