# Vocabulary App - Android to React Native Migration Plan

## Executive Summary

This document outlines the comprehensive migration strategy for porting the Vocabulary Android (Java) application to a modern React Native (Expo) cross-platform application targeting Android, iOS, and Web.

**Project Scope:**
- Migrate all existing features (8 vocabulary lists, 300+ words, quiz mechanics)
- Enhance with adaptive difficulty algorithm
- Modernize UX with React Native Paper
- Enable cross-platform deployment (Android, iOS, Web)
- Make vocabulary lists plug-and-play for easy content updates

**Timeline Estimate:** 6-8 weeks (depending on resource allocation)

---

## Current State Analysis

### Architecture Overview
- **Type:** Single Activity Android application
- **Codebase:** ~853 lines of Java in `MainActivity.java`
- **Data Storage:** XML resources (102KB vocabulary data)
- **Persistence:** SharedPreferences for user progress
- **Dependencies:** Minimal (AndroidX libraries only)
- **Platform:** Android only (minSdk 26, targetSdk 33)

### Core Features
1. **8 Vocabulary Lists (A-H)** × 5 difficulty levels = 40 word sets
2. **Quiz Modes:**
   - Multiple Choice (definition → word selection)
   - Fill-in-Blank (sentence completion with 1-char tolerance)
3. **Progress Tracking:**
   - Word states: 0 (new) → 1 → 2 → 3 (mastered)
   - Performance metrics: hints used, wrong answers
   - Best scores per list, all-time totals
4. **Quiz Flow:**
   - State-based question type selection
   - Random word selection
   - Graduation screen with performance summary

### Technical Debt & Limitations
- Monolithic architecture (all logic in one file)
- Hardcoded data in XML (difficult to update)
- No separation of concerns (UI + logic mixed)
- Android-only (missing iOS and Web markets)
- Basic UI/UX (no animations, limited feedback)
- No spaced repetition or adaptive learning

---

## Target Architecture

### Technology Stack

#### Core Framework
- **React Native:** 0.74+
- **Expo SDK:** 51+
- **TypeScript:** 5.x (for type safety)
- **Node.js:** 18+ LTS

#### UI & Styling
- **React Native Paper:** 5.x (Material Design 3)
- **React Native Reanimated:** For smooth animations
- **React Native SVG:** For custom graphics/charts

#### State Management
- **Zustand:** 4.x (lightweight state management)
- **AsyncStorage:** @react-native-async-storage/async-storage

#### Development Tools
- **ESLint + Prettier:** Code quality and formatting
- **Jest + React Native Testing Library:** Unit/integration tests
- **Expo Dev Client:** Custom development builds

#### Deployment
- **Expo EAS Build:** Building for app stores
- **Expo EAS Submit:** Automated app store submission
- **Expo OTA Updates:** Push updates without store approval

### Architecture Pattern: Feature-Sliced Design

```
src/
├── app/                    # App entry, navigation, providers
├── features/               # Feature modules
│   ├── quiz/              # Quiz logic & UI
│   ├── vocabulary/        # Word data management
│   ├── progress/          # Progress tracking
│   └── stats/             # Statistics & analytics
├── shared/                 # Shared utilities
│   ├── ui/                # Reusable UI components
│   ├── lib/               # Utilities & helpers
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
└── assets/                 # Vocabulary data (JSON)
```

### Component Architecture

```
App
├── NavigationContainer
│   ├── HomeScreen (List Selection)
│   ├── DifficultyScreen (Level Selection)
│   ├── QuizScreen (Main Quiz Interface)
│   │   ├── QuizHeader (Progress, Stats)
│   │   ├── QuestionDisplay
│   │   │   ├── MultipleChoiceQuestion
│   │   │   └── FillInBlankQuestion
│   │   └── QuizControls (Hint, Navigation)
│   ├── GraduationScreen (Completion Summary)
│   ├── StatsScreen (Overall Progress)
│   └── SettingsScreen
└── Providers
    ├── ThemeProvider (React Native Paper)
    ├── StoreProvider (Zustand)
    └── SafeAreaProvider
```

---

## Data Migration Strategy

### Vocabulary Data Transformation

**Current Format (XML):**
```xml
<string-array name="abasicWordList">
    <item>word1</item>
    <item>word2</item>
</string-array>
<string-array name="abasicDefinitionWordList">
    <item>definition1</item>
    <item>definition2</item>
</string-array>
<string-array name="abasicFillInTheBlank">
    <item>Sentence with ____.</item>
    <item>Another ____ sentence.</item>
</string-array>
```

**Target Format (JSON):**
```json
{
  "lists": [
    {
      "id": "list-a",
      "name": "List A",
      "description": "Foundation vocabulary",
      "levels": [
        {
          "id": "basic",
          "name": "Basic",
          "words": [
            {
              "id": "word-1",
              "word": "word1",
              "definition": "definition1",
              "fillInBlank": "Sentence with ____.",
              "examples": ["Example usage"],
              "synonyms": ["synonym1"],
              "difficulty": 1
            }
          ]
        }
      ]
    }
  ]
}
```

**Benefits:**
- Structured, queryable data
- Easy to extend (add synonyms, examples, audio URLs)
- Version control friendly
- Plug-and-play for new lists

### User Data Migration

**Current (SharedPreferences):**
- Key-value pairs: `"HINTList A1" = 5`
- Scattered progress data

**Target (AsyncStorage with Zustand):**
```typescript
interface UserProgress {
  currentList: string;
  currentLevel: string;
  wordProgress: {
    [wordId: string]: {
      state: 0 | 1 | 2 | 3;
      hintsUsed: number;
      wrongAttempts: number;
      lastAttempt: string; // ISO date
      correctStreak: number;
    };
  };
  stats: {
    allTimeHints: number;
    allTimeWrong: number;
    totalWordsLearned: number;
    listsCompleted: string[];
  };
  listBestScores: {
    [listLevelId: string]: {
      hints: number;
      wrong: number;
      completedAt: string;
    };
  };
}
```

**Benefits:**
- Type-safe
- Centralized state
- Easy to query and aggregate
- Supports new features (streaks, analytics)

---

## Feature Enhancements

### 1. Adaptive Difficulty (New)

**Current Behavior:**
- State 0: Random 50/50 (multiple choice or fill-in-blank)
- State 1: Fill-in-blank only
- State 2: Multiple choice only
- State 3: Complete

**Enhanced Adaptive Algorithm:**

```typescript
interface AdaptiveDifficulty {
  // Track user performance per question type
  multipleChoiceAccuracy: number;
  fillInBlankAccuracy: number;

  // Adjust question type probability based on performance
  getQuestionType(wordState: number): 'multiple' | 'fillin' {
    if (wordState === 1) return 'fillin';
    if (wordState === 2) return 'multiple';

    // State 0: Adaptive selection
    // If user excels at multiple choice (>80% accuracy),
    // give more fill-in-blank (harder)
    if (this.multipleChoiceAccuracy > 0.8) {
      return Math.random() > 0.7 ? 'multiple' : 'fillin';
    }

    // If struggling with fill-in-blank (<50% accuracy),
    // give more multiple choice (easier)
    if (this.fillInBlankAccuracy < 0.5) {
      return Math.random() > 0.3 ? 'multiple' : 'fillin';
    }

    // Balanced performance: 50/50 split
    return Math.random() > 0.5 ? 'multiple' : 'fillin';
  }
}
```

**Benefits:**
- Personalized learning pace
- Prevents boredom (too easy) or frustration (too hard)
- Better retention through optimal challenge

### 2. Enhanced Answer Validation

**Current:** 1-character difference tolerance (insertion/deletion/substitution)

**Enhanced:**
```typescript
class AnswerValidator {
  // Levenshtein distance for typos
  allowTypoTolerance(answer: string, correct: string): boolean {
    return levenshteinDistance(answer, correct) <= 1;
  }

  // Handle common word variations
  normalizeForms(answer: string, correct: string): boolean {
    const correctForms = [
      correct,
      correct + 's',
      correct + 'es',
      correct + 'd',
      correct + 'ed',
      correct + 'ing',
      correct + 'ly'
    ];
    return correctForms.includes(answer.toLowerCase());
  }

  // Accept synonyms (from vocabulary data)
  checkSynonyms(answer: string, word: VocabularyWord): boolean {
    return word.synonyms?.some(syn =>
      syn.toLowerCase() === answer.toLowerCase()
    );
  }
}
```

### 3. Modern UX Improvements

**Smooth Transitions:**
- Page transitions with React Navigation
- Answer feedback animations (correct/wrong)
- Progress bar animations

**Better Feedback:**
- Haptic feedback on correct/wrong answers
- Sound effects (optional, togglable)
- Confetti animation on graduation
- Tooltip hints and onboarding

**Progress Visualization:**
- Charts showing improvement over time
- Streak tracking (daily practice)
- Achievement badges
- Word mastery heat map

**Accessibility:**
- Screen reader support
- Adjustable font sizes
- High contrast mode
- Keyboard navigation (web)

### 4. Plug-and-Play Content System

**Easy List Addition:**
1. Create new JSON file: `assets/vocabulary/list-i.json`
2. Follow schema validation
3. Restart app (or OTA update)
4. New list automatically appears

**Content Schema with Validation:**
```typescript
// Zod schema for validation
const VocabularyListSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  levels: z.array(z.object({
    id: z.string(),
    name: z.string(),
    words: z.array(z.object({
      id: z.string(),
      word: z.string(),
      definition: z.string(),
      fillInBlank: z.string(),
      examples: z.array(z.string()).optional(),
      synonyms: z.array(z.string()).optional(),
      difficulty: z.number().min(1).max(10).optional()
    }))
  }))
});
```

**Script for Content Creators:**
```bash
# Validate new content before adding
npm run validate-vocabulary assets/vocabulary/list-i.json

# Auto-generate TypeScript types from JSON
npm run generate-types
```

---

## Migration Phases

### **Phase 1: Foundation & Setup** (Week 1)

**Goals:**
- Set up React Native/Expo project
- Configure development environment
- Implement basic navigation structure
- Convert vocabulary data to JSON

**Tasks:**
1. Initialize Expo project with TypeScript
2. Install dependencies (React Native Paper, Zustand, etc.)
3. Configure ESLint, Prettier, TypeScript
4. Set up project structure (feature-sliced design)
5. **Data Migration:**
   - Write script to parse `array.xml`
   - Transform to JSON format
   - Validate data integrity
   - Generate 8 JSON files (list-a.json through list-h.json)
6. Set up React Navigation (Stack Navigator)
7. Create basic screens (placeholders)
8. Configure theming with React Native Paper

**Deliverables:**
- ✅ Working Expo app running on iOS, Android, Web
- ✅ All vocabulary data in JSON format
- ✅ Navigation structure in place
- ✅ Theming configured

**Acceptance Criteria:**
- App builds successfully on all platforms
- Can navigate between placeholder screens
- Vocabulary JSON data loads correctly

---

### **Phase 2: Core Components & UI** (Week 2)

**Goals:**
- Build reusable UI components
- Implement screens with React Native Paper
- Create quiz question components

**Tasks:**
1. **Shared Components:**
   - Button variants (primary, secondary, outline)
   - Card components
   - Typography system
   - Progress indicators
   - Modal/Dialog components

2. **Screen Implementation:**
   - **HomeScreen:** List selection (A-H) with cards
   - **DifficultyScreen:** Level selection (5 buttons)
   - **QuizScreen:** Question display area
   - **GraduationScreen:** Completion summary

3. **Quiz Components:**
   - `MultipleChoiceQuestion`: 2×2 grid of answer buttons
   - `FillInBlankQuestion`: Text input + hint button
   - `QuizHeader`: Progress bar, current stats
   - `AnswerFeedback`: Animated correct/wrong indicator

4. **Animations:**
   - Screen transitions
   - Answer feedback (fade in/out)
   - Progress bar animations
   - Button press feedback

**Deliverables:**
- ✅ All screens UI complete and responsive
- ✅ Components match Material Design 3
- ✅ Smooth animations implemented
- ✅ Works on mobile and web

**Acceptance Criteria:**
- UI matches modern design standards
- Responsive on different screen sizes
- Animations are smooth (60fps)
- Accessibility features working

---

### **Phase 3: State Management & Quiz Logic** (Week 3-4)

**Goals:**
- Implement Zustand stores
- Port quiz logic from Java
- Implement adaptive difficulty algorithm
- Add persistence with AsyncStorage

**Tasks:**
1. **Zustand Store Architecture:**
   ```typescript
   // stores/vocabularyStore.ts
   - loadVocabularyLists()
   - selectList(listId)
   - selectLevel(levelId)
   - getWordsByLevel()

   // stores/quizStore.ts
   - startQuiz()
   - getNextQuestion()
   - submitAnswer()
   - useHint()
   - checkCompletion()

   // stores/progressStore.ts
   - updateWordProgress()
   - getWordState()
   - trackPerformance()
   - getBestScores()

   // stores/adaptiveDifficultyStore.ts
   - calculateAccuracy()
   - getOptimalQuestionType()
   - adjustDifficulty()
   ```

2. **Quiz Logic Migration:**
   - Port word state progression (0 → 3)
   - Random word selection algorithm
   - Question type determination (with adaptive enhancement)
   - Answer validation (enhanced)
   - Multiple choice answer generation (1 correct + 3 wrong)
   - Fill-in-blank tolerance algorithm
   - Hint system
   - Completion detection

3. **Adaptive Difficulty Implementation:**
   - Track performance per question type
   - Calculate accuracy metrics
   - Adjust question type probability
   - Provide optimal challenge level

4. **Persistence Layer:**
   - Save/load user progress to AsyncStorage
   - Save/load performance stats
   - Save/load best scores
   - Handle app state restoration

**Deliverables:**
- ✅ Complete quiz logic functional
- ✅ State persists across app restarts
- ✅ Adaptive difficulty working
- ✅ All quiz modes operational

**Acceptance Criteria:**
- Quiz flow matches Android app behavior
- Answers validated correctly (including tolerance)
- Progress saves and restores correctly
- Adaptive difficulty adjusts based on performance
- All edge cases handled (empty lists, completion, etc.)

---

### **Phase 4: Enhanced Features** (Week 5)

**Goals:**
- Implement UX enhancements
- Add progress visualization
- Implement achievement system
- Improve feedback mechanisms

**Tasks:**
1. **Progress Visualization:**
   - Stats screen with charts (react-native-chart-kit)
   - Word mastery overview
   - Performance trends over time
   - List completion status

2. **Gamification:**
   - Daily streak tracking
   - Achievement badges (first list completed, 100 words learned, etc.)
   - Confetti animation on graduation
   - Progress milestones

3. **Enhanced Feedback:**
   - Haptic feedback (Expo Haptics)
   - Sound effects (optional, with toggle)
   - Better error messages
   - Hint tooltip improvements
   - Celebration animations

4. **Settings Screen:**
   - Dark/light mode toggle
   - Sound on/off
   - Haptics on/off
   - Reset progress (with confirmation)
   - About/credits

**Deliverables:**
- ✅ Rich progress visualization
- ✅ Achievement system
- ✅ Enhanced feedback mechanisms
- ✅ Settings screen functional

**Acceptance Criteria:**
- Charts display accurate data
- Achievements unlock correctly
- Settings persist and apply immediately
- Haptic/sound feedback enhances experience

---

### **Phase 5: Testing & Polish** (Week 6)

**Goals:**
- Comprehensive testing
- Bug fixes
- Performance optimization
- Accessibility improvements

**Tasks:**
1. **Testing:**
   - Unit tests for business logic (Jest)
   - Integration tests for quiz flow
   - Component tests (React Native Testing Library)
   - Manual testing on iOS, Android, Web
   - Edge case testing
   - Performance testing

2. **Bug Fixes:**
   - Fix issues found in testing
   - Handle error states gracefully
   - Improve loading states

3. **Performance Optimization:**
   - Optimize re-renders
   - Lazy load vocabulary data
   - Optimize animations
   - Reduce bundle size

4. **Accessibility:**
   - Screen reader testing
   - Keyboard navigation (web)
   - Color contrast verification
   - Font scaling support

5. **Polish:**
   - Final UI tweaks
   - Animation timing adjustments
   - Copy/text improvements
   - Icon selection

**Deliverables:**
- ✅ Test coverage >80%
- ✅ All critical bugs fixed
- ✅ Performance optimized
- ✅ Accessibility compliant

**Acceptance Criteria:**
- All tests passing
- App runs smoothly on all platforms
- No critical bugs
- Accessibility score >90%

---

### **Phase 6: Deployment & Launch** (Week 7-8)

**Goals:**
- Build production apps
- Submit to app stores
- Deploy web version
- Documentation

**Tasks:**
1. **Production Builds:**
   - Configure EAS Build
   - Create Android build (AAB for Play Store)
   - Create iOS build (IPA for App Store)
   - Create web build (static site)

2. **App Store Submission:**
   - **Google Play Store:**
     - Update app listing (screenshots, description)
     - Submit new build
     - Beta testing (internal/closed)
     - Production release

   - **Apple App Store:**
     - Create App Store listing
     - Submit for review
     - Handle review feedback
     - Release

3. **Web Deployment:**
   - Deploy to hosting (Vercel, Netlify, or Expo hosting)
   - Configure domain (optional)
   - Set up analytics

4. **Documentation:**
   - User guide / onboarding
   - Content creation guide (how to add new lists)
   - Developer documentation
   - README updates

5. **Post-Launch:**
   - Monitor crash reports (Sentry/Bugsnag)
   - Gather user feedback
   - Plan OTA updates

**Deliverables:**
- ✅ App live on Google Play Store
- ✅ App live on Apple App Store
- ✅ Web version deployed
- ✅ Documentation complete

**Acceptance Criteria:**
- Apps approved and published
- Web version accessible
- Analytics tracking working
- Documentation clear and complete

---

## Data Model Reference

### Vocabulary Data Structure

```typescript
// types/vocabulary.ts

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  fillInBlank: string;
  examples?: string[];
  synonyms?: string[];
  difficulty?: number; // 1-10, for future use
}

export interface VocabularyLevel {
  id: string; // 'basic', 'intermediate', 'advanced', 'expert', 'professional'
  name: string;
  words: VocabularyWord[];
}

export interface VocabularyList {
  id: string; // 'list-a', 'list-b', etc.
  name: string; // 'List A', 'List B', etc.
  description?: string;
  levels: VocabularyLevel[];
}

export interface VocabularyData {
  version: string; // For future migrations
  lists: VocabularyList[];
}
```

### User Progress Structure

```typescript
// types/progress.ts

export type WordState = 0 | 1 | 2 | 3;

export interface WordProgress {
  state: WordState;
  hintsUsed: number;
  wrongAttempts: number;
  correctAttempts: number;
  lastAttemptDate: string; // ISO 8601
  firstAttemptDate: string;
  masteredDate?: string; // When reached state 3
  correctStreak: number; // For spaced repetition
}

export interface ListLevelProgress {
  listId: string;
  levelId: string;
  wordProgress: { [wordId: string]: WordProgress };
  sessionStats: {
    hintsUsed: number;
    wrongAnswers: number;
    startedAt: string;
    completedAt?: string;
  };
  bestScore?: {
    hints: number;
    wrong: number;
    completedAt: string;
  };
}

export interface UserProgress {
  currentListId?: string;
  currentLevelId?: string;
  listLevelProgress: { [listLevelId: string]: ListLevelProgress };
  globalStats: {
    allTimeHints: number;
    allTimeWrong: number;
    allTimeCorrect: number;
    totalWordsLearned: number; // Words at state 3
    listsCompleted: string[]; // ['list-a-basic', 'list-a-intermediate']
    currentStreak: number; // Days
    longestStreak: number;
    lastPracticeDate: string;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  progress?: number; // 0-100 for partial progress
}
```

### Quiz Session State

```typescript
// types/quiz.ts

export interface QuizSession {
  listId: string;
  levelId: string;
  words: VocabularyWord[];
  currentWordIndex: number;
  questionType: 'multiple' | 'fillin';
  sessionStats: {
    hintsUsed: number;
    wrongAnswers: number;
    correctAnswers: number;
  };
  startedAt: string;
}

export interface QuizQuestion {
  word: VocabularyWord;
  type: 'multiple' | 'fillin';
  options?: string[]; // For multiple choice (4 options)
  userAnswer?: string;
  isCorrect?: boolean;
}
```

---

## Technical Specifications

### File Structure

```
vocabulary-app/
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── eas.json                      # EAS Build config
├── babel.config.js
│
├── assets/
│   ├── vocabulary/               # Vocabulary JSON files
│   │   ├── list-a.json
│   │   ├── list-b.json
│   │   ├── ...
│   │   └── list-h.json
│   ├── images/
│   └── sounds/
│
├── src/
│   ├── app/
│   │   ├── App.tsx               # Root component
│   │   ├── navigation.tsx        # React Navigation setup
│   │   └── providers.tsx         # Context providers
│   │
│   ├── features/
│   │   ├── quiz/
│   │   │   ├── components/
│   │   │   │   ├── MultipleChoiceQuestion.tsx
│   │   │   │   ├── FillInBlankQuestion.tsx
│   │   │   │   ├── QuizHeader.tsx
│   │   │   │   ├── AnswerFeedback.tsx
│   │   │   │   └── HintButton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useQuiz.ts
│   │   │   │   └── useAdaptiveDifficulty.ts
│   │   │   ├── utils/
│   │   │   │   ├── answerValidator.ts
│   │   │   │   └── questionGenerator.ts
│   │   │   └── screens/
│   │   │       ├── QuizScreen.tsx
│   │   │       └── GraduationScreen.tsx
│   │   │
│   │   ├── vocabulary/
│   │   │   ├── components/
│   │   │   │   ├── ListCard.tsx
│   │   │   │   └── LevelButton.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useVocabulary.ts
│   │   │   ├── utils/
│   │   │   │   └── vocabularyLoader.ts
│   │   │   └── screens/
│   │   │       ├── HomeScreen.tsx
│   │   │       └── DifficultyScreen.tsx
│   │   │
│   │   ├── progress/
│   │   │   ├── components/
│   │   │   │   ├── ProgressCard.tsx
│   │   │   │   ├── StatChart.tsx
│   │   │   │   └── AchievementBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProgress.ts
│   │   │   └── screens/
│   │   │       └── StatsScreen.tsx
│   │   │
│   │   └── settings/
│   │       ├── components/
│   │       │   └── SettingItem.tsx
│   │       └── screens/
│   │           └── SettingsScreen.tsx
│   │
│   ├── shared/
│   │   ├── ui/                   # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Typography.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── lib/                  # Utilities
│   │   │   ├── storage.ts        # AsyncStorage wrapper
│   │   │   ├── levenshtein.ts    # String distance algorithm
│   │   │   ├── dateUtils.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── store/                # Zustand stores
│   │   │   ├── vocabularyStore.ts
│   │   │   ├── quizStore.ts
│   │   │   ├── progressStore.ts
│   │   │   ├── adaptiveDifficultyStore.ts
│   │   │   └── settingsStore.ts
│   │   │
│   │   ├── types/                # TypeScript types
│   │   │   ├── vocabulary.ts
│   │   │   ├── progress.ts
│   │   │   ├── quiz.ts
│   │   │   └── index.ts
│   │   │
│   │   └── hooks/                # Shared hooks
│   │       ├── useHaptics.ts
│   │       ├── useSound.ts
│   │       └── useTheme.ts
│   │
│   └── scripts/
│       ├── parseXmlToJson.ts     # Migration script
│       ├── validateVocabulary.ts # Validation script
│       └── generateTypes.ts      # Type generation
│
└── __tests__/
    ├── unit/
    ├── integration/
    └── e2e/
```

### Key Configuration Files

**app.json (Expo config):**
```json
{
  "expo": {
    "name": "Vocabulary",
    "slug": "vocabulary",
    "version": "2.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.gemenielabs.vocabulary"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "gemenielabs.vocabulary"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

**eas.json (Build config):**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json"
      },
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Cross-platform rendering inconsistencies | Medium | Medium | Extensive testing on all platforms; use React Native Paper for consistency |
| Performance issues on low-end devices | Medium | Low | Performance testing; optimize re-renders; lazy loading |
| AsyncStorage data loss | High | Low | Implement backup/export; regular persistence; data validation |
| App store rejection (iOS) | High | Low | Follow Apple guidelines; thorough testing; privacy policy |
| Migration data integrity issues | High | Low | Comprehensive validation script; manual verification; unit tests |
| State management complexity | Medium | Medium | Clear architecture; documentation; code reviews |
| Web version accessibility issues | Medium | Medium | Accessibility testing; keyboard navigation; screen reader support |

### Content Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data parsing errors (XML → JSON) | High | Medium | Automated validation; manual spot checks; rollback plan |
| Missing or incorrect vocabulary data | Medium | Low | Side-by-side comparison; user testing; feedback mechanism |
| Inconsistent formatting | Low | Medium | Schema validation; automated formatting; linting |

### Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Timeline delays | Medium | Medium | Phased approach; clear milestones; buffer time |
| Scope creep | Medium | High | Clear requirements; change control; prioritization |
| Platform-specific bugs | Medium | Medium | Continuous testing; platform-specific QA; beta testing |
| Learning curve (new tech) | Low | Low | Documentation; community support; proof of concepts |

---

## Success Metrics

### Launch Criteria (Must-Have)

✅ **Functional Parity:**
- All 8 vocabulary lists migrated correctly
- All 300+ words validated
- Multiple choice quiz working
- Fill-in-blank quiz working
- Progress tracking accurate
- Performance metrics match Android app

✅ **Platform Support:**
- Android app builds and runs
- iOS app builds and runs
- Web version loads and functions
- All platforms pass QA

✅ **Quality:**
- Test coverage >80%
- No critical bugs
- Performance: 60fps animations
- Accessibility score >90%

✅ **Distribution:**
- Published on Google Play Store
- Published on Apple App Store
- Web version deployed

### Post-Launch Metrics (Success Indicators)

**User Engagement:**
- Daily Active Users (DAU)
- Session length
- Completion rate (lists finished)
- Retention (D1, D7, D30)

**Technical:**
- Crash-free rate >99%
- App load time <2 seconds
- Quiz interaction response <100ms

**Business:**
- Android user retention maintained
- iOS user acquisition
- Web traffic and engagement
- User ratings >4.0 stars

---

## Future Enhancements (Post-MVP)

### Phase 7+: Advanced Features

1. **Spaced Repetition System (SRS)**
   - Algorithm to resurface words at optimal intervals
   - Based on Ebbinghaus forgetting curve
   - Personalized review schedules

2. **Social Features**
   - Leaderboards
   - Share achievements
   - Challenge friends

3. **Advanced Analytics**
   - Learning curve visualization
   - Word difficulty analysis
   - Optimal study time recommendations

4. **Content Expansion**
   - User-generated lists (community content)
   - Import/export vocabulary lists
   - Multi-language support

5. **Premium Features**
   - Ad-free experience
   - Advanced statistics
   - Custom themes
   - Audio pronunciations

6. **Backend Integration (Option B from earlier)**
   - Remote vocabulary management
   - Cloud sync across devices
   - A/B testing new content
   - Personalized recommendations

7. **Gamification 2.0**
   - Avatar customization
   - XP and leveling system
   - Daily challenges
   - Seasonal events

---

## Development Guidelines

### Code Quality Standards

**TypeScript:**
- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Interface over type for objects
- Exhaustive switch cases

**React/React Native:**
- Functional components only
- Custom hooks for reusable logic
- Proper dependency arrays in useEffect
- Memoization where appropriate (useMemo, useCallback)
- Avoid inline function definitions in renders

**Testing:**
- Unit tests for all business logic
- Integration tests for user flows
- Snapshot tests for components
- E2E tests for critical paths

**Performance:**
- Optimize re-renders (React.memo)
- Virtualized lists for long content
- Image optimization
- Bundle size monitoring

**Accessibility:**
- Semantic HTML (web)
- Proper ARIA labels
- Screen reader testing
- Keyboard navigation
- Color contrast compliance

### Git Workflow

**Branch Strategy:**
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release preparation

**Commit Messages:**
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

**Code Review:**
- All changes require PR review
- CI/CD checks must pass
- Test coverage must not decrease

---

## Appendix

### A. Glossary

- **Adaptive Difficulty:** System that adjusts question difficulty based on user performance
- **EAS (Expo Application Services):** Build and submission service for Expo apps
- **Feature-Sliced Design:** Architecture pattern organizing code by features
- **Levenshtein Distance:** Algorithm measuring string similarity
- **OTA (Over-The-Air) Updates:** Push updates without app store approval
- **Spaced Repetition:** Learning technique with increasing review intervals
- **Zustand:** Lightweight state management library

### B. Resources

**Documentation:**
- [Expo Docs](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Navigation](https://reactnavigation.org/)

**Tools:**
- [Expo EAS](https://expo.dev/eas)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)

### C. Contact & Support

- **Developer:** [Your name/team]
- **Repository:** [GitHub URL]
- **Issues:** [Issue tracker URL]
- **Documentation:** [Docs URL]

---

## Next Steps

After reviewing this migration plan:

1. **Confirm Approach:** Review each phase and provide feedback
2. **Approve Timeline:** Adjust timeline based on resources
3. **Prioritize Phases:** Identify must-have vs. nice-to-have features
4. **Begin Phase 1:** Set up development environment and start data migration

**Ready to proceed?** Let me know if you'd like to:
- Adjust any phase
- Add/remove features
- Change technology choices
- Discuss specific implementation details

---

*Last Updated: 2025-11-08*
*Version: 1.0*
