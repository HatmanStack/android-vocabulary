// Navigation Types

export type RootStackParamList = {
  Home: undefined;
  Difficulty: { listId: string };
  Quiz: { listId: string; levelId: string };
  Graduation: {
    listId: string;
    levelId: string;
    stats: {
      hints: number;
      wrong: number;
      bestHints: number;
      bestWrong: number;
    };
  };
  Stats: undefined;
  Settings: undefined;
};
