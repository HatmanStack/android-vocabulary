/**
 * Adaptive Difficulty Store Tests
 */

import { useAdaptiveDifficultyStore } from '../adaptiveDifficultyStore';

describe('adaptiveDifficultyStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAdaptiveDifficultyStore.getState().resetPerformance();
  });

  describe('updatePerformance', () => {
    it('tracks multiple choice performance correctly', () => {
      let store = useAdaptiveDifficultyStore.getState();

      store.updatePerformance('multiple', true);
      store = useAdaptiveDifficultyStore.getState(); // Get fresh state
      expect(store.multipleChoiceAttempts).toBe(1);
      expect(store.multipleChoiceCorrect).toBe(1);
      expect(store.multipleChoiceAccuracy).toBe(1.0);

      store.updatePerformance('multiple', false);
      store = useAdaptiveDifficultyStore.getState(); // Get fresh state
      expect(store.multipleChoiceAttempts).toBe(2);
      expect(store.multipleChoiceCorrect).toBe(1);
      expect(store.multipleChoiceAccuracy).toBe(0.5);
    });

    it('tracks fill-in-blank performance correctly', () => {
      let store = useAdaptiveDifficultyStore.getState();

      store.updatePerformance('fillin', true);
      store = useAdaptiveDifficultyStore.getState(); // Get fresh state
      expect(store.fillInBlankAttempts).toBe(1);
      expect(store.fillInBlankCorrect).toBe(1);
      expect(store.fillInBlankAccuracy).toBe(1.0);

      store.updatePerformance('fillin', false);
      store = useAdaptiveDifficultyStore.getState(); // Get fresh state
      expect(store.fillInBlankAttempts).toBe(2);
      expect(store.fillInBlankCorrect).toBe(1);
      expect(store.fillInBlankAccuracy).toBe(0.5);
    });

    it('tracks both types independently', () => {
      let store = useAdaptiveDifficultyStore.getState();

      store.updatePerformance('multiple', true);
      store.updatePerformance('fillin', false);
      store = useAdaptiveDifficultyStore.getState(); // Get fresh state

      expect(store.multipleChoiceAccuracy).toBe(1.0);
      expect(store.fillInBlankAccuracy).toBe(0.0);
    });
  });

  describe('getOptimalQuestionType', () => {
    it('always returns fillin for wordState 1', () => {
      const store = useAdaptiveDifficultyStore.getState();
      expect(store.getOptimalQuestionType(1)).toBe('fillin');
    });

    it('always returns multiple for wordState 2', () => {
      const store = useAdaptiveDifficultyStore.getState();
      expect(store.getOptimalQuestionType(2)).toBe('multiple');
    });

    it('returns random 50/50 before minimum attempts threshold', () => {
      const store = useAdaptiveDifficultyStore.getState();

      // Add some attempts but below threshold (5)
      store.updatePerformance('multiple', true);
      store.updatePerformance('multiple', true);
      store.updatePerformance('fillin', true);

      const results = new Set<string>();
      for (let i = 0; i < 20; i++) {
        results.add(store.getOptimalQuestionType(0));
      }

      // Should see both types with limited data
      expect(results.has('multiple')).toBe(true);
      expect(results.has('fillin')).toBe(true);
    });

    it('biases toward fillin when user excels at multiple choice (>80%)', () => {
      const store = useAdaptiveDifficultyStore.getState();

      // User excels at multiple choice (100% accuracy)
      for (let i = 0; i < 10; i++) {
        store.updatePerformance('multiple', true);
      }

      // Add minimum fillin attempts
      for (let i = 0; i < 5; i++) {
        store.updatePerformance('fillin', true);
      }

      // Should bias toward fillin (70% chance)
      const results = { fillin: 0, multiple: 0 };
      for (let i = 0; i < 1000; i++) {
        const type = store.getOptimalQuestionType(0);
        results[type]++;
      }

      // With 70% bias, we expect more fillin than multiple
      expect(results.fillin).toBeGreaterThan(results.multiple);
    });

    it('biases toward multiple when user struggles with fillin (<50%)', () => {
      const store = useAdaptiveDifficultyStore.getState();

      // User struggles with fill-in-blank (40% accuracy)
      for (let i = 0; i < 10; i++) {
        store.updatePerformance('fillin', i < 4); // 4 correct out of 10
      }

      // Add minimum multiple choice attempts
      for (let i = 0; i < 5; i++) {
        store.updatePerformance('multiple', true);
      }

      // Should bias toward multiple (70% chance)
      const results = { fillin: 0, multiple: 0 };
      for (let i = 0; i < 1000; i++) {
        const type = store.getOptimalQuestionType(0);
        results[type]++;
      }

      // With 70% bias, we expect more multiple than fillin
      expect(results.multiple).toBeGreaterThan(results.fillin);
    });

    it('returns balanced 50/50 when performance is balanced', () => {
      const store = useAdaptiveDifficultyStore.getState();

      // Balanced performance (60% for both)
      for (let i = 0; i < 10; i++) {
        store.updatePerformance('multiple', i < 6);
        store.updatePerformance('fillin', i < 6);
      }

      const results = { fillin: 0, multiple: 0 };
      for (let i = 0; i < 1000; i++) {
        const type = store.getOptimalQuestionType(0);
        results[type]++;
      }

      // Should be roughly 50/50 (allow 40-60% range for randomness)
      expect(results.fillin).toBeGreaterThan(400);
      expect(results.fillin).toBeLessThan(600);
      expect(results.multiple).toBeGreaterThan(400);
      expect(results.multiple).toBeLessThan(600);
    });
  });

  describe('resetPerformance', () => {
    it('resets all stats to 0', () => {
      let store = useAdaptiveDifficultyStore.getState();

      // Add some performance data
      store.updatePerformance('multiple', true);
      store.updatePerformance('fillin', false);

      // Reset
      store.resetPerformance();
      store = useAdaptiveDifficultyStore.getState(); // Get fresh state

      expect(store.multipleChoiceAttempts).toBe(0);
      expect(store.multipleChoiceCorrect).toBe(0);
      expect(store.multipleChoiceAccuracy).toBe(0);
      expect(store.fillInBlankAttempts).toBe(0);
      expect(store.fillInBlankCorrect).toBe(0);
      expect(store.fillInBlankAccuracy).toBe(0);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('returns current metrics', () => {
      let store = useAdaptiveDifficultyStore.getState();

      store.updatePerformance('multiple', true);
      store.updatePerformance('fillin', true);
      store = useAdaptiveDifficultyStore.getState(); // Get fresh state

      const metrics = store.getPerformanceMetrics();

      expect(metrics).toEqual({
        multipleChoiceAccuracy: 1.0,
        fillInBlankAccuracy: 1.0,
        multipleChoiceAttempts: 1,
        fillInBlankAttempts: 1,
      });
    });
  });
});
