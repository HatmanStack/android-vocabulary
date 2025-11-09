/**
 * Progress Store Tests
 *
 * Comprehensive tests for progress tracking and persistence logic
 */

import { useProgressStore } from '../progressStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

describe('progressStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useProgressStore.getState().resetAllProgress();
  });

  describe('word progress tracking', () => {
    it('creates new word progress on first update', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 1, true, false);
      store = useProgressStore.getState(); // Get fresh state

      const progress = store.getListLevelProgress('list-a', 'basic');
      expect(progress).toBeDefined();
      expect(progress?.wordProgress['word1']).toBeDefined();
      expect(progress?.wordProgress['word1'].state).toBe(1);
      expect(progress?.wordProgress['word1'].correctAttempts).toBe(1);
    });

    it('updates existing word progress', () => {
      let store = useProgressStore.getState();

      // First update
      store.updateWordProgress('word1', 'list-a', 'basic', 1, true, false);
      store = useProgressStore.getState();

      // Second update
      store.updateWordProgress('word1', 'list-a', 'basic', 2, true, true);
      store = useProgressStore.getState();

      const progress = store.getListLevelProgress('list-a', 'basic');
      expect(progress?.wordProgress['word1'].state).toBe(2);
      expect(progress?.wordProgress['word1'].correctAttempts).toBe(2);
      expect(progress?.wordProgress['word1'].hintsUsed).toBe(1);
    });

    it('tracks wrong attempts', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 0, false, false);
      store = useProgressStore.getState();

      const progress = store.getListLevelProgress('list-a', 'basic');
      expect(progress?.wordProgress['word1'].wrongAttempts).toBe(1);
      expect(progress?.wordProgress['word1'].correctAttempts).toBe(0);
    });

    it('sets masteredDate when word reaches state 3', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store = useProgressStore.getState();

      const progress = store.getListLevelProgress('list-a', 'basic');
      expect(progress?.wordProgress['word1'].masteredDate).toBeDefined();
    });

    it('retrieves word progress by ID', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 2, true, false);
      store = useProgressStore.getState();

      const wordProgress = store.getWordProgress('word1');
      expect(wordProgress).toBeDefined();
      expect(wordProgress?.state).toBe(2);
    });

    it('returns null for non-existent word', () => {
      const store = useProgressStore.getState();

      const wordProgress = store.getWordProgress('nonexistent');
      expect(wordProgress).toBeNull();
    });

    it('gets word states for a level', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 1, true, false);
      store.updateWordProgress('word2', 'list-a', 'basic', 2, true, false);
      store = useProgressStore.getState();

      const states = store.getWordStateForLevel('list-a', 'basic');
      expect(states['word1']).toBe(1);
      expect(states['word2']).toBe(2);
    });
  });

  describe('best score tracking', () => {
    it('sets best score on first completion', () => {
      let store = useProgressStore.getState();

      const isNew = store.updateBestScore('list-a', 'basic', { hints: 2, wrong: 1 });
      store = useProgressStore.getState();

      expect(isNew).toBe(true);
      const best = store.getBestScore('list-a', 'basic');
      expect(best?.hints).toBe(2);
      expect(best?.wrong).toBe(1);
      expect(best?.completedAt).toBeDefined();
    });

    it('updates best score when better (fewer hints)', () => {
      let store = useProgressStore.getState();

      store.updateBestScore('list-a', 'basic', { hints: 3, wrong: 1 });
      store = useProgressStore.getState();

      const isNew = store.updateBestScore('list-a', 'basic', { hints: 1, wrong: 1 });
      store = useProgressStore.getState();

      expect(isNew).toBe(true);
      const best = store.getBestScore('list-a', 'basic');
      expect(best?.hints).toBe(1);
    });

    it('does not update best score when worse', () => {
      let store = useProgressStore.getState();

      store.updateBestScore('list-a', 'basic', { hints: 1, wrong: 0 });
      store = useProgressStore.getState();

      const isNew = store.updateBestScore('list-a', 'basic', { hints: 2, wrong: 1 });
      store = useProgressStore.getState();

      expect(isNew).toBe(false);
      const best = store.getBestScore('list-a', 'basic');
      expect(best?.hints).toBe(1);
      expect(best?.wrong).toBe(0);
    });

    it('returns null for non-existent best score', () => {
      const store = useProgressStore.getState();

      const best = store.getBestScore('nonexistent', 'nonexistent');
      expect(best).toBeNull();
    });
  });

  describe('global stats tracking', () => {
    it('increments global stats correctly', () => {
      let store = useProgressStore.getState();

      store.incrementGlobalStats(2, 1, 5);
      store = useProgressStore.getState();

      const stats = store.getGlobalStats();
      expect(stats.allTimeHints).toBe(2);
      expect(stats.allTimeWrong).toBe(1);
      expect(stats.allTimeCorrect).toBe(5);
    });

    it('accumulates stats across multiple sessions', () => {
      let store = useProgressStore.getState();

      store.incrementGlobalStats(1, 0, 3);
      store.incrementGlobalStats(2, 1, 4);
      store = useProgressStore.getState();

      const stats = store.getGlobalStats();
      expect(stats.allTimeHints).toBe(3);
      expect(stats.allTimeWrong).toBe(1);
      expect(stats.allTimeCorrect).toBe(7);
    });

    it('returns initial stats when no data', () => {
      const store = useProgressStore.getState();

      const stats = store.getGlobalStats();
      expect(stats.allTimeHints).toBe(0);
      expect(stats.allTimeWrong).toBe(0);
      expect(stats.allTimeCorrect).toBe(0);
      expect(stats.totalWordsLearned).toBe(0);
      expect(stats.listsCompleted).toEqual([]);
    });
  });

  describe('progress calculation', () => {
    it('calculates level progress correctly', () => {
      let store = useProgressStore.getState();

      // 2 out of 4 words mastered = 50%
      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'basic', 1, true, false);
      store.updateWordProgress('word3', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word4', 'list-a', 'basic', 2, true, false);
      store = useProgressStore.getState();

      const progress = store.calculateLevelProgress('list-a', 'basic');
      expect(progress).toBe(50);
    });

    it('returns 0 for level with no progress', () => {
      const store = useProgressStore.getState();

      const progress = store.calculateLevelProgress('list-a', 'basic');
      expect(progress).toBe(0);
    });

    it('calculates list progress across multiple levels', () => {
      let store = useProgressStore.getState();

      // Level 1: 2/2 words = 100%
      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'basic', 3, true, false);

      // Level 2: 1/2 words = 50%
      store.updateWordProgress('word3', 'list-a', 'intermediate', 3, true, false);
      store.updateWordProgress('word4', 'list-a', 'intermediate', 1, true, false);

      store = useProgressStore.getState();

      // Total: 3/4 words = 75%
      const progress = store.calculateListProgress('list-a');
      expect(progress).toBe(75);
    });

    it('counts total words learned across all lists', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word3', 'list-b', 'basic', 3, true, false);
      store = useProgressStore.getState();

      const total = store.getTotalWordsLearned();
      expect(total).toBe(3);
    });
  });

  describe('completion tracking', () => {
    it('detects level completion', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'basic', 3, true, false);
      store = useProgressStore.getState();

      const isCompleted = store.isLevelCompleted('list-a', 'basic');
      expect(isCompleted).toBe(true);
    });

    it('returns false for incomplete level', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'basic', 2, true, false);
      store = useProgressStore.getState();

      const isCompleted = store.isLevelCompleted('list-a', 'basic');
      expect(isCompleted).toBe(false);
    });

    it('detects list completion', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'basic', 3, true, false);
      store = useProgressStore.getState();

      const isCompleted = store.isListCompleted('list-a');
      expect(isCompleted).toBe(true);
    });

    it('returns false for incomplete list', () => {
      let store = useProgressStore.getState();

      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'intermediate', 2, true, false);
      store = useProgressStore.getState();

      const isCompleted = store.isListCompleted('list-a');
      expect(isCompleted).toBe(false);
    });
  });

  describe('session management', () => {
    it('starts and ends session correctly', () => {
      let store = useProgressStore.getState();

      store.startSession('list-a', 'basic');
      store = useProgressStore.getState();

      expect(store.currentListId).toBe('list-a');
      expect(store.currentLevelId).toBe('basic');

      store.endSession('list-a', 'basic', { hints: 1, wrong: 0, correct: 5 });
      store = useProgressStore.getState();

      expect(store.currentListId).toBeUndefined();
      expect(store.currentLevelId).toBeUndefined();
    });

    it('endSession updates global stats', () => {
      let store = useProgressStore.getState();

      store.endSession('list-a', 'basic', { hints: 2, wrong: 1, correct: 5 });
      store = useProgressStore.getState();

      const stats = store.getGlobalStats();
      expect(stats.allTimeHints).toBe(2);
      expect(stats.allTimeWrong).toBe(1);
      expect(stats.allTimeCorrect).toBe(5);
    });

    it('endSession updates best score', () => {
      let store = useProgressStore.getState();

      store.endSession('list-a', 'basic', { hints: 1, wrong: 0, correct: 5 });
      store = useProgressStore.getState();

      const best = store.getBestScore('list-a', 'basic');
      expect(best?.hints).toBe(1);
      expect(best?.wrong).toBe(0);
      expect(best?.completedAt).toBeDefined();
    });
  });

  describe('reset functionality', () => {
    it('resets list-level progress', () => {
      let store = useProgressStore.getState();

      // Add some progress
      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.updateWordProgress('word2', 'list-a', 'intermediate', 2, true, false);
      store = useProgressStore.getState();

      // Reset basic level
      store.resetListLevelProgress('list-a', 'basic');
      store = useProgressStore.getState();

      const basicProgress = store.getListLevelProgress('list-a', 'basic');
      const intermediateProgress = store.getListLevelProgress('list-a', 'intermediate');

      expect(basicProgress).toBeNull();
      expect(intermediateProgress).not.toBeNull();
    });

    it('resets all progress', () => {
      let store = useProgressStore.getState();

      // Add progress and stats
      store.updateWordProgress('word1', 'list-a', 'basic', 3, true, false);
      store.incrementGlobalStats(5, 2, 10);
      store = useProgressStore.getState();

      // Reset all
      store.resetAllProgress();
      store = useProgressStore.getState();

      expect(Object.keys(store.listLevelProgress)).toHaveLength(0);
      expect(store.globalStats.allTimeHints).toBe(0);
      expect(store.globalStats.allTimeWrong).toBe(0);
      expect(store.globalStats.allTimeCorrect).toBe(0);
    });
  });
});
