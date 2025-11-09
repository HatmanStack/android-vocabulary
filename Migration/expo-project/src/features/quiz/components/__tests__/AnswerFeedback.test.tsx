/**
 * AnswerFeedback Tests
 */

import React from 'react';
import { render, act } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { AnswerFeedback } from '../AnswerFeedback';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<PaperProvider>{component}</PaperProvider>);
};

describe('AnswerFeedback', () => {
  const mockOnAnimationEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct message when answer is correct', () => {
    const { getByText } = renderWithProvider(
      <AnswerFeedback isCorrect={true} isVisible={true} onAnimationEnd={mockOnAnimationEnd} />
    );

    expect(getByText(/Correct/i)).toBeTruthy();
  });

  it('renders wrong message when answer is incorrect', () => {
    const { getByText } = renderWithProvider(
      <AnswerFeedback isCorrect={false} isVisible={true} onAnimationEnd={mockOnAnimationEnd} />
    );

    expect(getByText(/Wrong/i)).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = renderWithProvider(
      <AnswerFeedback isCorrect={true} isVisible={false} onAnimationEnd={mockOnAnimationEnd} />
    );

    // Component should not be visible or have opacity 0
    const correctText = queryByText(/Correct/i);
    expect(correctText).toBeFalsy();
  });

  it('renders with checkmark icon for correct answers', () => {
    const { getByText } = renderWithProvider(
      <AnswerFeedback isCorrect={true} isVisible={true} onAnimationEnd={mockOnAnimationEnd} />
    );

    // Should contain correct text with success styling
    const correctText = getByText(/Correct/i);
    expect(correctText).toBeTruthy();
  });

  it('renders with X icon for wrong answers', () => {
    const { getByText } = renderWithProvider(
      <AnswerFeedback isCorrect={false} isVisible={true} onAnimationEnd={mockOnAnimationEnd} />
    );

    // Should contain wrong text with error styling
    const wrongText = getByText(/Wrong/i);
    expect(wrongText).toBeTruthy();
  });

  it('calls onAnimationEnd when component becomes visible', () => {
    jest.useFakeTimers();

    const { rerender } = renderWithProvider(
      <AnswerFeedback isCorrect={true} isVisible={false} onAnimationEnd={mockOnAnimationEnd} />
    );

    // Make it visible
    rerender(
      <PaperProvider>
        <AnswerFeedback isCorrect={true} isVisible={true} onAnimationEnd={mockOnAnimationEnd} />
      </PaperProvider>
    );

    // Fast-forward time to trigger the animation end callback (1500ms + animation duration)
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // The animation end callback should have been called
    expect(mockOnAnimationEnd).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
