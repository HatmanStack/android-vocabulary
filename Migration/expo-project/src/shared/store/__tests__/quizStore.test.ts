/**
 * Quiz Store Tests
 */

import { useQuizStore } from '../quizStore';
import { useVocabularyStore } from '../vocabularyStore';

describe('quizStore', () => {
  beforeAll(() => {
    // Ensure vocabulary is loaded
    useVocabularyStore.getState().loadVocabularyLists();
  });

  beforeEach(() => {
    // Reset quiz store before each test
    const store = useQuizStore.getState();
    store.resetStats();
  });

  describe('startQuiz', () => {
    it('initializes quiz session with correct data', () => {
      const store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');

      // Get fresh state after mutation
      const updatedStore = useQuizStore.getState();

      expect(updatedStore.isQuizActive).toBe(true);
      expect(updatedStore.currentSession).not.toBeNull();
      expect(updatedStore.currentSession?.listId).toBe('list-a');
      expect(updatedStore.currentSession?.levelId).toBe('basic');
      expect(updatedStore.currentSession?.words.length).toBeGreaterThan(0);
    });

    it('initializes answered array with 0s', () => {
      const store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');

      const wordCount = store.currentSession?.words.length || 0;
      expect(store.answered).toHaveLength(wordCount);
      expect(store.answered.every((state) => state === 0)).toBe(true);
    });

    it('resets session stats to 0', () => {
      const store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');

      expect(store.sessionStats.hintsUsed).toBe(0);
      expect(store.sessionStats.wrongAnswers).toBe(0);
      expect(store.sessionStats.correctAnswers).toBe(0);
    });

    it('generates first question', () => {
      const store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');

      expect(store.currentQuestion).not.toBeNull();
      expect(store.currentQuestion?.word).toBeDefined();
      expect(store.currentQuestion?.type).toMatch(/multiple|fillin/);
    });
  });

  describe('getNextQuestion', () => {
    it('selects a word that is not mastered', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      const firstQuestion = store.currentQuestion;
      expect(firstQuestion).not.toBeNull();

      // The word's state should be less than 3
      const wordIndex = store.lastWordIndex;
      expect(store.answered[wordIndex]).toBeLessThan(3);
    });

    it('avoids repeating the same word consecutively', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      let previousWordIndex = store.lastWordIndex;

      // Get next question multiple times
      for (let i = 0; i < 5; i++) {
        store.getNextQuestion();
        store = useQuizStore.getState(); // Get fresh state
        const currentWordIndex = store.lastWordIndex;

        // Should not be the same as previous (unless all other words are mastered)
        if (store.answered.filter((s) => s < 3).length > 1) {
          expect(currentWordIndex).not.toBe(previousWordIndex);
        }

        previousWordIndex = currentWordIndex;
      }
    });

    it('generates options for multiple choice questions', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');

      // Try multiple questions to find a multiple choice one
      for (let i = 0; i < 10; i++) {
        store = useQuizStore.getState(); // Get fresh state
        if (store.currentQuestion?.type === 'multiple') {
          expect(store.currentQuestion.options).toBeDefined();
          expect(store.currentQuestion.options).toHaveLength(4);
          break;
        }
        store.getNextQuestion();
      }
    });
  });

  describe('submitAnswer', () => {
    describe('correct answers', () => {
      it('increments correct answer count', () => {
        let store = useQuizStore.getState();
        store.startQuiz('list-a', 'basic');
        store = useQuizStore.getState(); // Get fresh state

        const correctWord = store.currentQuestion!.word.word;
        const initialCorrect = store.sessionStats.correctAnswers;

        store.submitAnswer(correctWord);
        store = useQuizStore.getState(); // Get fresh state

        expect(store.sessionStats.correctAnswers).toBe(initialCorrect + 1);
      });

      it('progresses word state for multiple choice: 0→1', () => {
        let store = useQuizStore.getState();
        store.startQuiz('list-a', 'basic');

        // Find a multiple choice question with word state 0
        for (let i = 0; i < 20; i++) {
          store = useQuizStore.getState(); // Get fresh state
          const wordIndex = store.lastWordIndex;
          if (store.currentQuestion?.type === 'multiple' && store.answered[wordIndex] === 0) {
            const correctWord = store.currentQuestion.word.word;
            store.submitAnswer(correctWord);
            store = useQuizStore.getState(); // Get fresh state
            expect(store.answered[wordIndex]).toBe(1);
            break;
          }
          store.getNextQuestion();
        }
      });

      it('progresses word state for fill-in-blank: 0→2', () => {
        let store = useQuizStore.getState();
        store.startQuiz('list-a', 'basic');

        // Find a fill-in-blank question with word state 0
        for (let i = 0; i < 20; i++) {
          store = useQuizStore.getState(); // Get fresh state
          const wordIndex = store.lastWordIndex;
          if (store.currentQuestion?.type === 'fillin' && store.answered[wordIndex] === 0) {
            const correctWord = store.currentQuestion.word.word;
            store.submitAnswer(correctWord);
            store = useQuizStore.getState(); // Get fresh state
            expect(store.answered[wordIndex]).toBe(2);
            break;
          }
          store.getNextQuestion();
        }
      });
    });

    describe('wrong answers', () => {
      it('increments wrong answer count', () => {
        let store = useQuizStore.getState();
        store.startQuiz('list-a', 'basic');
        store = useQuizStore.getState(); // Get fresh state

        const initialWrong = store.sessionStats.wrongAnswers;
        store.submitAnswer('wronganswer');
        store = useQuizStore.getState(); // Get fresh state

        expect(store.sessionStats.wrongAnswers).toBe(initialWrong + 1);
      });

      it('does not change word state', () => {
        let store = useQuizStore.getState();
        store.startQuiz('list-a', 'basic');
        store = useQuizStore.getState(); // Get fresh state

        const wordIndex = store.lastWordIndex;
        const initialState = store.answered[wordIndex];

        store.submitAnswer('wronganswer');
        store = useQuizStore.getState(); // Get fresh state

        expect(store.answered[wordIndex]).toBe(initialState);
      });
    });

    it('returns result with isCorrect and correctAnswer', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      const correctWord = store.currentQuestion!.word.word;
      const result = store.submitAnswer(correctWord);

      expect(result).toHaveProperty('isCorrect');
      expect(result).toHaveProperty('correctAnswer');
      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswer).toBe(correctWord);
    });
  });

  describe('useHint', () => {
    it('increments hint count', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      const initialHints = store.sessionStats.hintsUsed;
      store.useHint();
      store = useQuizStore.getState(); // Get fresh state

      expect(store.sessionStats.hintsUsed).toBe(initialHints + 1);
    });

    it('returns word definition', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      const definition = store.useHint();
      const expectedDefinition = store.currentQuestion!.word.definition;

      expect(definition).toBe(expectedDefinition);
    });
  });

  describe('calculateProgress', () => {
    it('returns 0 for new quiz', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      expect(store.calculateProgress()).toBe(0);
    });

    it('calculates sum of word states', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      // Manually set some word states for testing
      const newAnswered = [...store.answered];
      newAnswered[0] = 1;
      newAnswered[1] = 2;
      newAnswered[2] = 3;
      (store as any).answered = newAnswered;

      const progress = store.calculateProgress();
      expect(progress).toBe(6); // 1 + 2 + 3
    });
  });

  describe('isQuizComplete', () => {
    it('returns false for new quiz', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      expect(store.isQuizComplete()).toBe(false);
    });

    it('returns true when all words at state 3', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      // Set all words to mastered
      const newAnswered = store.answered.map(() => 3 as const);
      (store as any).answered = newAnswered;

      expect(store.isQuizComplete()).toBe(true);
    });
  });

  describe('endQuiz', () => {
    it('returns final stats', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      // Add some stats
      store.useHint();
      store.submitAnswer('wrong');
      store = useQuizStore.getState(); // Get fresh state

      const stats = store.endQuiz();

      expect(stats.hints).toBe(1);
      expect(stats.wrong).toBe(1);
    });

    it('sets isQuizActive to false', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      expect(store.isQuizActive).toBe(true);

      store.endQuiz();
      store = useQuizStore.getState(); // Get fresh state

      expect(store.isQuizActive).toBe(false);
    });
  });

  describe('stat tracking', () => {
    it('tracks multiple hints', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      store.incrementHints();
      store.incrementHints();
      store.incrementHints();
      store = useQuizStore.getState(); // Get fresh state

      expect(store.sessionStats.hintsUsed).toBe(3);
    });

    it('tracks multiple wrong answers', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      store.incrementWrong();
      store.incrementWrong();
      store = useQuizStore.getState(); // Get fresh state

      expect(store.sessionStats.wrongAnswers).toBe(2);
    });

    it('tracks multiple correct answers', () => {
      let store = useQuizStore.getState();
      store.startQuiz('list-a', 'basic');
      store = useQuizStore.getState(); // Get fresh state

      store.incrementCorrect();
      store.incrementCorrect();
      store.incrementCorrect();
      store = useQuizStore.getState(); // Get fresh state

      expect(store.sessionStats.correctAnswers).toBe(3);
    });
  });
});
