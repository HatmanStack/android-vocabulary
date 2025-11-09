# Phase 0: Foundation & Architecture

## Overview

This phase document serves as the foundational reference for all implementation phases. It contains architectural decisions, design patterns, tech stack rationale, and shared conventions that apply throughout the migration. **Read this document completely before starting Phase 1.**

This is not an implementation phase—it's a reference document. You should refer back to this document whenever you need clarification on:
- Why certain technologies were chosen
- How to structure components or files
- What patterns to follow for common scenarios
- How to avoid known pitfalls

---

## Architecture Decisions (ADRs)

### ADR-001: Feature-Sliced Design Architecture

**Decision:** Use feature-sliced design for project structure

**Context:**
The original Android app is monolithic (all code in MainActivity.java). For the React Native migration, we need a scalable, maintainable architecture that separates concerns and enables parallel development.

**Rationale:**
- **Separation of Concerns**: Features are self-contained modules
- **Scalability**: Easy to add new features without affecting existing code
- **Testability**: Each feature can be tested independently
- **Team Collaboration**: Multiple developers can work on different features
- **Clear Boundaries**: Shared code vs. feature-specific code is explicit

**Structure:**
```
src/
├── app/                    # Application initialization
│   ├── App.tsx            # Root component
│   ├── navigation.tsx     # Navigation configuration
│   └── providers.tsx      # Global providers (theme, store)
├── features/              # Feature modules
│   ├── quiz/             # Quiz functionality
│   ├── vocabulary/       # Vocabulary data management
│   ├── progress/         # Progress tracking
│   └── settings/         # App settings
├── shared/               # Shared across features
│   ├── ui/              # Reusable UI components
│   ├── lib/             # Utilities and helpers
│   ├── store/           # Global state stores
│   └── types/           # TypeScript type definitions
└── assets/               # Static assets (JSON, images)
```

**Consequences:**
- **Positive**: Clear code organization, easy to navigate
- **Positive**: Prevents circular dependencies
- **Negative**: More boilerplate than flat structure
- **Mitigation**: Document conventions clearly (this file)

---

### ADR-002: React Native Paper for UI Components

**Decision:** Use React Native Paper as the primary UI component library

**Context:**
Need a comprehensive, cross-platform UI library that provides consistent Material Design components for Android, iOS, and Web.

**Rationale:**
- **Material Design 3**: Modern, polished design system
- **Cross-Platform**: Works identically on Android, iOS, Web
- **Comprehensive**: 40+ components covering most UI needs
- **Accessibility**: Built-in accessibility features (screen readers, keyboard navigation)
- **Theming**: Robust theming system with dark mode support
- **Active Maintenance**: Well-maintained by Callstack
- **Documentation**: Excellent documentation and examples

**Alternatives Considered:**
- **NativeBase**: Good but larger bundle size
- **UI Kitten**: Less popular, smaller community
- **Custom Components**: Too much work, reinventing the wheel

**Consequences:**
- **Positive**: Faster development, consistent UI
- **Positive**: Less custom styling needed
- **Negative**: Dependency on external library
- **Negative**: Learning curve for library-specific props
- **Mitigation**: Reference React Native Paper docs frequently

---

### ADR-003: Zustand for State Management

**Decision:** Use Zustand for global state management

**Context:**
Need lightweight, performant state management for quiz state, user progress, vocabulary data, and app settings. Must work seamlessly with React hooks and support persistence.

**Rationale:**
- **Lightweight**: Small bundle size (~1KB gzipped)
- **Simple API**: Minimal boilerplate compared to Redux
- **Performance**: Optimized re-renders, no Context API overhead
- **TypeScript Support**: Excellent type inference
- **DevTools**: React DevTools integration
- **Middleware**: Supports persistence, logging, etc.
- **Learning Curve**: Easy to learn and understand

**Alternatives Considered:**
- **Redux**: Too much boilerplate for this app's complexity
- **MobX**: More magic, harder to debug
- **Context API**: Performance issues with frequent updates
- **Jotai/Recoil**: Atomic state not needed here

**Store Structure:**
```typescript
// Separate stores for different concerns
vocabularyStore    // Vocabulary data loading and selection
quizStore          // Active quiz session state
progressStore      // User progress and statistics
adaptiveDifficultyStore  // Adaptive difficulty algorithm
settingsStore      // App settings (theme, sound, etc.)
```

**Consequences:**
- **Positive**: Clean, maintainable state logic
- **Positive**: Easy to test stores independently
- **Negative**: Multiple stores to coordinate
- **Mitigation**: Clear store boundaries and documentation

---

### ADR-004: Static JSON for Vocabulary Data

**Decision:** Store vocabulary data as static JSON files bundled with the app

**Context:**
The Android app has 300+ words hardcoded in XML resources. Need to decide between static bundled data vs. remote data fetching.

**Rationale:**
- **Offline-First**: App works without internet connection
- **Simple**: No backend infrastructure needed
- **Fast**: No network latency on app launch
- **Version Control**: Data changes tracked in git
- **Plug-and-Play**: Adding new lists is just creating a JSON file
- **Current Requirements**: No user-generated content or dynamic updates

**Data Format:**
```json
{
  "id": "list-a",
  "name": "List A",
  "levels": [
    {
      "id": "basic",
      "name": "Basic",
      "words": [
        {
          "id": "a-basic-1",
          "word": "abject",
          "definition": "...",
          "fillInBlank": "Timmy was _____ after..."
        }
      ]
    }
  ]
}
```

**Future Migration Path:**
- Can evolve to remote data fetching later
- Would add `vocabularySync` module to fetch and cache
- Backward compatible with static data

**Consequences:**
- **Positive**: Simple, reliable, fast
- **Positive**: No backend costs or maintenance
- **Negative**: Content updates require app release
- **Negative**: Cannot A/B test content
- **Mitigation**: Plan for remote data in Phase 7+ (future)

---

### ADR-005: AsyncStorage for Persistence

**Decision:** Use AsyncStorage for persisting user progress and settings

**Context:**
The Android app uses SharedPreferences to store user progress, scores, and settings. Need an equivalent for React Native.

**Rationale:**
- **Standard Solution**: Official React Native community package
- **Cross-Platform**: Works on Android, iOS, Web (localStorage)
- **Simple API**: Key-value storage similar to SharedPreferences
- **Zustand Integration**: Easy to integrate with Zustand middleware
- **Reliable**: Battle-tested in production apps
- **Migration Path**: Can upgrade to SQLite later if needed

**Usage Pattern:**
```typescript
// Store serialization
const persistedStore = persist(
  (set) => ({
    // store state
  }),
  {
    name: 'vocabulary-storage',
    storage: createJSONStorage(() => AsyncStorage),
  }
);
```

**Alternatives Considered:**
- **SQLite**: Overkill for simple key-value data
- **Realm**: Too heavy for this use case
- **expo-secure-store**: Only needed for sensitive data

**Consequences:**
- **Positive**: Simple, works everywhere
- **Positive**: Easy migration from SharedPreferences
- **Negative**: Performance issues with very large data (not applicable here)
- **Mitigation**: Keep data structures simple and flat

---

### ADR-006: TypeScript for Type Safety

**Decision:** Use TypeScript throughout the entire codebase

**Context:**
The original Android app is Java (statically typed). React Native supports both JavaScript and TypeScript.

**Rationale:**
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring, inline documentation
- **Self-Documenting**: Types serve as documentation
- **Maintainability**: Easier to refactor with confidence
- **Team Collaboration**: Clear interfaces and contracts
- **Industry Standard**: Most modern React Native projects use TypeScript

**Configuration:**
- Strict mode enabled (`strict: true`)
- No implicit `any` types
- Exhaustive type checking for switch statements
- Path aliases for cleaner imports

**Type Organization:**
```
src/shared/types/
├── vocabulary.ts    # Vocabulary data types
├── progress.ts      # User progress types
├── quiz.ts          # Quiz session types
├── navigation.ts    # Navigation types
└── index.ts         # Re-export all types
```

**Consequences:**
- **Positive**: Fewer runtime errors
- **Positive**: Better developer experience
- **Negative**: Learning curve for engineers unfamiliar with TypeScript
- **Negative**: More verbose code
- **Mitigation**: Provide clear type examples in this doc

---

### ADR-007: React Navigation for Navigation

**Decision:** Use React Navigation (Stack Navigator) for screen navigation

**Context:**
Need navigation between screens (Home → Difficulty → Quiz → Graduation). Must work on all platforms.

**Rationale:**
- **Industry Standard**: Most popular React Native navigation library
- **Cross-Platform**: Works on Android, iOS, Web
- **TypeScript Support**: Excellent type safety for routes and params
- **Customizable**: Can customize transitions and animations
- **Deep Linking**: Supports deep links and URL routing (for web)
- **State Management**: Integrates well with state management libraries

**Navigation Structure:**
```typescript
type RootStackParamList = {
  Home: undefined;
  Difficulty: { listId: string };
  Quiz: { listId: string; levelId: string };
  Graduation: { listId: string; levelId: string; stats: SessionStats };
  Stats: undefined;
  Settings: undefined;
};
```

**Alternatives Considered:**
- **Expo Router**: Too opinionated, file-based routing not needed
- **React Router**: Not designed for mobile

**Consequences:**
- **Positive**: Mature, well-documented solution
- **Positive**: Works seamlessly across platforms
- **Negative**: Bundle size impact (~50KB)
- **Mitigation**: Tree-shaking removes unused navigators

---

### ADR-008: Expo Managed Workflow

**Decision:** Use Expo managed workflow (not bare React Native)

**Context:**
Need to build for Android, iOS, and Web. Expo provides managed builds and over-the-air updates.

**Rationale:**
- **Simplified Setup**: No need for Xcode/Android Studio setup
- **Cross-Platform**: Single codebase for all platforms
- **EAS Build**: Cloud builds for iOS/Android without Mac
- **OTA Updates**: Push JavaScript updates without app store review
- **Rich Ecosystem**: 50+ built-in modules (camera, sensors, etc.)
- **Web Support**: Built-in web compilation
- **Maintenance**: Expo team handles native updates

**When to Eject (Future):**
- Need custom native modules not in Expo
- Need fine-grained control over native code
- Performance-critical native operations

**Consequences:**
- **Positive**: Faster development, easier deployment
- **Positive**: No native code management
- **Negative**: Slightly larger app size than bare React Native
- **Negative**: Limited to Expo modules (rarely a problem)
- **Mitigation**: Use expo-dev-client for custom native modules if needed

---

## Design Decisions

### Component Design Principles

**1. Composition Over Inheritance**
- Prefer composition using props and children
- Avoid class components (use functional components + hooks)
- Example:
  ```typescript
  // Good: Composition
  <Card>
    <Card.Title>Quiz Score</Card.Title>
    <Card.Content>{score}</Card.Content>
  </Card>

  // Avoid: Inheritance or complex prop drilling
  <ScoreCard score={score} title="Quiz Score" />
  ```

**2. Single Responsibility Principle**
- Each component should have one clear purpose
- Split complex components into smaller pieces
- Example:
  ```typescript
  // QuizScreen.tsx (orchestration)
  // MultipleChoiceQuestion.tsx (question type)
  // FillInBlankQuestion.tsx (question type)
  // QuizHeader.tsx (header display)
  ```

**3. Presentational vs. Container Components**
- **Presentational**: Receive data via props, focus on rendering
- **Container**: Connect to stores, handle business logic
- Keep presentational components pure when possible

**4. Prop Drilling Limits**
- Maximum 2-3 levels of prop drilling
- Beyond that, use Zustand store or Context
- Exception: Theming (handled by React Native Paper)

### State Management Patterns

**1. Zustand Store Pattern**

Each store follows this structure:
```typescript
interface StoreState {
  // Data
  data: DataType;

  // Computed/Derived state (use selectors)
  // Actions
  loadData: () => Promise<void>;
  updateData: (data: DataType) => void;
  resetData: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  data: initialData,

  loadData: async () => {
    const data = await fetchData();
    set({ data });
  },

  updateData: (data) => set({ data }),

  resetData: () => set({ data: initialData }),
}));
```

**2. Selector Pattern**
Avoid re-renders by selecting only needed state:
```typescript
// Bad: Component re-renders on ANY store change
const { data, loadData, updateData } = useStore();

// Good: Component only re-renders when data changes
const data = useStore((state) => state.data);
const loadData = useStore((state) => state.loadData);
```

**3. Async Action Pattern**
Handle loading and error states:
```typescript
interface StoreWithAsync {
  isLoading: boolean;
  error: string | null;

  fetchData: () => Promise<void>;
}

const useStore = create<StoreWithAsync>((set) => ({
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.fetchData();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

### Data Flow Architecture

```
User Interaction
      ↓
React Component
      ↓
Zustand Action (set, get)
      ↓
Business Logic / Validation
      ↓
State Update
      ↓
AsyncStorage Persistence (via middleware)
      ↓
Re-render (only affected components)
```

### Error Handling Strategy

**1. Store-Level Errors**
```typescript
interface ErrorState {
  error: string | null;
  clearError: () => void;
}

// In actions
try {
  // operation
} catch (error) {
  set({ error: error.message });
}
```

**2. Component-Level Errors**
```typescript
// Use React Error Boundaries for critical errors
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

**3. Input Validation**
- Validate user input before processing
- Show inline errors near input fields
- Never crash on bad input

---

## Tech Stack Rationale

### Core Dependencies

| Package | Version | Purpose | Why Chosen |
|---------|---------|---------|------------|
| `expo` | 51+ | Framework | Cross-platform support, managed builds, OTA updates |
| `react-native` | 0.74+ | UI Framework | Industry standard for mobile development |
| `typescript` | 5.x | Type System | Type safety, better DX, fewer runtime errors |
| `react-native-paper` | 5.x | UI Library | Material Design 3, comprehensive components |
| `zustand` | 4.x | State Management | Lightweight, simple API, great performance |
| `@react-native-async-storage/async-storage` | Latest | Persistence | Standard key-value storage for React Native |
| `@react-navigation/native` | 6.x | Navigation | Industry standard, cross-platform navigation |
| `@react-navigation/stack` | 6.x | Stack Navigator | iOS/Android-style stack navigation |
| `react-native-reanimated` | 3.x | Animations | High-performance animations (60fps) |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/*` | Latest | TypeScript type definitions |
| `eslint` | 8.x | Code linting |
| `prettier` | 3.x | Code formatting |
| `jest` | 29.x | Testing framework |
| `@testing-library/react-native` | Latest | Component testing |
| `@testing-library/jest-native` | Latest | Jest matchers for React Native |

### Optional Enhancements (Phase 5)

| Package | Purpose |
|---------|---------|
| `expo-haptics` | Haptic feedback on interactions |
| `react-native-chart-kit` | Progress visualization charts |
| `react-native-svg` | Custom graphics and charts |

---

## Shared Patterns and Conventions

### File Naming Conventions

```
Components:     PascalCase.tsx        (e.g., QuizScreen.tsx)
Utilities:      camelCase.ts          (e.g., levenshtein.ts)
Types:          camelCase.ts          (e.g., vocabulary.ts)
Stores:         camelCaseStore.ts     (e.g., quizStore.ts)
Constants:      UPPER_SNAKE_CASE.ts   (e.g., COLORS.ts)
Tests:          *.test.ts(x)          (e.g., QuizScreen.test.tsx)
```

### Directory Structure Conventions

```
feature/
├── components/       # Feature-specific components
├── hooks/           # Feature-specific custom hooks
├── utils/           # Feature-specific utilities
├── types/           # Feature-specific types (if complex)
├── screens/         # Screen components for this feature
└── __tests__/       # Feature tests
```

### Import Order Convention

```typescript
// 1. External dependencies
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

// 2. Internal shared modules
import { useVocabularyStore } from '@/shared/store/vocabularyStore';
import { VocabularyWord } from '@/shared/types';
import { Card } from '@/shared/ui/Card';

// 3. Feature-specific modules
import { QuizHeader } from '../components/QuizHeader';
import { useQuiz } from '../hooks/useQuiz';

// 4. Relative imports
import { styles } from './styles';
```

Configure path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/features/*": ["./src/features/*"]
    }
  }
}
```

### Custom Hooks Pattern

**Naming:** Use `use` prefix (e.g., `useQuiz`, `useVocabulary`)

**Structure:**
```typescript
export function useQuiz(listId: string, levelId: string) {
  // 1. State/Store hooks
  const quizState = useQuizStore();

  // 2. Derived state/memoization
  const currentProgress = useMemo(() => {
    return calculateProgress(quizState);
  }, [quizState]);

  // 3. Callbacks
  const submitAnswer = useCallback((answer: string) => {
    // logic
  }, [dependencies]);

  // 4. Effects
  useEffect(() => {
    quizState.startQuiz(listId, levelId);
  }, [listId, levelId]);

  // 5. Return API
  return {
    currentQuestion: quizState.currentQuestion,
    progress: currentProgress,
    submitAnswer,
  };
}
```

### Testing Patterns

**1. Component Test Structure**
```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Reset stores, mocks
  });

  // Rendering tests
  it('renders correctly', () => {
    // snapshot or structure test
  });

  // Interaction tests
  it('handles user interaction', () => {
    // user event simulation
  });

  // State tests
  it('updates state correctly', () => {
    // state verification
  });
});
```

**2. Store Test Structure**
```typescript
describe('StoreStore', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.data).toEqual(defaultData);
  });

  it('updates state via action', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.updateData(newData);
    });
    expect(result.current.data).toEqual(newData);
  });
});
```

**3. Utility Function Tests**
```typescript
describe('utilityFunction', () => {
  it('handles normal input', () => {
    expect(utilityFunction(input)).toBe(expectedOutput);
  });

  it('handles edge cases', () => {
    expect(utilityFunction(edgeCase)).toBe(edgeCaseOutput);
  });

  it('throws on invalid input', () => {
    expect(() => utilityFunction(invalid)).toThrow();
  });
});
```

---

## Common Pitfalls to Avoid

### 1. **Infinite Re-render Loops**

**Problem:** Creating new objects/functions in render causes infinite loops

```typescript
// BAD: Creates new object every render
function Component() {
  const store = useStore();
  const config = { listId: 'a', levelId: 'basic' }; // New object each time

  useEffect(() => {
    store.load(config);
  }, [config]); // Re-runs every render!
}

// GOOD: Memoize or use primitive dependencies
function Component() {
  const store = useStore();
  const listId = 'a';
  const levelId = 'basic';

  useEffect(() => {
    store.load({ listId, levelId });
  }, [listId, levelId]); // Only re-runs if primitives change
}
```

### 2. **Async State Updates After Unmount**

**Problem:** Setting state on unmounted components causes warnings

```typescript
// BAD: May set state after unmount
useEffect(() => {
  fetchData().then(data => {
    setData(data); // Component might be unmounted!
  });
}, []);

// GOOD: Check if mounted
useEffect(() => {
  let isMounted = true;

  fetchData().then(data => {
    if (isMounted) {
      setData(data);
    }
  });

  return () => {
    isMounted = false;
  };
}, []);
```

### 3. **Not Handling Loading States**

**Problem:** Users see stale data or empty screens

```typescript
// BAD: No loading indicator
function Component() {
  const data = useStore(state => state.data);
  return <View>{data.map(...)}</View>;
}

// GOOD: Show loading state
function Component() {
  const { data, isLoading } = useStore();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <View>{data.map(...)}</View>;
}
```

### 4. **Mutating State Directly**

**Problem:** Zustand won't detect changes

```typescript
// BAD: Mutates state
const store = useStore();
store.data.push(newItem); // Won't trigger re-render!

// GOOD: Create new array
const store = useStore();
store.setData([...store.data, newItem]);

// BETTER: Use Zustand action
store.addItem(newItem);
```

### 5. **Forgetting to Cleanup**

**Problem:** Memory leaks, stale listeners

```typescript
// BAD: No cleanup
useEffect(() => {
  const interval = setInterval(() => {
    // do something
  }, 1000);
}, []);

// GOOD: Cleanup on unmount
useEffect(() => {
  const interval = setInterval(() => {
    // do something
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### 6. **Not Using Keys in Lists**

**Problem:** React can't efficiently update lists

```typescript
// BAD: No key or index as key
{words.map((word, index) => (
  <WordCard word={word} />
))}

// GOOD: Unique, stable keys
{words.map((word) => (
  <WordCard key={word.id} word={word} />
))}
```

### 7. **Inline Function Definitions in Render**

**Problem:** Creates new function every render, breaks memoization

```typescript
// BAD: New function every render
<Button onPress={() => submitAnswer(answer)} />

// GOOD: Memoized callback
const handlePress = useCallback(() => {
  submitAnswer(answer);
}, [answer]);

<Button onPress={handlePress} />
```

### 8. **Over-fetching Store State**

**Problem:** Component re-renders unnecessarily

```typescript
// BAD: Component re-renders on ANY store change
const store = useStore();
const { data } = store;

// GOOD: Component only re-renders when needed data changes
const data = useStore(state => state.data);
const loadData = useStore(state => state.loadData);
```

---

## Testing Strategy Overview

### Test Coverage Goals
- **Unit Tests**: >90% coverage for utilities and business logic
- **Component Tests**: >80% coverage for UI components
- **Integration Tests**: Critical user flows (complete quiz, reset progress)
- **E2E Tests**: Not required (covered by manual testing)

### Test Pyramid
```
       /\
      /  \
     / E2E \      <- Manual testing (Phase 6)
    /--------\
   /   Intg   \   <- 10-20 integration tests
  /------------\
 /     Unit     \ <- 100+ unit tests
/----------------\
```

### What to Test

**Always Test:**
- Business logic (answer validation, progress calculation)
- Data transformations (JSON parsing, state updates)
- Edge cases (empty input, invalid data)
- User interactions (button presses, form submissions)

**Sometimes Test:**
- Simple presentational components (if complex logic)
- Styling (snapshot tests for critical screens)

**Don't Test:**
- Third-party libraries (trust React Native Paper, Zustand, etc.)
- Auto-generated code
- Simple getters/setters without logic

### Test File Location
```
src/
├── features/
│   └── quiz/
│       ├── components/
│       │   └── MultipleChoice.tsx
│       ├── utils/
│       │   └── answerValidator.ts
│       └── __tests__/
│           ├── MultipleChoice.test.tsx
│           └── answerValidator.test.ts
```

---

## Performance Guidelines

### 1. **Use React.memo for Expensive Components**
```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // Complex rendering logic
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.data.id === nextProps.data.id;
});
```

### 2. **Virtualize Long Lists**
Not needed for this app (max 10 words per list), but for future:
```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={100}
/>
```

### 3. **Optimize Images**
- Use WebP format when possible
- Provide multiple resolutions
- Lazy load off-screen images

### 4. **Debounce/Throttle Expensive Operations**
```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => {
    performSearch(value);
  },
  500
);
```

### 5. **Avoid Anonymous Functions in Render**
Already covered in "Common Pitfalls" - use `useCallback`

---

## Accessibility Guidelines

### 1. **Semantic Labels**
```typescript
<Button
  accessibilityLabel="Submit answer"
  accessibilityHint="Double tap to submit your answer"
>
  Submit
</Button>
```

### 2. **Touchable Area Size**
Minimum 44x44 points for touch targets

### 3. **Color Contrast**
Follow WCAG 2.1 Level AA:
- Text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

### 4. **Screen Reader Support**
Test with TalkBack (Android) and VoiceOver (iOS)

### 5. **Keyboard Navigation (Web)**
- Tab order should be logical
- Focus indicators visible
- All interactive elements keyboard-accessible

---

## Migration Strategy from Android App

### Data Migration Approach

**Original Format (XML):**
- 8 lists × 5 levels × 3 arrays (WordList, DefinitionWordList, FillInTheBlank)
- Total: 120 string-array resources in `res/values/array.xml`

**Target Format (JSON):**
- 8 JSON files: `list-a.json` through `list-h.json`
- Each file contains all 5 levels with structured word objects

**Migration Script (Phase 1):**
1. Parse `array.xml` using Node.js XML parser
2. Build lookup map: array name → items
3. For each list and level, combine arrays into word objects
4. Validate data integrity (word count, blank placeholders)
5. Generate JSON files with schema validation
6. Manual spot-check random samples

### Logic Migration Approach

**Quiz Logic Mapping:**

| Android (Java) | React Native (TypeScript) |
|----------------|---------------------------|
| `pickWord()` | `quizStore.getNextWord()` |
| `askQuestion()` | `quizStore.determineQuestionType()` |
| `fillInTheBlank()` | `<FillInBlankQuestion />` |
| `definition()` | `<MultipleChoiceQuestion />` |
| `fillInTheBlankAnswer()` | `answerValidator.validateFillInBlank()` |
| `definitionAnswer()` | `answerValidator.validateMultipleChoice()` |
| `updateProgressBar()` | `progressStore.calculateProgress()` |
| `graduation()` | `<GraduationScreen />` |

**State Mapping:**

| SharedPreferences Key | AsyncStorage / Zustand |
|----------------------|------------------------|
| `HINT + list + level` | `progressStore.sessions[listLevel].hints` |
| `WRONG + list + level` | `progressStore.sessions[listLevel].wrong` |
| `ALLTIMEHINT` | `progressStore.globalStats.allTimeHints` |
| `WORKING_LIST` | `vocabularyStore.currentListId` |
| `list + level + wordIndex` | `progressStore.wordProgress[wordId].state` |

---

## TypeScript Type Reference

### Core Types

```typescript
// Vocabulary Types
export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  fillInBlank: string;
  examples?: string[];
  synonyms?: string[];
}

export interface VocabularyLevel {
  id: 'basic' | 'intermediate' | 'advanced' | 'expert' | 'professional';
  name: string;
  words: VocabularyWord[];
}

export interface VocabularyList {
  id: string; // 'list-a', 'list-b', etc.
  name: string;
  description?: string;
  levels: VocabularyLevel[];
}

// Quiz Types
export type QuestionType = 'multiple' | 'fillin';
export type WordState = 0 | 1 | 2 | 3;

export interface QuizQuestion {
  word: VocabularyWord;
  type: QuestionType;
  options?: string[]; // For multiple choice (4 options)
}

export interface QuizSession {
  listId: string;
  levelId: string;
  words: VocabularyWord[];
  currentQuestionIndex: number;
  sessionStats: {
    hintsUsed: number;
    wrongAnswers: number;
    correctAnswers: number;
  };
  startedAt: string;
}

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
```

---

## Folder Structure Reference

Complete folder structure for the entire project:

```
Migration/
├── expo-project/                  # Expo/React Native app
│   ├── .expo/                     # Expo internal (gitignored)
│   ├── node_modules/              # Dependencies (gitignored)
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── providers.tsx
│   │   ├── features/
│   │   │   ├── quiz/
│   │   │   │   ├── components/
│   │   │   │   │   ├── MultipleChoiceQuestion.tsx
│   │   │   │   │   ├── FillInBlankQuestion.tsx
│   │   │   │   │   ├── QuizHeader.tsx
│   │   │   │   │   └── AnswerFeedback.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useQuiz.ts
│   │   │   │   │   └── useAdaptiveDifficulty.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── answerValidator.ts
│   │   │   │   │   └── questionGenerator.ts
│   │   │   │   ├── screens/
│   │   │   │   │   ├── QuizScreen.tsx
│   │   │   │   │   └── GraduationScreen.tsx
│   │   │   │   └── __tests__/
│   │   │   ├── vocabulary/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ListCard.tsx
│   │   │   │   │   └── LevelButton.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useVocabulary.ts
│   │   │   │   ├── utils/
│   │   │   │   │   └── vocabularyLoader.ts
│   │   │   │   ├── screens/
│   │   │   │   │   ├── HomeScreen.tsx
│   │   │   │   │   └── DifficultyScreen.tsx
│   │   │   │   └── __tests__/
│   │   │   ├── progress/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProgressCard.tsx
│   │   │   │   │   └── StatChart.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useProgress.ts
│   │   │   │   ├── screens/
│   │   │   │   │   └── StatsScreen.tsx
│   │   │   │   └── __tests__/
│   │   │   └── settings/
│   │   │       ├── components/
│   │   │       │   └── SettingItem.tsx
│   │   │       ├── screens/
│   │   │       │   └── SettingsScreen.tsx
│   │   │       └── __tests__/
│   │   ├── shared/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Typography.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── LoadingIndicator.tsx
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   ├── lib/
│   │   │   │   ├── storage.ts
│   │   │   │   ├── levenshtein.ts
│   │   │   │   ├── dateUtils.ts
│   │   │   │   └── constants.ts
│   │   │   ├── store/
│   │   │   │   ├── vocabularyStore.ts
│   │   │   │   ├── quizStore.ts
│   │   │   │   ├── progressStore.ts
│   │   │   │   ├── adaptiveDifficultyStore.ts
│   │   │   │   └── settingsStore.ts
│   │   │   ├── types/
│   │   │   │   ├── vocabulary.ts
│   │   │   │   ├── progress.ts
│   │   │   │   ├── quiz.ts
│   │   │   │   ├── navigation.ts
│   │   │   │   └── index.ts
│   │   │   └── hooks/
│   │   │       ├── useHaptics.ts
│   │   │       ├── useSound.ts
│   │   │       └── useTheme.ts
│   │   └── assets/
│   │       ├── vocabulary/
│   │       │   ├── list-a.json
│   │       │   ├── list-b.json
│   │       │   ├── list-c.json
│   │       │   ├── list-d.json
│   │       │   ├── list-e.json
│   │       │   ├── list-f.json
│   │       │   ├── list-g.json
│   │       │   └── list-h.json
│   │       ├── images/
│   │       └── sounds/
│   ├── scripts/
│   │   ├── parseXmlToJson.ts      # Data migration script
│   │   └── validateVocabulary.ts  # Validation script
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── eas.json
│   └── README.md
└── docs/
    └── plans/                      # This directory
        ├── README.md
        ├── Phase-0.md              # This file
        ├── Phase-1.md
        ├── Phase-2.md
        ├── Phase-3.md
        ├── Phase-4.md
        ├── Phase-5.md
        └── Phase-6.md
```

---

## Next Steps

You've completed reading Phase 0. This document serves as your reference throughout all implementation phases.

**Before starting Phase 1:**
1. Ensure you understand the architectural decisions
2. Familiarize yourself with the tech stack rationale
3. Review the type definitions and patterns
4. Bookmark this document for quick reference

**Proceed to:** [Phase 1: Project Setup & Data Migration](./Phase-1.md)

---

*This is a living document. If you discover patterns or pitfalls not covered here, document them for future reference.*
