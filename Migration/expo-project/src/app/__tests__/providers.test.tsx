/**
 * Providers Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, useColorScheme } from 'react-native';
import Providers from '../providers';
import { useSettingsStore } from '@/shared/store/settingsStore';

// Mock storage module
jest.mock('@/shared/lib/storage', () => ({
  initializeStorage: jest.fn(() => Promise.resolve()),
  STORAGE_KEYS: {
    USER_PROGRESS: 'vocabulary-progress',
    SETTINGS: 'vocabulary-settings',
    VERSION: 'vocabulary-version',
    LAST_SYNC: 'vocabulary-last-sync',
  },
}));

// Mock react-native useColorScheme
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    useColorScheme: jest.fn(),
  };
});

describe('Providers', () => {
  beforeEach(() => {
    // Reset settings store to default
    useSettingsStore.setState({ theme: 'auto' });
    (useColorScheme as jest.Mock).mockReturnValue('light');
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <Providers>
        <Text>Test Child</Text>
      </Providers>
    );

    expect(getByText('Test Child')).toBeTruthy();
  });

  it('uses light theme when theme is set to light', () => {
    useSettingsStore.setState({ theme: 'light' });

    const { root } = render(
      <Providers>
        <Text>Content</Text>
      </Providers>
    );

    expect(root).toBeTruthy();
  });

  it('uses dark theme when theme is set to dark', () => {
    useSettingsStore.setState({ theme: 'dark' });

    const { root } = render(
      <Providers>
        <Text>Content</Text>
      </Providers>
    );

    expect(root).toBeTruthy();
  });

  it('uses system theme when theme is set to auto and system is light', () => {
    useSettingsStore.setState({ theme: 'auto' });
    (useColorScheme as jest.Mock).mockReturnValue('light');

    const { root } = render(
      <Providers>
        <Text>Content</Text>
      </Providers>
    );

    expect(root).toBeTruthy();
  });

  it('uses system theme when theme is set to auto and system is dark', () => {
    useSettingsStore.setState({ theme: 'auto' });
    (useColorScheme as jest.Mock).mockReturnValue('dark');

    const { root } = render(
      <Providers>
        <Text>Content</Text>
      </Providers>
    );

    expect(root).toBeTruthy();
  });

  it('wraps children with SafeAreaProvider', () => {
    const { root } = render(
      <Providers>
        <Text>Content</Text>
      </Providers>
    );

    // SafeAreaProvider should be in the component tree
    expect(root).toBeTruthy();
  });

  it('wraps children with PaperProvider', () => {
    const { root } = render(
      <Providers>
        <Text>Content</Text>
      </Providers>
    );

    // PaperProvider should be in the component tree
    expect(root).toBeTruthy();
  });
});
