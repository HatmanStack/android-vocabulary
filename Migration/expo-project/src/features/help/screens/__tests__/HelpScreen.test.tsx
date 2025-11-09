/**
 * HelpScreen Tests
 */

import React from 'react';
import { renderWithProviders } from '@/shared/lib/testUtils';
import HelpScreen from '../HelpScreen';

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
} as any;

const mockRoute = {
  key: 'Help',
  name: 'Help' as const,
  params: undefined,
} as any;

describe('HelpScreen', () => {
  it('exports HelpScreen component', () => {
    expect(HelpScreen).toBeDefined();
    expect(typeof HelpScreen).toBe('function');
  });

  it('renders successfully', () => {
    const { toJSON } = renderWithProviders(
      <HelpScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('accepts navigation prop with goBack method', () => {
    const { toJSON } = renderWithProviders(
      <HelpScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(mockNavigation.goBack).toBeDefined();
    expect(toJSON()).toBeTruthy();
  });

  it('accepts route prop', () => {
    const { toJSON } = renderWithProviders(
      <HelpScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(mockRoute.name).toBe('Help');
    expect(toJSON()).toBeTruthy();
  });
});
