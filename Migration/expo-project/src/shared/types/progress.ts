import { WordState } from './quiz';

// Progress Types

export interface WordProgress {
  state: WordState;
  hintsUsed: number;
  wrongAttempts: number;
  correctAttempts: number;
  lastAttemptDate: string;
  firstAttemptDate: string;
  masteredDate?: string;
}

export interface ListLevelProgress {
  listId: string;
  levelId: string;
  wordProgress: Record<string, WordProgress>;
  bestScore?: {
    hints: number;
    wrong: number;
    completedAt: string;
  };
}

export interface UserProgress {
  currentListId?: string;
  currentLevelId?: string;
  listLevelProgress: Record<string, ListLevelProgress>;
  globalStats: {
    allTimeHints: number;
    allTimeWrong: number;
    allTimeCorrect: number;
    totalWordsLearned: number;
    listsCompleted: string[];
  };
}
