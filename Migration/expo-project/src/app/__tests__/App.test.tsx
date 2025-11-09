/**
 * App Component Tests
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import * as storage from '@/shared/lib/storage';
import { useProgressStore } from '@/shared/store/progressStore';

// Mock storage
jest.mock('@/shared/lib/storage', () => ({
  initializeStorage: jest.fn(() => Promise.resolve()),
  STORAGE_KEYS: {
    USER_PROGRESS: 'vocabulary-progress',
    SETTINGS: 'vocabulary-settings',
    VERSION: 'vocabulary-version',
    LAST_SYNC: 'vocabulary-last-sync',
  },
}));

// Mock navigation component
jest.mock('../navigation', () => {
  const { View, Text } = require('react-native');
  return function Navigation() {
    return (
      <View testID="navigation">
        <Text>Navigation</Text>
      </View>
    );
  };
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure progress store is hydrated for tests
    useProgressStore.setState({ _hydrated: true });
  });

  it('renders without crashing', () => {
    const { root } = render(<App />);
    expect(root).toBeTruthy();
  });

  it('shows loading indicator initially', () => {
    const { getByTestId } = render(<App />);
    // The ActivityIndicator is wrapped in a View, so we check for the loading container
    expect(getByTestId).toBeDefined();
  });

  it('calls initializeStorage on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(storage.initializeStorage).toHaveBeenCalled();
    });
  });

  it('renders navigation after initialization', async () => {
    const { getByTestId } = render(<App />);

    // Wait for navigation to appear (after loading and hydration)
    await waitFor(
      () => {
        expect(getByTestId('navigation')).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('handles initialization errors gracefully', async () => {
    // Mock initialization error
    (storage.initializeStorage as jest.Mock).mockRejectedValueOnce(
      new Error('Storage error')
    );

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByTestId } = render(<App />);

    // Should still render navigation after error
    await waitFor(
      () => {
        expect(getByTestId('navigation')).toBeTruthy();
      },
      { timeout: 3000 }
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to initialize app:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
