# Vocabulary App - React Native Architecture

## Component Architecture

### Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         App Root                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Providers                                  │    │
│  │  • ThemeProvider (React Native Paper)               │    │
│  │  • StoreProvider (Zustand)                          │    │
│  │  • SafeAreaProvider                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         NavigationContainer                          │    │
│  │              (React Navigation)                      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
      ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
      │  Home   │    │  Quiz   │    │  Stats  │
      │ Screen  │    │ Screen  │    │ Screen  │
      └─────────┘    └─────────┘    └─────────┘
```

---

## Screen Flow Diagram

```
┌──────────────┐
│  HomeScreen  │  (List Selection: A, B, C, D, E, F, G, H)
└──────┬───────┘
       │ Select List
       ▼
┌──────────────────┐
│ DifficultyScreen │  (Level: Basic, Intermediate, Advanced, Expert, Professional)
└──────┬───────────┘
       │ Select Level
       ▼
┌──────────────┐
│  QuizScreen  │  ◄──────┐
│              │         │
│ ┌──────────┐ │         │ Next Question
│ │ Question │ │         │
│ │ Display  │ │         │
│ └──────────┘ │         │
│      │       │         │
│      ├──── Multiple Choice ────┐
│      │                         │
│      └──── Fill-in-Blank ──────┤
│                                │
│ Answer Submitted ──────────────┘
└──────┬───────────┘
       │ All Words Completed
       ▼
┌──────────────────┐
│ GraduationScreen │  (Performance Summary)
└──────┬───────────┘
       │
       ├─── Reset List ───► Back to QuizScreen
       │
       └─── New List/Level ───► Back to HomeScreen
```

---

## Quiz Screen Component Breakdown

```
┌─────────────────────────────────────────────────────────┐
│                     QuizScreen                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                  QuizHeader                          │ │
│ │  ┌────────────────┐  ┌──────────────────┐          │ │
│ │  │  ProgressBar   │  │  Session Stats   │          │ │
│ │  │  [=====>    ]  │  │  Hints: 2        │          │ │
│ │  │   12/30        │  │  Wrong: 1        │          │ │
│ │  └────────────────┘  └──────────────────┘          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │             QuestionDisplay                         │ │
│ │  (Conditional Rendering)                            │ │
│ │                                                      │ │
│ │  IF questionType === 'multiple':                   │ │
│ │  ┌──────────────────────────────────────────────┐  │ │
│ │  │      MultipleChoiceQuestion                   │  │ │
│ │  │                                               │  │ │
│ │  │  Definition: "The quality of being honest"   │  │ │
│ │  │                                               │  │ │
│ │  │  ┌──────────┐  ┌──────────┐                 │  │ │
│ │  │  │ integrity│  │ deception│                 │  │ │
│ │  │  └──────────┘  └──────────┘                 │  │ │
│ │  │                                               │  │ │
│ │  │  ┌──────────┐  ┌──────────┐                 │  │ │
│ │  │  │ falsehood│  │ dishonest│                 │  │ │
│ │  │  └──────────┘  └──────────┘                 │  │ │
│ │  └──────────────────────────────────────────────┘  │ │
│ │                                                      │ │
│ │  IF questionType === 'fillin':                     │ │
│ │  ┌──────────────────────────────────────────────┐  │ │
│ │  │       FillInBlankQuestion                     │  │ │
│ │  │                                               │  │ │
│ │  │  Sentence: "The lawyer showed great ___      │  │ │
│ │  │             throughout the trial."           │  │ │
│ │  │                                               │  │ │
│ │  │  ┌──────────────────────────────────────┐    │  │ │
│ │  │  │  [User Input Field]                  │    │  │ │
│ │  │  └──────────────────────────────────────┘    │  │ │
│ │  │                                               │  │ │
│ │  │  ┌────────────┐  ┌────────────┐             │  │ │
│ │  │  │ 💡 Hint    │  │ ✓ Submit   │             │  │ │
│ │  │  └────────────┘  └────────────┘             │  │ │
│ │  └──────────────────────────────────────────────┘  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │              AnswerFeedback                         │ │
│ │  (Animated fade in/out)                             │ │
│ │                                                      │ │
│ │  ✓ Correct!   or   ✗ Wrong!                        │ │
│ └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## State Management Architecture

### Zustand Store Structure

```
┌────────────────────────────────────────────────────────┐
│                 Global State (Zustand)                  │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │         vocabularyStore                         │   │
│  │  • lists: VocabularyList[]                     │   │
│  │  • selectedList: string | null                 │   │
│  │  • selectedLevel: string | null                │   │
│  │  • loadVocabulary()                            │   │
│  │  • selectList(id)                              │   │
│  │  • selectLevel(id)                             │   │
│  │  • getWordsByListLevel()                       │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │            quizStore                            │   │
│  │  • currentSession: QuizSession | null          │   │
│  │  • currentQuestion: QuizQuestion | null        │   │
│  │  • startQuiz(listId, levelId)                  │   │
│  │  • getNextQuestion()                           │   │
│  │  • submitAnswer(answer)                        │   │
│  │  • useHint()                                   │   │
│  │  • endQuiz()                                   │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │          progressStore                          │   │
│  │  • userProgress: UserProgress                  │   │
│  │  • getWordProgress(wordId)                     │   │
│  │  • updateWordProgress(wordId, state)           │   │
│  │  • incrementHints()                            │   │
│  │  • incrementWrong()                            │   │
│  │  • getBestScore(listLevelId)                   │   │
│  │  • updateBestScore()                           │   │
│  │  • resetListProgress(listLevelId)              │   │
│  │  • saveProgress() → AsyncStorage               │   │
│  │  • loadProgress() ← AsyncStorage               │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │      adaptiveDifficultyStore                    │   │
│  │  • multipleChoiceAccuracy: number              │   │
│  │  • fillInBlankAccuracy: number                 │   │
│  │  • calculateAccuracy()                         │   │
│  │  • getOptimalQuestionType(wordState)           │   │
│  │  • updatePerformance(type, correct)            │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │           settingsStore                         │   │
│  │  • theme: 'light' | 'dark' | 'auto'           │   │
│  │  • soundEnabled: boolean                       │   │
│  │  • hapticsEnabled: boolean                     │   │
│  │  • toggleTheme()                               │   │
│  │  • toggleSound()                               │   │
│  │  • toggleHaptics()                             │   │
│  │  • saveSettings() → AsyncStorage               │   │
│  │  • loadSettings() ← AsyncStorage               │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action
    │
    ▼
React Component
    │
    ├──── Read State ────► Zustand Store ────► Render UI
    │
    └──── Update State ──► Zustand Store
                              │
                              ├──── Business Logic ────► Update State
                              │
                              └──── Persist ────► AsyncStorage
```

---

## Quiz Logic Flow

### Question Type Selection (Adaptive)

```
┌─────────────────────────────────────────────────────────┐
│              getNextQuestion()                           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │ Get Word State  │
         └────────┬────────┘
                  │
        ┌─────────┼─────────┬─────────┐
        │         │         │         │
        ▼         ▼         ▼         ▼
     State 0   State 1   State 2   State 3
        │         │         │         │
        │         ▼         ▼         └───► Word Complete
        │    Fill-in    Multiple          (Skip)
        │      Only      Only
        │
        ▼
  ┌───────────────────┐
  │ Adaptive Logic    │
  └─────────┬─────────┘
            │
   ┌────────┴────────┐
   │                 │
   ▼                 ▼
Multiple Choice   Fill-in-Blank
   70%                30%
(if MC accuracy > 80%)

   OR

   30%                70%
(if FIB accuracy < 50%)

   OR

   50%                50%
(balanced performance)
```

### Answer Validation Flow

```
┌──────────────────────────────────────────────────────┐
│            submitAnswer(userAnswer)                   │
└───────────────────┬──────────────────────────────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
   Multiple Choice      Fill-in-Blank
          │                   │
          ▼                   ▼
   ┌─────────────┐    ┌──────────────────┐
   │ Exact Match │    │ Normalize Input  │
   └──────┬──────┘    │ (trim, lowercase)│
          │           └────────┬─────────┘
          │                    │
          │           ┌────────┴────────┬────────────┬──────────┐
          │           │                 │            │          │
          │           ▼                 ▼            ▼          ▼
          │      Exact Match    Typo Tolerance  Variations  Synonyms
          │           │          (Levenshtein)  (s,ed,ing)  (Optional)
          │           │                 │            │          │
          │           └─────────┬───────┴────────────┴──────────┘
          │                     │
          └─────────┬───────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      ✓ CORRECT           ✗ WRONG
          │                   │
          ▼                   ▼
   Update Word State    Increment Wrong
   (0→1, 0→2, etc.)     Track Performance
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
          Update Progress Store
                    │
                    ▼
           Save to AsyncStorage
                    │
                    ▼
          Show Feedback Animation
```

### Word State Progression

```
State 0 (New Word)
    │
    ├──── Multiple Choice (correct) ──► State 1
    │
    └──── Fill-in-Blank (correct) ────► State 2

State 1 (Partial)
    │
    └──── Fill-in-Blank (correct) ────► State 3

State 2 (Partial)
    │
    └──── Multiple Choice (correct) ──► State 3

State 3 (Mastered)
    │
    └──── Complete! (No more questions for this word)
```

---

## Data Models - Visual Reference

### Vocabulary Data Structure

```
VocabularyData
│
└─── lists: []
      │
      ├─── VocabularyList (List A)
      │     │
      │     ├─── id: "list-a"
      │     ├─── name: "List A"
      │     └─── levels: []
      │           │
      │           ├─── VocabularyLevel (Basic)
      │           │     │
      │           │     ├─── id: "basic"
      │           │     ├─── name: "Basic"
      │           │     └─── words: []
      │           │           │
      │           │           ├─── VocabularyWord
      │           │           │     ├─── id: "word-1"
      │           │           │     ├─── word: "integrity"
      │           │           │     ├─── definition: "The quality..."
      │           │           │     ├─── fillInBlank: "The lawyer..."
      │           │           │     ├─── examples: []
      │           │           │     └─── synonyms: []
      │           │           │
      │           │           └─── ... (7-9 more words)
      │           │
      │           ├─── VocabularyLevel (Intermediate)
      │           ├─── VocabularyLevel (Advanced)
      │           ├─── VocabularyLevel (Expert)
      │           └─── VocabularyLevel (Professional)
      │
      ├─── VocabularyList (List B)
      ├─── VocabularyList (List C)
      └─── ... (Lists D-H)
```

### User Progress Structure

```
UserProgress
│
├─── currentListId: "list-a"
├─── currentLevelId: "basic"
│
├─── listLevelProgress: {}
│     │
│     ├─── "list-a-basic": ListLevelProgress
│     │     │
│     │     ├─── wordProgress: {}
│     │     │     │
│     │     │     ├─── "word-1": WordProgress
│     │     │     │     ├─── state: 2
│     │     │     │     ├─── hintsUsed: 1
│     │     │     │     ├─── wrongAttempts: 2
│     │     │     │     ├─── correctAttempts: 3
│     │     │     │     ├─── lastAttemptDate: "2025-11-08T10:30:00Z"
│     │     │     │     └─── correctStreak: 2
│     │     │     │
│     │     │     └─── "word-2": WordProgress ...
│     │     │
│     │     ├─── sessionStats: {}
│     │     │     ├─── hintsUsed: 3
│     │     │     ├─── wrongAnswers: 5
│     │     │     └─── startedAt: "2025-11-08T10:00:00Z"
│     │     │
│     │     └─── bestScore: {}
│     │           ├─── hints: 2
│     │           ├─── wrong: 3
│     │           └─── completedAt: "2025-11-07T15:00:00Z"
│     │
│     └─── "list-a-intermediate": ListLevelProgress ...
│
├─── globalStats: {}
│     ├─── allTimeHints: 45
│     ├─── allTimeWrong: 78
│     ├─── allTimeCorrect: 245
│     ├─── totalWordsLearned: 80
│     ├─── listsCompleted: ["list-a-basic", "list-a-intermediate"]
│     ├─── currentStreak: 5
│     ├─── longestStreak: 12
│     └─── lastPracticeDate: "2025-11-08"
│
└─── achievements: []
      ├─── Achievement
      │     ├─── id: "first-list-complete"
      │     ├─── name: "First Victory"
      │     ├─── description: "Complete your first list"
      │     └─── unlockedAt: "2025-11-07T15:00:00Z"
      │
      └─── Achievement ...
```

---

## Component Lifecycle & Hooks

### Quiz Screen Lifecycle

```
QuizScreen Mounts
    │
    ▼
useEffect (on mount)
    │
    ├──► Load Vocabulary (vocabularyStore)
    ├──► Load User Progress (progressStore)
    ├──► Start Quiz Session (quizStore)
    └──► Get First Question (quizStore)
    │
    ▼
Render Question
    │
    ▼
User Interaction
    │
    ├──► Submit Answer
    │     │
    │     ├──► Validate Answer
    │     ├──► Update Progress
    │     ├──► Show Feedback
    │     └──► Get Next Question
    │
    ├──► Use Hint
    │     │
    │     ├──► Show Definition
    │     └──► Increment Hint Count
    │
    └──► All Questions Complete
          │
          ▼
    Navigate to Graduation Screen
```

### Custom Hooks

```typescript
// useQuiz.ts
export function useQuiz(listId: string, levelId: string) {
  const quizStore = useQuizStore();
  const progressStore = useProgressStore();
  const adaptiveStore = useAdaptiveDifficultyStore();

  useEffect(() => {
    quizStore.startQuiz(listId, levelId);
  }, [listId, levelId]);

  const submitAnswer = useCallback((answer: string) => {
    const isCorrect = quizStore.submitAnswer(answer);
    adaptiveStore.updatePerformance(
      quizStore.currentQuestion.type,
      isCorrect
    );
    if (isCorrect) {
      progressStore.updateWordProgress(
        quizStore.currentQuestion.word.id
      );
    } else {
      progressStore.incrementWrong();
    }
  }, [quizStore, adaptiveStore, progressStore]);

  return {
    currentQuestion: quizStore.currentQuestion,
    progress: progressStore.getCurrentProgress(),
    submitAnswer,
    useHint: quizStore.useHint,
    isComplete: quizStore.isComplete
  };
}
```

---

## Navigation Structure

```
NavigationContainer
│
└─── Stack Navigator
      │
      ├─── HomeScreen
      │     Route: "/"
      │     Params: none
      │
      ├─── DifficultyScreen
      │     Route: "/difficulty"
      │     Params: { listId: string }
      │
      ├─── QuizScreen
      │     Route: "/quiz"
      │     Params: { listId: string, levelId: string }
      │
      ├─── GraduationScreen
      │     Route: "/graduation"
      │     Params: {
      │       listId: string,
      │       levelId: string,
      │       stats: {
      │         hints: number,
      │         wrong: number,
      │         bestHints: number,
      │         bestWrong: number
      │       }
      │     }
      │
      ├─── StatsScreen
      │     Route: "/stats"
      │     Params: none
      │
      └─── SettingsScreen
            Route: "/settings"
            Params: none
```

---

## Theming System

### React Native Paper Theme Structure

```typescript
const theme = {
  ...MD3LightTheme,
  colors: {
    primary: '#6750A4',          // Primary brand color
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',

    secondary: '#625B71',        // Secondary actions
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',

    tertiary: '#7D5260',         // Accent
    onTertiary: '#FFFFFF',

    error: '#B3261E',            // Error states
    onError: '#FFFFFF',

    background: '#FFFBFE',       // App background
    onBackground: '#1C1B1F',

    surface: '#FFFBFE',          // Card backgrounds
    onSurface: '#1C1B1F',

    surfaceVariant: '#E7E0EC',   // Alternative surfaces
    onSurfaceVariant: '#49454F',

    outline: '#79747E',          // Borders
    outlineVariant: '#CAC4D0',

    // Custom colors for quiz
    correct: '#4CAF50',          // Correct answer feedback
    wrong: '#F44336',            // Wrong answer feedback
    hint: '#FF9800'              // Hint button
  },
  fonts: {
    ...configureFonts({ config: fontConfig }),
  }
};
```

---

## Performance Optimization Strategy

### Memoization Points

```typescript
// Expensive computations
const wordProgress = useMemo(() =>
  calculateProgress(userProgress, currentList),
  [userProgress, currentList]
);

// Callbacks passed to child components
const handleAnswerSubmit = useCallback((answer: string) => {
  submitAnswer(answer);
}, [submitAnswer]);

// Component memoization
export const QuizQuestion = React.memo(({ question, onSubmit }) => {
  // ...
});
```

### Virtualization

```typescript
// For long lists (future: if lists exceed 20 items)
<FlashList
  data={vocabularyLists}
  renderItem={renderListCard}
  estimatedItemSize={100}
/>
```

---

## Testing Strategy

### Test Pyramid

```
         ┌────────────┐
         │    E2E     │  (5-10%)
         │ Critical   │  Full user flows
         │   Paths    │
         └────────────┘
              │
       ┌──────▼──────────┐
       │  Integration    │  (20-30%)
       │     Tests       │  Feature interactions
       │  (Quiz Flow)    │
       └─────────────────┘
              │
    ┌─────────▼─────────────┐
    │     Unit Tests        │  (60-70%)
    │  (Business Logic,     │  Pure functions
    │   Validation, etc.)   │  Store logic
    └───────────────────────┘
```

### Key Test Cases

**Unit Tests:**
- Answer validation logic
- Levenshtein distance calculation
- Word state progression
- Adaptive difficulty algorithm
- Data transformation (XML → JSON)

**Integration Tests:**
- Quiz flow (start → questions → completion)
- Progress persistence
- Store interactions

**E2E Tests:**
- Complete a list (basic → graduation)
- Use hint functionality
- Reset progress

---

## Deployment Pipeline

```
Code Push
    │
    ▼
Git Commit
    │
    ▼
CI/CD (GitHub Actions)
    │
    ├──► Lint & Type Check
    ├──► Run Tests
    └──► Build Check
    │
    ▼
Merge to Main
    │
    ▼
EAS Build
    │
    ├──► Android (AAB)
    ├──► iOS (IPA)
    └──► Web (Static)
    │
    ▼
Review & Test
    │
    ├──► Internal Testing (TestFlight, Internal Track)
    └──► QA Approval
    │
    ▼
Submit to Stores
    │
    ├──► Google Play Store
    ├──► Apple App Store
    └──► Web Hosting (Vercel/Netlify)
```

---

## Summary

This architecture provides:

✅ **Scalability:** Feature-sliced design allows easy feature additions
✅ **Maintainability:** Clear separation of concerns
✅ **Type Safety:** TypeScript throughout
✅ **Performance:** Optimized with memoization and proper state management
✅ **Cross-Platform:** Single codebase for Android, iOS, Web
✅ **Testability:** Clear boundaries for unit and integration tests
✅ **Extensibility:** Plugin architecture for new content and features

**Next:** Review architecture and approve before proceeding to Phase 1 implementation.
