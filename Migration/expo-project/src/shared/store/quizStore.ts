/**
 * Quiz Store
 *
 * Manages quiz session state, question generation, and answer submission.
 * Handles word state progression (0→1→2→3) based on question type and correctness.
 */

import { create } from 'zustand';
import { QuizQuestion, QuizSession, QuestionType, WordState } from '@/shared/types';
import { useVocabularyStore } from './vocabularyStore';
import { useAdaptiveDifficultyStore } from './adaptiveDifficultyStore';

interface SessionStats {
  hintsUsed: number;
  wrongAnswers: number;
  correctAnswers: number;
}

interface QuizState {
  // Session data
  currentSession: QuizSession | null;
  currentQuestion: QuizQuestion | null;
  currentQuestionIndex: number;
  isQuizActive: boolean;
  sessionStats: SessionStats;
  answered: WordState[]; // Word states: 0, 1, 2, or 3
  lastWordIndex: number; // Track to avoid repeating same word consecutively

  // Actions
  startQuiz: (listId: string, levelId: string) => void;
  getNextQuestion: () => void;
  determineQuestionType: (wordState: WordState) => QuestionType;
  incrementHints: () => void;
  incrementWrong: () => void;
  incrementCorrect: () => void;
  resetStats: () => void;
  endQuiz: () => { hints: number; wrong: number; correct: number };
  isQuizComplete: () => boolean;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  currentSession: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  isQuizActive: false,
  sessionStats: {
    hintsUsed: 0,
    wrongAnswers: 0,
    correctAnswers: 0,
  },
  answered: [],
  lastWordIndex: -1,

  // Start a new quiz session
  startQuiz: (listId: string, levelId: string) => {
    const vocabularyStore = useVocabularyStore.getState();
    const words = vocabularyStore.getWordsByListLevel(listId, levelId);

    if (words.length === 0) {
      console.error(`No words found for list ${listId}, level ${levelId}`);
      return;
    }

    // Initialize answered array with 0s (all words unanswered)
    const answered = new Array(words.length).fill(0) as WordState[];

    const session: QuizSession = {
      listId,
      levelId,
      words,
      currentQuestionIndex: 0,
      sessionStats: {
        hintsUsed: 0,
        wrongAnswers: 0,
        correctAnswers: 0,
      },
      startedAt: new Date().toISOString(),
    };

    set({
      currentSession: session,
      currentQuestionIndex: 0,
      isQuizActive: true,
      sessionStats: { hintsUsed: 0, wrongAnswers: 0, correctAnswers: 0 },
      answered,
      lastWordIndex: -1,
    });

    // Get first question
    get().getNextQuestion();
  },

  // Get next question
  getNextQuestion: () => {
    const { currentSession, answered, lastWordIndex } = get();

    if (!currentSession) {
      console.error('No active quiz session');
      return;
    }

    // Check if quiz is complete (all words mastered)
    if (get().isQuizComplete()) {
      console.log('Quiz complete! All words mastered.');
      return;
    }

    const { words } = currentSession;
    const totalWords = words.length;

    // Find a random word that is not mastered (state < 3)
    let attempts = 0;
    let wordIndex = -1;

    while (attempts < totalWords * 2) {
      // Try random selection
      const randomIndex = Math.floor(Math.random() * totalWords);

      // Check if word is not mastered and not the last word
      if (answered[randomIndex] < 3 && randomIndex !== lastWordIndex) {
        wordIndex = randomIndex;
        break;
      }

      attempts++;
    }

    // Fallback: find first non-mastered word
    if (wordIndex === -1) {
      wordIndex = answered.findIndex((state) => state < 3);
    }

    // If still not found, quiz is complete
    if (wordIndex === -1) {
      console.log('All words mastered!');
      return;
    }

    const word = words[wordIndex];
    const wordState = answered[wordIndex];

    // Determine question type based on word state
    const questionType = get().determineQuestionType(wordState);

    const question: QuizQuestion = {
      word,
      type: questionType,
      options: undefined, // Will be set in Task 6 for multiple choice
    };

    set({
      currentQuestion: question,
      currentQuestionIndex: get().currentQuestionIndex + 1,
      lastWordIndex: wordIndex,
    });
  },

  // Determine question type based on word state and adaptive difficulty
  // Word state 1: fill-in-blank only
  // Word state 2: multiple choice only
  // Word state 0 or 3: use adaptive difficulty algorithm
  determineQuestionType: (wordState: WordState): QuestionType => {
    const adaptiveStore = useAdaptiveDifficultyStore.getState();
    return adaptiveStore.getOptimalQuestionType(wordState);
  },

  // Increment hint count
  incrementHints: () => {
    set((state) => ({
      sessionStats: {
        ...state.sessionStats,
        hintsUsed: state.sessionStats.hintsUsed + 1,
      },
    }));
  },

  // Increment wrong answer count
  incrementWrong: () => {
    set((state) => ({
      sessionStats: {
        ...state.sessionStats,
        wrongAnswers: state.sessionStats.wrongAnswers + 1,
      },
    }));
  },

  // Increment correct answer count
  incrementCorrect: () => {
    set((state) => ({
      sessionStats: {
        ...state.sessionStats,
        correctAnswers: state.sessionStats.correctAnswers + 1,
      },
    }));
  },

  // Reset session stats
  resetStats: () => {
    set({
      sessionStats: {
        hintsUsed: 0,
        wrongAnswers: 0,
        correctAnswers: 0,
      },
    });
  },

  // End quiz and return final stats
  endQuiz: () => {
    const { sessionStats } = get();

    set({
      isQuizActive: false,
    });

    return {
      hints: sessionStats.hintsUsed,
      wrong: sessionStats.wrongAnswers,
      correct: sessionStats.correctAnswers,
    };
  },

  // Check if quiz is complete (all words at state 3)
  isQuizComplete: () => {
    const { answered } = get();
    return answered.every((state) => state === 3);
  },
}));
