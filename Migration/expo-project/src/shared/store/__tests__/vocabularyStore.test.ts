/**
 * Vocabulary Store Tests
 */

import { useVocabularyStore } from '../vocabularyStore';

describe('vocabularyStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useVocabularyStore.getState();
    store.clearSelection();
  });

  describe('loadVocabularyLists', () => {
    it('loads vocabulary lists successfully', () => {
      let store = useVocabularyStore.getState();

      // Lists should be loaded on init
      expect(store.vocabularyLists.length).toBeGreaterThan(0);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('has expected list structure', () => {
      const store = useVocabularyStore.getState();

      const firstList = store.vocabularyLists[0];
      expect(firstList).toHaveProperty('id');
      expect(firstList).toHaveProperty('name');
      expect(firstList).toHaveProperty('levels');
      expect(Array.isArray(firstList.levels)).toBe(true);
      expect(firstList.levels.length).toBeGreaterThan(0);

      // Verify level structure
      const firstLevel = firstList.levels[0];
      expect(firstLevel).toHaveProperty('id');
      expect(firstLevel).toHaveProperty('name');
    });
  });

  describe('selectList', () => {
    it('selects a valid list', () => {
      let store = useVocabularyStore.getState();
      const firstListId = store.vocabularyLists[0].id;

      store.selectList(firstListId);
      store = useVocabularyStore.getState(); // Get fresh state

      expect(store.selectedListId).toBe(firstListId);
    });

    it('handles selecting non-existent list', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      let store = useVocabularyStore.getState();
      store.selectList('non-existent-list');
      store = useVocabularyStore.getState(); // Get fresh state

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('List with ID "non-existent-list" not found')
      );
      expect(store.selectedListId).toBeNull();

      consoleSpy.mockRestore();
    });

    it('updates selected list when called multiple times', () => {
      let store = useVocabularyStore.getState();
      const firstListId = store.vocabularyLists[0].id;
      const secondListId = store.vocabularyLists[1]?.id;

      if (!secondListId) {
        // Skip if only one list
        return;
      }

      store.selectList(firstListId);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.selectedListId).toBe(firstListId);

      store.selectList(secondListId);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.selectedListId).toBe(secondListId);
    });
  });

  describe('selectLevel', () => {
    it('selects a valid level when list is selected', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const firstLevelId = firstList.levels[0].id;

      store.selectList(firstList.id);
      store.selectLevel(firstLevelId);
      store = useVocabularyStore.getState(); // Get fresh state

      expect(store.selectedLevelId).toBe(firstLevelId);
    });

    it('warns when no list is selected', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      let store = useVocabularyStore.getState();
      store.selectLevel('some-level');
      store = useVocabularyStore.getState(); // Get fresh state

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No list selected')
      );
      expect(store.selectedLevelId).toBeNull();

      consoleSpy.mockRestore();
    });

    it('warns when level does not exist in selected list', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];

      store.selectList(firstList.id);
      store.selectLevel('non-existent-level');
      store = useVocabularyStore.getState(); // Get fresh state

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Level with ID "non-existent-level" not found')
      );
      expect(store.selectedLevelId).toBeNull();

      consoleSpy.mockRestore();
    });

    it('updates selected level when called multiple times', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const firstLevelId = firstList.levels[0].id;
      const secondLevelId = firstList.levels[1]?.id;

      if (!secondLevelId) {
        // Skip if only one level
        return;
      }

      store.selectList(firstList.id);

      store.selectLevel(firstLevelId);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.selectedLevelId).toBe(firstLevelId);

      store.selectLevel(secondLevelId);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.selectedLevelId).toBe(secondLevelId);
    });
  });

  describe('clearSelection', () => {
    it('clears both list and level selections', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const firstLevel = firstList.levels[0];

      // Set selections
      store.selectList(firstList.id);
      store.selectLevel(firstLevel.id);
      store = useVocabularyStore.getState(); // Get fresh state

      expect(store.selectedListId).toBe(firstList.id);
      expect(store.selectedLevelId).toBe(firstLevel.id);

      // Clear selections
      store.clearSelection();
      store = useVocabularyStore.getState(); // Get fresh state

      expect(store.selectedListId).toBeNull();
      expect(store.selectedLevelId).toBeNull();
    });

    it('works when nothing is selected', () => {
      let store = useVocabularyStore.getState();

      store.clearSelection();
      store = useVocabularyStore.getState(); // Get fresh state

      expect(store.selectedListId).toBeNull();
      expect(store.selectedLevelId).toBeNull();
    });
  });

  describe('getSelectedList', () => {
    it('returns undefined when no list is selected', () => {
      const store = useVocabularyStore.getState();

      const selectedList = store.getSelectedList();

      expect(selectedList).toBeUndefined();
    });

    it('returns the selected list', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];

      store.selectList(firstList.id);
      store = useVocabularyStore.getState(); // Get fresh state

      const selectedList = store.getSelectedList();

      expect(selectedList).toBeDefined();
      expect(selectedList?.id).toBe(firstList.id);
      expect(selectedList?.name).toBe(firstList.name);
    });

    it('returns correct list after changing selection', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const secondList = store.vocabularyLists[1];

      if (!secondList) {
        // Skip if only one list
        return;
      }

      store.selectList(firstList.id);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.getSelectedList()?.id).toBe(firstList.id);

      store.selectList(secondList.id);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.getSelectedList()?.id).toBe(secondList.id);
    });
  });

  describe('getSelectedLevel', () => {
    it('returns undefined when no list is selected', () => {
      const store = useVocabularyStore.getState();

      const selectedLevel = store.getSelectedLevel();

      expect(selectedLevel).toBeUndefined();
    });

    it('returns undefined when list is selected but no level', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];

      store.selectList(firstList.id);
      store = useVocabularyStore.getState(); // Get fresh state

      const selectedLevel = store.getSelectedLevel();

      expect(selectedLevel).toBeUndefined();
    });

    it('returns the selected level', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const firstLevel = firstList.levels[0];

      store.selectList(firstList.id);
      store.selectLevel(firstLevel.id);
      store = useVocabularyStore.getState(); // Get fresh state

      const selectedLevel = store.getSelectedLevel();

      expect(selectedLevel).toBeDefined();
      expect(selectedLevel?.id).toBe(firstLevel.id);
      expect(selectedLevel?.name).toBe(firstLevel.name);
    });

    it('returns correct level after changing selection', () => {
      let store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const firstLevel = firstList.levels[0];
      const secondLevel = firstList.levels[1];

      if (!secondLevel) {
        // Skip if only one level
        return;
      }

      store.selectList(firstList.id);

      store.selectLevel(firstLevel.id);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.getSelectedLevel()?.id).toBe(firstLevel.id);

      store.selectLevel(secondLevel.id);
      store = useVocabularyStore.getState(); // Get fresh state
      expect(store.getSelectedLevel()?.id).toBe(secondLevel.id);
    });
  });

  describe('getWordsByListLevel', () => {
    it('returns words for a valid list and level', () => {
      const store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const firstLevel = firstList.levels[0];

      const words = store.getWordsByListLevel(firstList.id, firstLevel.id);

      expect(Array.isArray(words)).toBe(true);
      expect(words.length).toBeGreaterThan(0);
      expect(words[0]).toHaveProperty('word');
      expect(words[0]).toHaveProperty('definition');
    });

    it('returns empty array for invalid list/level combination', () => {
      const store = useVocabularyStore.getState();

      const words = store.getWordsByListLevel('invalid-list', 'invalid-level');

      expect(Array.isArray(words)).toBe(true);
      expect(words.length).toBe(0);
    });
  });

  describe('getAllWords', () => {
    it('returns all words from all lists and levels', () => {
      const store = useVocabularyStore.getState();

      const allWords = store.getAllWords();

      expect(Array.isArray(allWords)).toBe(true);
      expect(allWords.length).toBeGreaterThan(0);

      // Verify word structure
      expect(allWords[0]).toHaveProperty('word');
      expect(allWords[0]).toHaveProperty('definition');
    });

    it('returns more words than a single level', () => {
      const store = useVocabularyStore.getState();
      const firstList = store.vocabularyLists[0];
      const firstLevel = firstList.levels[0];

      const allWords = store.getAllWords();
      const levelWords = store.getWordsByListLevel(firstList.id, firstLevel.id);

      expect(allWords.length).toBeGreaterThanOrEqual(levelWords.length);
    });
  });
});
