/**
 * Progress Store
 *
 * Manages user progress tracking and persistence using Zustand with AsyncStorage.
 * Tracks word states, session statistics, best scores, and all-time global stats.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordProgress, ListLevelProgress, UserProgress } from '@/shared/types/progress';
import { WordState } from '@/shared/types/quiz';
import { STORAGE_KEYS } from '@/shared/lib/storage';

interface ProgressState extends UserProgress {
  // Loading state
  isLoading: boolean;
  lastSyncedAt: string | null;

  // Word progress actions
  updateWordProgress: (
    wordId: string,
    listId: string,
    levelId: string,
    newState: WordState,
    isCorrect: boolean,
    hintUsed: boolean
  ) => void;
  getWordProgress: (wordId: string) => WordProgress | null;
  getListLevelProgress: (listId: string, levelId: string) => ListLevelProgress | null;

  // Session stats actions
  startSession: (listId: string, levelId: string) => void;
  updateSessionStats: (hints: number, wrong: number, correct: number) => void;
  endSession: (
    listId: string,
    levelId: string,
    stats: { hints: number; wrong: number; correct: number }
  ) => void;

  // Best score tracking
  updateBestScore: (
    listId: string,
    levelId: string,
    stats: { hints: number; wrong: number }
  ) => boolean;
  getBestScore: (
    listId: string,
    levelId: string
  ) => { hints: number; wrong: number; completedAt: string } | null;

  // Global stats tracking
  incrementGlobalStats: (hints: number, wrong: number, correct: number) => void;
  getGlobalStats: () => UserProgress['globalStats'];

  // Progress calculation
  calculateListProgress: (listId: string) => number;
  calculateLevelProgress: (listId: string, levelId: string) => number;
  getTotalWordsLearned: () => number;
  getWordStateForLevel: (listId: string, levelId: string) => Record<string, WordState>;

  // Reset functionality
  resetListLevelProgress: (listId: string, levelId: string) => void;
  resetAllProgress: () => void;

  // List completion tracking
  isListCompleted: (listId: string) => boolean;
  isLevelCompleted: (listId: string, levelId: string) => boolean;
}

/**
 * Generate composite key for list-level progress
 */
function getListLevelKey(listId: string, levelId: string): string {
  return `${listId}-${levelId}`;
}

/**
 * Check if a score is better than another
 * Better = fewer hints AND fewer wrong answers
 */
function isBetterScore(
  newScore: { hints: number; wrong: number },
  oldScore: { hints: number; wrong: number } | undefined
): boolean {
  if (!oldScore) return true;
  return newScore.hints <= oldScore.hints && newScore.wrong <= oldScore.wrong;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentListId: undefined,
      currentLevelId: undefined,
      listLevelProgress: {},
      globalStats: {
        allTimeHints: 0,
        allTimeWrong: 0,
        allTimeCorrect: 0,
        totalWordsLearned: 0,
        listsCompleted: [],
      },
      isLoading: false,
      lastSyncedAt: null,

      // Word progress actions
      updateWordProgress: (wordId, listId, levelId, newState, isCorrect, hintUsed) => {
        const key = getListLevelKey(listId, levelId);
        const now = new Date().toISOString();

        set((state) => {
          const existing = state.listLevelProgress[key] || {
            listId,
            levelId,
            wordProgress: {},
          };

          const wordProgress = existing.wordProgress[wordId] || {
            state: 0,
            hintsUsed: 0,
            wrongAttempts: 0,
            correctAttempts: 0,
            lastAttemptDate: now,
            firstAttemptDate: now,
          };

          // Update word progress
          const updated: WordProgress = {
            ...wordProgress,
            state: newState,
            hintsUsed: wordProgress.hintsUsed + (hintUsed ? 1 : 0),
            wrongAttempts: wordProgress.wrongAttempts + (isCorrect ? 0 : 1),
            correctAttempts: wordProgress.correctAttempts + (isCorrect ? 1 : 0),
            lastAttemptDate: now,
            masteredDate: newState === 3 ? now : wordProgress.masteredDate,
          };

          const newListLevelProgress = {
            ...state.listLevelProgress,
            [key]: {
              ...existing,
              wordProgress: {
                ...existing.wordProgress,
                [wordId]: updated,
              },
            },
          };

          // Check if list was just completed
          const listsCompleted = [...state.globalStats.listsCompleted];
          if (!listsCompleted.includes(listId)) {
            // Calculate if all levels in this list are now completed
            const allLevelsCompleted = Object.values(newListLevelProgress).every((progress) => {
              if (progress.listId !== listId) return true; // Ignore other lists
              const words = Object.values(progress.wordProgress);
              return words.length > 0 && words.every((w) => w.state === 3);
            });

            if (allLevelsCompleted) {
              listsCompleted.push(listId);
            }
          }

          return {
            listLevelProgress: newListLevelProgress,
            globalStats: {
              ...state.globalStats,
              listsCompleted,
            },
            lastSyncedAt: now,
          };
        });
      },

      getWordProgress: (wordId) => {
        const state = get();
        // Search through all list-level progress
        for (const progress of Object.values(state.listLevelProgress)) {
          if (progress.wordProgress[wordId]) {
            return progress.wordProgress[wordId];
          }
        }
        return null;
      },

      getListLevelProgress: (listId, levelId) => {
        const key = getListLevelKey(listId, levelId);
        return get().listLevelProgress[key] || null;
      },

      // Session stats actions
      startSession: (listId, levelId) => {
        set({ currentListId: listId, currentLevelId: levelId });
      },

      updateSessionStats: (hints, wrong, correct) => {
        // Session stats are tracked in quiz store, not here
        // This is a no-op placeholder for future use
      },

      endSession: (listId, levelId, stats) => {
        // Update global stats
        get().incrementGlobalStats(stats.hints, stats.wrong, stats.correct);

        // Update best score if better
        get().updateBestScore(listId, levelId, {
          hints: stats.hints,
          wrong: stats.wrong,
        });

        // Clear current session
        set({ currentListId: undefined, currentLevelId: undefined });
      },

      // Best score tracking
      updateBestScore: (listId, levelId, stats) => {
        const key = getListLevelKey(listId, levelId);
        const now = new Date().toISOString();

        const existing = get().listLevelProgress[key];
        const currentBest = existing?.bestScore;

        if (isBetterScore(stats, currentBest)) {
          set((state) => ({
            listLevelProgress: {
              ...state.listLevelProgress,
              [key]: {
                ...(existing || { listId, levelId, wordProgress: {} }),
                bestScore: {
                  hints: stats.hints,
                  wrong: stats.wrong,
                  completedAt: now,
                },
              },
            },
          }));
          return true;
        }

        return false;
      },

      getBestScore: (listId, levelId) => {
        const key = getListLevelKey(listId, levelId);
        const progress = get().listLevelProgress[key];
        return progress?.bestScore || null;
      },

      // Global stats tracking
      incrementGlobalStats: (hints, wrong, correct) => {
        set((state) => ({
          globalStats: {
            ...state.globalStats,
            allTimeHints: state.globalStats.allTimeHints + hints,
            allTimeWrong: state.globalStats.allTimeWrong + wrong,
            allTimeCorrect: state.globalStats.allTimeCorrect + correct,
          },
        }));
      },

      getGlobalStats: () => {
        return get().globalStats;
      },

      // Progress calculation
      calculateListProgress: (listId) => {
        const state = get();
        let totalWords = 0;
        let learnedWords = 0;

        // Count words across all levels in this list
        Object.values(state.listLevelProgress).forEach((progress) => {
          if (progress.listId === listId) {
            const words = Object.values(progress.wordProgress);
            totalWords += words.length;
            learnedWords += words.filter((w) => w.state === 3).length;
          }
        });

        return totalWords > 0 ? (learnedWords / totalWords) * 100 : 0;
      },

      calculateLevelProgress: (listId, levelId) => {
        const key = getListLevelKey(listId, levelId);
        const progress = get().listLevelProgress[key];

        if (!progress) return 0;

        const words = Object.values(progress.wordProgress);
        if (words.length === 0) return 0;

        const learnedWords = words.filter((w) => w.state === 3).length;
        return (learnedWords / words.length) * 100;
      },

      getTotalWordsLearned: () => {
        const state = get();
        let total = 0;

        Object.values(state.listLevelProgress).forEach((progress) => {
          const words = Object.values(progress.wordProgress);
          total += words.filter((w) => w.state === 3).length;
        });

        return total;
      },

      getWordStateForLevel: (listId, levelId) => {
        const key = getListLevelKey(listId, levelId);
        const progress = get().listLevelProgress[key];

        if (!progress) return {};

        const result: Record<string, WordState> = {};
        Object.entries(progress.wordProgress).forEach(([wordId, wordProg]) => {
          result[wordId] = wordProg.state;
        });

        return result;
      },

      // Reset functionality
      resetListLevelProgress: (listId, levelId) => {
        const key = getListLevelKey(listId, levelId);

        set((state) => {
          const newProgress = { ...state.listLevelProgress };
          delete newProgress[key];

          return {
            listLevelProgress: newProgress,
            lastSyncedAt: new Date().toISOString(),
          };
        });
      },

      resetAllProgress: () => {
        set({
          currentListId: undefined,
          currentLevelId: undefined,
          listLevelProgress: {},
          globalStats: {
            allTimeHints: 0,
            allTimeWrong: 0,
            allTimeCorrect: 0,
            totalWordsLearned: 0,
            listsCompleted: [],
          },
          lastSyncedAt: new Date().toISOString(),
        });
      },

      // List completion tracking
      isListCompleted: (listId) => {
        const progress = get().calculateListProgress(listId);
        return progress === 100;
      },

      isLevelCompleted: (listId, levelId) => {
        const progress = get().calculateLevelProgress(listId, levelId);
        return progress === 100;
      },
    }),
    {
      name: STORAGE_KEYS.USER_PROGRESS,
      storage: createJSONStorage(() => AsyncStorage),
      // Persist everything except isLoading
      partialize: (state) => ({
        currentListId: state.currentListId,
        currentLevelId: state.currentLevelId,
        listLevelProgress: state.listLevelProgress,
        globalStats: state.globalStats,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
