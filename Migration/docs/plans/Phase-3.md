# Phase 3: Quiz Logic & State Management

## Phase Goal

Implement the complete quiz engine with Zustand state management, migrating all quiz logic from the Android app's Java code. This phase brings the app to life by adding answer validation, word state progression, adaptive difficulty algorithm, and real quiz session management. By the end, users can take fully functional quizzes with accurate scoring and intelligent question selection.

**Success Criteria:**
- All Zustand stores implemented and tested
- Quiz logic accurately migrated from Android app
- Answer validation works for both question types (multiple choice, fill-in-blank)
- Fill-in-blank tolerance algorithm matches Android behavior
- Adaptive difficulty algorithm adjusts question types based on performance
- Word state progression (0→1→2→3) working correctly
- Quiz session persists during app lifecycle
- Integration tests pass for complete quiz flow
- No regression in UI functionality from Phase 2

**Estimated tokens:** ~105,000

---

## Prerequisites

### Before Starting This Phase

- [ ] Phase 2 completely finished and verified
- [ ] All UI components and screens working
- [ ] Quiz answer components ready for integration
- [ ] Understanding of Android app's quiz logic (review `MainActivity.java`)
- [ ] Working directory: `Migration/expo-project/`

### Phase 2 Verification

Run these commands to verify Phase 2 completion:
```bash
npm run lint           # Should pass
npm run type-check     # Should pass
npm test               # All UI tests pass
npm start              # App runs with all screens
```

### Knowledge Requirements

- Zustand state management patterns
- JavaScript Set and Map data structures
- Algorithm implementation (Levenshtein distance)
- React hooks (useState, useEffect, useCallback)
- Async operations and state updates

---

## Tasks

### Task 1: Create Vocabulary Store

**Goal:** Implement Zustand store for loading and managing vocabulary data, providing centralized access to all lists, levels, and words.

**Files to Create:**
- `src/shared/store/vocabularyStore.ts` - Vocabulary state management

**Files to Modify:**
- None (new store)

**Prerequisites:**
- Phase 1 Task 10 complete (vocabulary loader utility exists)
- Zustand installed

**Implementation Steps:**

1. **Define store state interface**
   - vocabularyLists: VocabularyList[] (all 8 lists)
   - selectedListId: string | null (currently selected list)
   - selectedLevelId: string | null (currently selected level)
   - isLoading: boolean (for future async loading)
   - error: string | null (error state)

2. **Implement store creation**
   - Use Zustand's `create` function with TypeScript
   - Initialize with empty/default state
   - Define all action methods

3. **Implement loadVocabularyLists action**
   - Import vocabularyLoader utility
   - Call loadVocabularyLists() to get all lists
   - Set vocabularyLists in state
   - Handle errors gracefully
   - Set isLoading flags appropriately

4. **Implement list selection actions**
   - selectList(listId: string): Set selectedListId
   - selectLevel(levelId: string): Set selectedLevelId
   - clearSelection(): Reset selected list and level

5. **Implement selector helpers**
   - getSelectedList(): Get full list object by selectedListId
   - getSelectedLevel(): Get level object by selectedLevelId
   - getWordsByListLevel(listId, levelId): Get words array
   - getAllWords(): Get all words from all lists (for stats)

6. **Add data validation**
   - Validate listId exists before selection
   - Validate levelId exists in selected list
   - Return undefined if selections invalid

7. **Initialize store on app start**
   - Call loadVocabularyLists() in store creation
   - Or trigger from App.tsx useEffect
   - Ensure vocabulary loads before quiz can start

**Verification Checklist:**
- [ ] `vocabularyStore.ts` created with all actions
- [ ] Store loads all 8 vocabulary lists on initialization
- [ ] selectList() updates selectedListId correctly
- [ ] selectLevel() updates selectedLevelId correctly
- [ ] getSelectedList() returns correct VocabularyList object
- [ ] getWordsByListLevel() returns correct word array
- [ ] Invalid IDs handled gracefully (return undefined)
- [ ] TypeScript types are correct
- [ ] No console errors when using store

**Testing Instructions:**

Create test file or test in component:
```typescript
import { useVocabularyStore } from '@/shared/store/vocabularyStore';

// In a test component or test file
const store = useVocabularyStore.getState();

// Load lists
store.loadVocabularyLists();
console.log('Lists loaded:', store.vocabularyLists.length); // Should be 8

// Select list
store.selectList('list-a');
console.log('Selected list:', store.selectedListId); // "list-a"

// Get words
const words = store.getWordsByListLevel('list-a', 'basic');
console.log('Words in List A Basic:', words.length); // Should be 8

// Test selectors
const list = store.getSelectedList();
console.log('List name:', list?.name); // "List A"
```

**Commit Message Template:**
```
feat(store): implement vocabulary store with Zustand

- Create vocabularyStore with list and level management
- Add loadVocabularyLists action to load all 8 lists
- Add selectList and selectLevel actions for navigation
- Add selector helpers: getSelectedList, getWordsByListLevel
- Add data validation for invalid list/level IDs
- Initialize store with vocabulary data on creation
- Add TypeScript types for store state and actions
```

**Estimated tokens:** ~8,000

---

### Task 2: Create Quiz Store (Part 1: Session Management)

**Goal:** Implement the core quiz store managing quiz sessions, current question state, and session statistics.

**Files to Create:**
- `src/shared/store/quizStore.ts` - Quiz session state management

**Prerequisites:**
- Task 1 complete (vocabulary store)
- Quiz types from Phase 0

**Implementation Steps:**

1. **Define store state interface**
   - currentSession: QuizSession | null
   - currentQuestion: QuizQuestion | null
   - currentQuestionIndex: number
   - isQuizActive: boolean
   - sessionStats: { hintsUsed, wrongAnswers, correctAnswers }

2. **Implement startQuiz action**
   - Accept listId and levelId parameters
   - Get words from vocabularyStore
   - Initialize answered array (word states: 0 for all words)
   - Set currentQuestionIndex to 0
   - Create QuizSession object
   - Call getNextQuestion() to prepare first question
   - Set isQuizActive to true

3. **Implement getNextQuestion action**
   - Pick random word from current level's words
   - Check word state in answered array
   - Skip words with state 3 (mastered)
   - Determine question type based on word state and adaptive difficulty
   - Generate question object (QuizQuestion)
   - Set currentQuestion in state
   - Increment currentQuestionIndex

4. **Implement word picking logic (from Android pickWord)**
   - Random selection using Math.random()
   - Skip words already mastered (state 3)
   - Avoid repeating same word consecutively (track lastWordIndex)
   - Handle case when all words mastered (complete quiz)

5. **Implement question type determination**
   - If word state === 1: fill-in-blank only
   - If word state === 2: multiple choice only
   - If word state === 0: random 50/50 (will enhance with adaptive in Task 4)
   - Return QuestionType: 'multiple' | 'fillin'

6. **Implement session stats tracking**
   - incrementHints(): hintsUsed++
   - incrementWrong(): wrongAnswers++
   - incrementCorrect(): correctAnswers++
   - resetStats(): Reset all to 0

7. **Implement endQuiz action**
   - Calculate final stats
   - Set isQuizActive to false
   - Keep session data for graduation screen
   - Return stats object for navigation params

8. **Add quiz completion detection**
   - Check if all words have state 3
   - Return isQuizComplete boolean
   - Use in QuizScreen to navigate to Graduation

**Verification Checklist:**
- [ ] quizStore.ts created with session management
- [ ] startQuiz() initializes session with listId and levelId
- [ ] getNextQuestion() picks random unanswered word
- [ ] Question type determined by word state
- [ ] Session stats track hints, wrong, correct
- [ ] endQuiz() returns final stats
- [ ] isQuizComplete detects when all words mastered
- [ ] TypeScript types correct
- [ ] Store integrates with vocabularyStore

**Testing Instructions:**

```typescript
import { useQuizStore } from '@/shared/store/quizStore';
import { useVocabularyStore } from '@/shared/store/vocabularyStore';

// Initialize vocabulary first
const vocabStore = useVocabularyStore.getState();
vocabStore.loadVocabularyLists();

// Start quiz
const quizStore = useQuizStore.getState();
quizStore.startQuiz('list-a', 'basic');

console.log('Quiz active:', quizStore.isQuizActive); // true
console.log('Current question:', quizStore.currentQuestion); // QuizQuestion object
console.log('Question type:', quizStore.currentQuestion?.type); // 'multiple' or 'fillin'

// Test stats
quizStore.incrementHints();
console.log('Hints used:', quizStore.sessionStats.hintsUsed); // 1

// Test completion
console.log('Quiz complete:', quizStore.isQuizComplete); // false initially
```

**Commit Message Template:**
```
feat(quiz): implement quiz store session management

- Create quizStore with session state management
- Add startQuiz action to initialize quiz session
- Add getNextQuestion action with random word selection
- Implement word state-based question type determination
- Add session stats tracking (hints, wrong, correct answers)
- Add endQuiz action to finalize session
- Add quiz completion detection
- Integrate with vocabularyStore for word data
```

**Estimated tokens:** ~12,000

---

### Task 3: Implement Answer Validation Logic

**Goal:** Create utility functions for validating user answers for both multiple choice and fill-in-blank questions, including the tolerance algorithm from the Android app.

**Files to Create:**
- `src/features/quiz/utils/answerValidator.ts` - Answer validation logic
- `src/shared/lib/levenshtein.ts` - Levenshtein distance algorithm

**Prerequisites:**
- Understanding of Android app's answer validation (review MainActivity.java lines 252-318)

**Implementation Steps:**

1. **Implement Levenshtein distance algorithm**
   - Create function: `levenshteinDistance(str1: string, str2: string): number`
   - Classic dynamic programming algorithm
   - Returns minimum edit distance between two strings
   - Used for typo tolerance in fill-in-blank

2. **Create answer validator class/module**
   - Export functions for each validation type
   - Keep pure functions (no state)
   - Well-documented with examples

3. **Implement multiple choice validation**
   - Function: `validateMultipleChoice(userAnswer: string, correctAnswer: string): boolean`
   - Simple exact match (case-sensitive)
   - Return true if match, false otherwise

4. **Implement fill-in-blank tolerance algorithm**
   - Function: `validateFillInBlank(userAnswer: string, correctAnswer: string): boolean`
   - Normalize input: trim whitespace, lowercase
   - Generate possible correct answers:
     - Base word
     - word + 'd', 'ly', 'ed', 'ing', 's', 'es'
     - word[0..-1] + 'es' (remove last char)
     - word[0..-1] + 'ing' (remove last char)
   - For each possible answer, check Levenshtein distance ≤ 1
   - Return true if any match found

5. **Port Android tolerance logic exactly**
   - Review Android code lines 260-303 (fillInTheBlankAnswer method)
   - Array of possible answers includes word variations
   - Character-by-character comparison with difference counting
   - Allow up to 1 character difference (insertion, deletion, substitution)
   - Match Android behavior precisely

6. **Add edge case handling**
   - Empty user answer: return false
   - Very short answers (1-2 chars): apply tolerance carefully
   - Special characters: handle appropriately
   - Case insensitivity for fill-in-blank

7. **Add unit tests for validation**
   - Test exact matches
   - Test with typos (1 char off)
   - Test word variations (plurals, tenses)
   - Test edge cases (empty, short, special chars)
   - Test against Android app examples

**Verification Checklist:**
- [ ] levenshtein.ts implements correct algorithm
- [ ] validateMultipleChoice() works for exact matches
- [ ] validateFillInBlank() handles exact matches
- [ ] Tolerance allows 1 character difference
- [ ] Word variations accepted (s, ed, ing, ly, d, es)
- [ ] Edge cases handled (empty, short answers)
- [ ] Behavior matches Android app exactly
- [ ] Unit tests written and passing
- [ ] JSDoc comments explain algorithm

**Testing Instructions:**

```typescript
import { validateFillInBlank, validateMultipleChoice } from './answerValidator';

// Test multiple choice
console.log(validateMultipleChoice('abject', 'abject')); // true
console.log(validateMultipleChoice('abject', 'abjure')); // false

// Test fill-in-blank exact
console.log(validateFillInBlank('abject', 'abject')); // true

// Test with typo (1 char)
console.log(validateFillInBlank('abjact', 'abject')); // true (1 char diff)
console.log(validateFillInBlank('abjact', 'abject')); // false (2 char diff)

// Test variations
console.log(validateFillInBlank('abjects', 'abject')); // true (plural)
console.log(validateFillInBlank('abjected', 'abject')); // true (past tense)
console.log(validateFillInBlank('abjecting', 'abject')); // true (present participle)
console.log(validateFillInBlank('abjectly', 'abject')); // true (adverb)

// Test case insensitivity
console.log(validateFillInBlank('Abject', 'abject')); // true
console.log(validateFillInBlank('ABJECT', 'abject')); // true
```

**Commit Message Template:**
```
feat(quiz): implement answer validation with tolerance algorithm

- Create levenshtein.ts with edit distance algorithm
- Implement validateMultipleChoice for exact matching
- Implement validateFillInBlank with tolerance algorithm
- Port Android's character difference logic (allow 1 char diff)
- Handle word variations: s, ed, ing, ly, d, es suffixes
- Add case-insensitive matching for fill-in-blank
- Add edge case handling (empty, short answers)
- Add unit tests for all validation scenarios
```

**Estimated tokens:** ~15,000

---

### Task 4: Implement Adaptive Difficulty Algorithm

**Goal:** Create an adaptive difficulty system that adjusts question type probability based on user performance, providing personalized learning experience.

**Files to Create:**
- `src/shared/store/adaptiveDifficultyStore.ts` - Adaptive difficulty state

**Prerequisites:**
- Task 2 complete (quiz store)
- Understanding of enhancement from migration docs

**Implementation Steps:**

1. **Define store state**
   - multipleChoiceAccuracy: number (0-1 ratio)
   - fillInBlankAccuracy: number (0-1 ratio)
   - multipleChoiceAttempts: number
   - fillInBlankAttempts: number
   - multipleChoiceCorrect: number
   - fillInBlankCorrect: number

2. **Implement performance tracking**
   - Function: `updatePerformance(questionType: QuestionType, isCorrect: boolean)`
   - Increment attempts for question type
   - Increment correct if isCorrect
   - Recalculate accuracy: correct / attempts
   - Store in state

3. **Implement adaptive question type selection**
   - Function: `getOptimalQuestionType(wordState: WordState): QuestionType`
   - For wordState === 1: always return 'fillin'
   - For wordState === 2: always return 'multiple'
   - For wordState === 0: adaptive logic below

4. **Implement adaptive logic for wordState 0**
   - If multipleChoiceAccuracy > 0.8: bias toward fill-in-blank (70% fillin, 30% multiple)
   - If fillInBlankAccuracy < 0.5: bias toward multiple choice (70% multiple, 30% fillin)
   - If balanced (between thresholds): 50/50 split
   - Use Math.random() with thresholds to determine type

5. **Add minimum attempts threshold**
   - Don't apply adaptive logic until user has at least 5 attempts per type
   - Before threshold, use 50/50 random
   - Prevents skewed results from small sample size

6. **Implement reset function**
   - resetPerformance(): Reset all stats to 0
   - Call when starting new list or level
   - Or keep global stats (design decision)

7. **Integrate with quizStore**
   - Modify quizStore.getNextQuestion() to call adaptiveStore
   - Pass wordState to getOptimalQuestionType()
   - Use returned type for question generation

8. **Add performance metrics export**
   - getPerformanceMetrics(): Return object with all stats
   - Use in StatsScreen to show performance by question type

**Verification Checklist:**
- [ ] adaptiveDifficultyStore.ts created
- [ ] updatePerformance() tracks attempts and accuracy
- [ ] getOptimalQuestionType() returns correct type for wordStates 1 and 2
- [ ] Adaptive logic works for wordState 0
- [ ] Biases toward harder questions when user excels
- [ ] Biases toward easier questions when user struggles
- [ ] Minimum attempts threshold prevents early bias
- [ ] Integrated with quizStore.getNextQuestion()
- [ ] Performance metrics available for stats display

**Testing Instructions:**

```typescript
import { useAdaptiveDifficultyStore } from '@/shared/store/adaptiveDifficultyStore';

const store = useAdaptiveDifficultyStore.getState();

// Simulate user excelling at multiple choice
for (let i = 0; i < 10; i++) {
  store.updatePerformance('multiple', true);
}
console.log('MC Accuracy:', store.multipleChoiceAccuracy); // 1.0

// Should bias toward fill-in-blank
const type = store.getOptimalQuestionType(0);
console.log('Recommended type:', type); // Likely 'fillin' (70% chance)

// Simulate struggling with fill-in-blank
for (let i = 0; i < 10; i++) {
  store.updatePerformance('fillin', i < 4); // 40% accuracy
}
console.log('FIB Accuracy:', store.fillInBlankAccuracy); // 0.4

// Should bias toward multiple choice
const type2 = store.getOptimalQuestionType(0);
console.log('Recommended type:', type2); // Likely 'multiple' (70% chance)
```

**Commit Message Template:**
```
feat(quiz): implement adaptive difficulty algorithm

- Create adaptiveDifficultyStore for performance tracking
- Track accuracy separately for multiple choice and fill-in-blank
- Implement getOptimalQuestionType with adaptive logic
- Bias toward harder questions when user excels (>80% accuracy)
- Bias toward easier questions when user struggles (<50% accuracy)
- Add minimum attempts threshold (5) before applying adaptive logic
- Integrate with quizStore for intelligent question selection
- Export performance metrics for statistics display
```

**Estimated tokens:** ~12,000

---

### Task 5: Implement Quiz Store (Part 2: Answer Submission)

**Goal:** Add answer submission logic to quiz store, integrating validation, word state progression, and stats tracking.

**Files to Modify:**
- `src/shared/store/quizStore.ts` - Add answer submission actions

**Prerequisites:**
- Task 2 complete (quiz store part 1)
- Task 3 complete (answer validation)
- Task 4 complete (adaptive difficulty)

**Implementation Steps:**

1. **Add answered array to session state**
   - Array of word states: number[] (0, 1, 2, or 3 for each word)
   - Initialize with 0s for all words when starting quiz
   - Track in QuizSession object

2. **Implement submitAnswer action**
   - Accept userAnswer: string
   - Get currentQuestion from state
   - Validate answer using answerValidator
   - Update stats based on result
   - Update word state based on question type and current state
   - Call getNextQuestion() to prepare next question
   - Return result: { isCorrect, correctAnswer }

3. **Implement answer validation dispatch**
   - If question type === 'multiple': use validateMultipleChoice()
   - If question type === 'fillin': use validateFillInBlank()
   - Pass userAnswer and correct word to validator
   - Get boolean result

4. **Implement stats updates**
   - If correct: incrementCorrect()
   - If wrong: incrementWrong()
   - Update adaptive difficulty store with performance

5. **Implement word state progression**
   - Based on Android app logic (review MainActivity.java lines 369-374, 309):
     - Multiple choice correct: state 0→1, state 2→3
     - Fill-in-blank correct: state 0→2, state 1→3
     - Wrong answer: state unchanged
   - Update answered array at current word index

6. **Implement useHint action**
   - Increment hint count in session stats
   - Return definition of current word
   - For fill-in-blank questions only
   - No state change, just stats update

7. **Add progress calculation**
   - Function: calculateProgress(): number
   - Sum all word states in answered array
   - Return current progress (used for progress bar)
   - Max progress = wordCount × 3 (each word can reach state 3)

8. **Handle quiz completion**
   - When all words reach state 3, set isComplete flag
   - QuizScreen should detect this and navigate to Graduation
   - Pass final stats to Graduation screen

**Verification Checklist:**
- [ ] submitAnswer() validates answers correctly
- [ ] Correct answers increment correctAnswers stat
- [ ] Wrong answers increment wrongAnswers stat
- [ ] Word states progress correctly: 0→1→2→3
- [ ] Multiple choice: 0→1, 2→3
- [ ] Fill-in-blank: 0→2, 1→3
- [ ] useHint() increments hint count
- [ ] calculateProgress() returns correct progress value
- [ ] Quiz completes when all words at state 3
- [ ] Adaptive difficulty updates with each answer

**Testing Instructions:**

```typescript
import { useQuizStore } from '@/shared/store/quizStore';

const store = useQuizStore.getState();
store.startQuiz('list-a', 'basic');

// Get first question
const q1 = store.currentQuestion;
console.log('Question 1:', q1?.type, q1?.word.word);

// Submit correct answer
const result = store.submitAnswer(q1!.word.word);
console.log('Correct:', result.isCorrect); // true

// Check stats
console.log('Correct answers:', store.sessionStats.correctAnswers); // 1

// Check word state updated
const wordIndex = 0; // Assuming first word
console.log('Word state:', store.currentSession!.answered[wordIndex]); // 1 or 2 depending on type

// Test progression
// State 0 → multiple choice → State 1
// State 1 → fill-in-blank → State 3
// State 0 → fill-in-blank → State 2
// State 2 → multiple choice → State 3

// Test hint
if (store.currentQuestion?.type === 'fillin') {
  const hint = store.useHint();
  console.log('Hint:', hint); // Definition text
  console.log('Hints used:', store.sessionStats.hintsUsed); // 1
}
```

**Commit Message Template:**
```
feat(quiz): implement answer submission and word state progression

- Add submitAnswer action with answer validation
- Integrate answerValidator for both question types
- Implement word state progression (0→1→2→3)
- Multiple choice correct: state 0→1, state 2→3
- Fill-in-blank correct: state 0→2, state 1→3
- Update session stats: correct, wrong, hints
- Add calculateProgress for progress bar
- Integrate adaptive difficulty performance tracking
- Add quiz completion detection (all words state 3)
- Add useHint action for fill-in-blank questions
```

**Estimated tokens:** ~14,000

---

### Task 6: Generate Multiple Choice Options

**Goal:** Implement logic to generate 4 multiple choice options (1 correct + 3 incorrect) for multiple choice questions, matching Android app behavior.

**Files to Create:**
- `src/features/quiz/utils/questionGenerator.ts` - Question generation utilities

**Prerequisites:**
- Task 2 complete (quiz store)

**Implementation Steps:**

1. **Create generateMultipleChoiceOptions function**
   - Accept correctWord: VocabularyWord and allWords: VocabularyWord[]
   - Return array of 4 word strings
   - 1 correct answer + 3 random incorrect answers from same level
   - Ensure no duplicates

2. **Implement option selection algorithm**
   - Port from Android app (MainActivity.java lines 327-362)
   - Randomize position of correct answer (0-3)
   - For each of 3 incorrect positions:
     - Pick random word from allWords
     - Ensure it's not the correct word
     - Ensure it's not already in options array (no duplicates)
   - Return array of 4 words

3. **Add randomization logic**
   - Use Math.random() to pick correct answer position
   - Use Math.random() to pick incorrect words
   - Ensure even distribution

4. **Handle edge cases**
   - If level has <4 words: not applicable (all levels have 8-10 words)
   - Prevent infinite loop if not enough unique words
   - Add max attempts counter (shouldn't be needed)

5. **Integrate with quizStore**
   - When generating multiple choice question in getNextQuestion()
   - Call generateMultipleChoiceOptions()
   - Store options in QuizQuestion object
   - Pass to UI component

6. **Add shuffle utility (optional)**
   - Shuffle function for arrays
   - Use Fisher-Yates algorithm
   - Alternative to position randomization

**Verification Checklist:**
- [ ] generateMultipleChoiceOptions() returns 4 unique words
- [ ] Correct answer included in options
- [ ] Correct answer position is randomized
- [ ] No duplicate words in options
- [ ] All options from same level
- [ ] Integrated with quizStore.getNextQuestion()
- [ ] QuizQuestion.options contains 4 strings
- [ ] UI component receives correct options

**Testing Instructions:**

```typescript
import { generateMultipleChoiceOptions } from './questionGenerator';

const allWords = vocabularyStore.getWordsByListLevel('list-a', 'basic');
const correctWord = allWords[0]; // "abject"

const options = generateMultipleChoiceOptions(correctWord, allWords);

console.log('Options:', options); // Array of 4 words
console.log('Includes correct:', options.includes(correctWord.word)); // true
console.log('Unique:', new Set(options).size === 4); // true

// Test randomization (run multiple times)
for (let i = 0; i < 10; i++) {
  const opts = generateMultipleChoiceOptions(correctWord, allWords);
  const position = opts.indexOf(correctWord.word);
  console.log(`Correct at position: ${position}`); // Should vary (0-3)
}
```

**Commit Message Template:**
```
feat(quiz): implement multiple choice option generation

- Create questionGenerator utility module
- Implement generateMultipleChoiceOptions function
- Generate 1 correct + 3 incorrect options from same level
- Randomize correct answer position (0-3)
- Ensure no duplicate words in options
- Port logic from Android app (MainActivity.java)
- Integrate with quizStore.getNextQuestion()
- Add QuizQuestion.options to store state
```

**Estimated tokens:** ~10,000

---

### Task 7: Integrate Quiz Logic with UI Components

**Goal:** Connect the quiz store and validation logic to the UI components from Phase 2, making the quiz fully functional.

**Files to Modify:**
- `src/features/quiz/screens/QuizScreen.tsx` - Connect to quiz store
- `src/features/quiz/components/MultipleChoiceQuestion.tsx` - Integrate with store
- `src/features/quiz/components/FillInBlankQuestion.tsx` - Integrate with store
- `src/features/quiz/components/QuizHeader.tsx` - Display real stats
- `src/features/quiz/components/AnswerFeedback.tsx` - Show on answer submission

**Prerequisites:**
- Task 5 complete (answer submission)
- Task 6 complete (option generation)
- Phase 2 UI components complete

**Implementation Steps:**

1. **Update QuizScreen to use quiz store**
   - Import useQuizStore
   - Get listId and levelId from route params (already done)
   - Call startQuiz(listId, levelId) in useEffect on mount
   - Subscribe to quiz state: currentQuestion, sessionStats, isQuizActive

2. **Implement answer submission handler**
   - Create handleSubmitAnswer(answer: string) callback
   - Call quizStore.submitAnswer(answer)
   - Get result: { isCorrect, correctAnswer }
   - Show AnswerFeedback component with result
   - Wait for feedback animation, then call getNextQuestion()

3. **Implement hint handler**
   - Create handleUseHint() callback
   - Call quizStore.useHint()
   - Get definition text
   - Display in UI (alert, modal, or inline)
   - Update hint count in header

4. **Update QuizHeader with real data**
   - Pass currentQuestionIndex from store
   - Pass total word count from current level
   - Pass sessionStats.hintsUsed
   - Pass sessionStats.wrongAnswers
   - Calculate progress: calculateProgress() / maxProgress

5. **Update MultipleChoiceQuestion component**
   - Receive options from currentQuestion.options
   - Receive onSelectAnswer callback
   - On button press, call onSelectAnswer(selectedWord)
   - Disable buttons after selection (prevent double-tap)
   - Show selected state briefly

6. **Update FillInBlankQuestion component**
   - Receive sentence from currentQuestion.word.fillInBlank
   - Receive onSubmitAnswer callback
   - Receive onUseHint callback
   - On submit, call onSubmitAnswer(userInput)
   - On hint button, call onUseHint()
   - Clear input after submission

7. **Implement quiz completion detection**
   - Check quizStore.isQuizComplete after each answer
   - If complete, navigate to GraduationScreen
   - Pass final stats in navigation params
   - Use useEffect to watch isQuizComplete

8. **Add answer feedback display**
   - Show AnswerFeedback component when answer submitted
   - Pass isCorrect from submission result
   - Auto-hide after animation
   - If wrong, optionally show correct answer

9. **Handle quiz exit**
   - On back button or close, confirm with user
   - If confirmed, call quizStore.endQuiz()
   - Navigate back to DifficultyScreen

**Verification Checklist:**
- [ ] QuizScreen starts quiz on mount
- [ ] Question displays correctly (definition or sentence)
- [ ] Multiple choice shows 4 options from store
- [ ] Fill-in-blank shows correct sentence
- [ ] Submitting answer validates and updates state
- [ ] Correct answer shows green feedback
- [ ] Wrong answer shows red feedback
- [ ] QuizHeader displays real progress and stats
- [ ] Hint button works and increments count
- [ ] Quiz completes and navigates to Graduation
- [ ] All word states progress correctly
- [ ] No UI regressions from Phase 2

**Testing Instructions:**

Complete quiz flow test:
```bash
npm start

# Navigate: Home → List A → Basic → Quiz
# QuizScreen should show:
# - Real question from list (definition or fill-in-blank)
# - Multiple choice: 4 actual word options
# - Fill-in-blank: actual sentence with blank

# Test correct answer:
# - Select/type correct answer
# - Should show "Correct!" feedback (green)
# - Progress bar should increase
# - Next question should appear

# Test wrong answer:
# - Select/type wrong answer
# - Should show "Wrong!" feedback (red)
# - Wrong count should increment
# - Next question should appear (same word may reappear)

# Test hint:
# - On fill-in-blank, click hint
# - Should show definition
# - Hint count should increment

# Complete quiz:
# - Answer all questions until all words mastered
# - Should automatically navigate to Graduation
# - Stats should be accurate
```

**Commit Message Template:**
```
feat(quiz): integrate quiz logic with UI components

- Connect QuizScreen to quizStore for session management
- Implement answer submission handler with validation
- Integrate MultipleChoiceQuestion with real options
- Integrate FillInBlankQuestion with real sentences
- Update QuizHeader with real progress and stats
- Add AnswerFeedback display on answer submission
- Implement hint functionality for fill-in-blank
- Add quiz completion detection and navigation
- Handle quiz exit with confirmation dialog
- Complete end-to-end quiz flow working
```

**Estimated tokens:** ~16,000

---

### Task 8: Update Graduation Screen with Real Stats

**Goal:** Display actual quiz performance statistics on the Graduation screen using data from quiz store.

**Files to Modify:**
- `src/features/quiz/screens/GraduationScreen.tsx` - Use real stats
- `src/features/quiz/screens/QuizScreen.tsx` - Pass stats on navigation

**Prerequisites:**
- Task 7 complete (quiz integration)

**Implementation Steps:**

1. **Pass stats from QuizScreen on completion**
   - When navigating to Graduation, get finalStats from quizStore
   - Structure: { hints: number, wrong: number }
   - For now, bestHints and bestWrong are 0 (Phase 4 will add real bests)
   - Pass listId, levelId, and stats in navigation params

2. **Update GraduationScreen to use route params**
   - Get stats from route.params
   - Destructure: { hints, wrong, bestHints, bestWrong }
   - Display in UI replacing placeholders

3. **Calculate session score**
   - Could create score formula: max(0, 100 - wrong * 5 - hints * 2)
   - Or just display raw metrics
   - Add score display if desired

4. **Update "Try Again" navigation**
   - On press, reset quiz for same list/level
   - Navigate back to QuizScreen with same listId/levelId
   - QuizScreen will call startQuiz() again

5. **Display best scores**
   - For now, show "Best: 0 hints, 0 wrong" (placeholders)
   - In Phase 4, fetch from progressStore
   - Add note: "Beat your best score!"

6. **Add all-time stats**
   - For now, placeholders: "All-time hints: 0"
   - In Phase 4, fetch from progressStore
   - Shows cumulative stats across all quizzes

**Verification Checklist:**
- [ ] GraduationScreen receives stats from route params
- [ ] Displays correct session hints and wrong answers
- [ ] Stats match actual quiz performance
- [ ] "Try Again" button restarts same quiz
- [ ] Navigation flow works correctly
- [ ] Placeholders present for best/all-time stats
- [ ] UI updates from Phase 2 preserved

**Testing Instructions:**

```bash
# Complete a quiz with known stats
# - Use hint 3 times
# - Get 2 answers wrong
# - Complete quiz

# GraduationScreen should display:
# - "Hints used: 3"
# - "Wrong answers: 2"
# - "Best score: 0 hints, 0 wrong" (placeholder)
# - "All-time hints: 0" (placeholder)

# Click "Try Again"
# - Should return to QuizScreen
# - Should start new session for same list/level
# - Stats should reset to 0
```

**Commit Message Template:**
```
feat(graduation): display real quiz statistics

- Update GraduationScreen to use route params stats
- Display actual session hints and wrong answers
- Calculate and pass stats from QuizScreen on completion
- Update "Try Again" to restart quiz with reset stats
- Add placeholders for best scores (Phase 4)
- Add placeholders for all-time stats (Phase 4)
- Verify stats accuracy matches quiz performance
```

**Estimated tokens:** ~8,000

---

### Task 9: Add Quiz Store Unit Tests

**Goal:** Write comprehensive unit tests for quiz store logic to ensure correctness and prevent regressions.

**Files to Create:**
- `src/shared/store/__tests__/quizStore.test.ts` - Quiz store tests
- `src/shared/store/__tests__/adaptiveDifficultyStore.test.ts` - Adaptive tests
- `src/features/quiz/utils/__tests__/answerValidator.test.ts` - Validation tests
- `src/features/quiz/utils/__tests__/questionGenerator.test.ts` - Generator tests

**Prerequisites:**
- All quiz logic implemented (Tasks 1-8)

**Implementation Steps:**

1. **Test quiz store initialization**
   - Test startQuiz() creates session correctly
   - Test initial state is correct
   - Test session stats initialize to 0

2. **Test getNextQuestion()**
   - Test random word selection
   - Test skips mastered words (state 3)
   - Test question type based on word state
   - Test all words eventually get selected

3. **Test answer submission**
   - Test correct answer increments correctAnswers
   - Test wrong answer increments wrongAnswers
   - Test word state progression for all scenarios:
     - State 0 + multiple correct → State 1
     - State 0 + fillin correct → State 2
     - State 1 + fillin correct → State 3
     - State 2 + multiple correct → State 3
     - Wrong answer → state unchanged

4. **Test answer validation**
   - Test validateMultipleChoice with exact matches
   - Test validateFillInBlank with exact matches
   - Test tolerance: 1 char difference accepted
   - Test word variations (s, ed, ing, ly)
   - Test case insensitivity
   - Test edge cases (empty, short strings)

5. **Test adaptive difficulty**
   - Test performance tracking updates accuracy
   - Test getOptimalQuestionType for wordState 0
   - Test bias when user excels (>80% MC accuracy)
   - Test bias when user struggles (<50% FIB accuracy)
   - Test minimum attempts threshold

6. **Test question generation**
   - Test generates 4 unique options
   - Test includes correct answer
   - Test no duplicates
   - Test correct answer position randomized

7. **Test quiz completion**
   - Test isQuizComplete false initially
   - Test isQuizComplete true when all words state 3
   - Test endQuiz() returns correct stats

8. **Test edge cases**
   - Test with minimum word count (8 words)
   - Test with maximum word count (10 words)
   - Test rapid answer submissions
   - Test quiz restart

**Verification Checklist:**
- [ ] Quiz store tests written (15+ tests)
- [ ] Adaptive difficulty tests written (8+ tests)
- [ ] Answer validator tests written (20+ tests)
- [ ] Question generator tests written (5+ tests)
- [ ] All tests pass: `npm test`
- [ ] Test coverage >85% for quiz logic
- [ ] Tests are fast (<5 seconds total)
- [ ] Tests are deterministic (no flakiness)

**Testing Instructions:**

```bash
# Run quiz tests
npm test quizStore.test.ts

# Run all quiz-related tests
npm test -- --testPathPattern=quiz

# Run with coverage
npm test -- --coverage --testPathPattern=quiz

# Expected output:
# Test Suites: 4 passed
# Tests: 48+ passed
# Coverage: >85% for quiz logic files
```

**Commit Message Template:**
```
test(quiz): add comprehensive quiz logic tests

- Add quizStore unit tests (15+ tests)
- Test session management, question generation, answer submission
- Test word state progression for all scenarios
- Add answerValidator tests (20+ tests)
- Test exact matches, tolerance, word variations
- Add adaptiveDifficultyStore tests (8+ tests)
- Test performance tracking and adaptive logic
- Add questionGenerator tests (5+ tests)
- Test option generation and randomization
- Achieve >85% coverage for quiz logic
```

**Estimated tokens:** ~14,000

---

### Task 10: Add Integration Tests for Quiz Flow

**Goal:** Write integration tests that verify the complete quiz flow from start to completion, ensuring all components work together correctly.

**Files to Create:**
- `src/features/quiz/__tests__/quizFlow.integration.test.tsx` - End-to-end quiz flow tests

**Prerequisites:**
- Task 9 complete (unit tests)
- All quiz logic and UI integrated

**Implementation Steps:**

1. **Set up integration test environment**
   - Render QuizScreen with navigation mock
   - Provide store providers (vocabulary, quiz, adaptive)
   - Mock route params with test listId/levelId
   - Use React Native Testing Library

2. **Test quiz initialization**
   - Render QuizScreen
   - Verify quiz starts automatically
   - Verify first question displays
   - Verify QuizHeader shows correct info

3. **Test answering questions correctly**
   - Render quiz
   - Find and press correct answer button (multiple choice)
   - Verify "Correct!" feedback appears
   - Verify progress increases
   - Verify next question loads

4. **Test answering questions incorrectly**
   - Submit wrong answer
   - Verify "Wrong!" feedback appears
   - Verify wrong count increments
   - Verify word state doesn't progress

5. **Test fill-in-blank submission**
   - Get fill-in-blank question
   - Type answer in input
   - Press submit button
   - Verify validation and state update

6. **Test hint usage**
   - Get fill-in-blank question
   - Press hint button
   - Verify hint displays
   - Verify hint count increments

7. **Test quiz completion**
   - Answer all questions correctly
   - Verify navigation to GraduationScreen
   - Verify stats passed correctly

8. **Test quiz exit**
   - Start quiz
   - Press back/exit button
   - Verify confirmation dialog appears
   - Confirm exit
   - Verify navigation back

9. **Test quiz restart**
   - Complete quiz
   - On GraduationScreen, press "Try Again"
   - Verify returns to QuizScreen
   - Verify new session starts

**Verification Checklist:**
- [ ] Integration tests written (8+ scenarios)
- [ ] Tests cover complete quiz flow
- [ ] Tests verify UI and store integration
- [ ] Tests check correct navigation
- [ ] All integration tests pass
- [ ] Tests are deterministic
- [ ] Tests provide good error messages on failure

**Testing Instructions:**

```bash
# Run integration tests
npm test quizFlow.integration.test.tsx

# Expected: All scenarios pass
# Quiz starts → Answer questions → Complete → Navigate to Graduation
```

**Commit Message Template:**
```
test(quiz): add integration tests for quiz flow

- Create quizFlow integration tests
- Test quiz initialization and first question
- Test answering multiple choice questions
- Test answering fill-in-blank questions
- Test hint usage and count tracking
- Test quiz completion and navigation
- Test quiz exit with confirmation
- Test quiz restart from graduation
- Verify complete end-to-end flow works correctly
```

**Estimated tokens:** ~12,000

---

## Phase Verification

### Complete Phase Checklist

Before moving to Phase 4, verify all tasks complete:

- [ ] **Task 1:** Vocabulary store implemented
- [ ] **Task 2:** Quiz store session management implemented
- [ ] **Task 3:** Answer validation logic implemented
- [ ] **Task 4:** Adaptive difficulty algorithm implemented
- [ ] **Task 5:** Answer submission and word state progression implemented
- [ ] **Task 6:** Multiple choice option generation implemented
- [ ] **Task 7:** Quiz logic integrated with UI components
- [ ] **Task 8:** Graduation screen updated with real stats
- [ ] **Task 9:** Quiz store unit tests written (>85% coverage)
- [ ] **Task 10:** Integration tests for quiz flow written

### Integration Testing

Complete quiz flow manually:
```bash
npm start

# Test flow:
# 1. Navigate: Home → List A → Basic
# 2. Quiz starts automatically
# 3. Answer multiple choice correctly → Feedback → Next question
# 4. Answer fill-in-blank correctly → Feedback → Next question
# 5. Use hint on fill-in-blank → Definition shows → Hint count increments
# 6. Answer question incorrectly → Wrong feedback → Wrong count increments
# 7. Complete all words (reach state 3 for all) → Navigate to Graduation
# 8. Graduation shows correct stats
# 9. Click "Try Again" → Returns to quiz with reset stats

# All should work smoothly with no errors
```

### Quality Checks

```bash
npm run lint           # Should pass
npm run type-check     # Should pass
npm test               # All tests pass (unit + integration)
npm test -- --coverage # >85% coverage for quiz logic
```

### Functional Verification

- [ ] Quiz starts with first question
- [ ] Multiple choice shows 4 unique options
- [ ] Fill-in-blank shows sentence with blank
- [ ] Correct answers validated properly
- [ ] Wrong answers handled correctly
- [ ] Tolerance algorithm works (typos, variations)
- [ ] Word states progress: 0→1→2→3
- [ ] Adaptive difficulty adjusts question types
- [ ] Hints work and increment count
- [ ] Progress bar increases correctly
- [ ] Quiz completes when all words mastered
- [ ] Stats displayed accurately on Graduation
- [ ] "Try Again" restarts quiz

### Store State Verification

Check Zustand DevTools or log store state:
```typescript
// After completing quiz
const quizState = useQuizStore.getState();
console.log('Session stats:', quizState.sessionStats);
// Should show actual hints, wrong, correct counts

const vocabState = useVocabularyStore.getState();
console.log('Lists loaded:', vocabState.vocabularyLists.length); // 8

const adaptiveState = useAdaptiveDifficultyStore.getState();
console.log('MC Accuracy:', adaptiveState.multipleChoiceAccuracy);
console.log('FIB Accuracy:', adaptiveState.fillInBlankAccuracy);
```

---

## Known Limitations & Technical Debt

### Limitations Introduced in Phase 3

1. **No Progress Persistence**
   - Quiz progress not saved across app restarts
   - Word states reset when app closed
   - Will be implemented in Phase 4

2. **No Best Scores Yet**
   - Best scores show placeholders on Graduation
   - Need progressStore to track bests
   - Will be implemented in Phase 4

3. **No All-Time Stats**
   - All-time hints/wrong show placeholders
   - Need global stats tracking
   - Will be implemented in Phase 4

4. **Adaptive Difficulty Resets**
   - Performance stats reset on app restart
   - Could persist for better long-term adaptation
   - Consider in Phase 5

### Technical Debt

1. **No Persistence**
   - Quiz session lost if app backgrounded
   - Consider saving currentSession to AsyncStorage
   - Phase 4 will add full persistence

2. **Limited Error Handling**
   - Store actions don't handle all edge cases
   - Need better error boundaries
   - Consider adding retry logic

3. **Performance**
   - Random word selection could be optimized
   - Consider pre-shuffling word order
   - Not critical for current word counts

### Migration to Phase 4

Phase 3 made the quiz fully functional. Phase 4 will add persistence:
- AsyncStorage integration for progress
- Best scores per list/level
- All-time statistics tracking
- Progress restoration on app restart
- Data migration for existing users

**Proceed to:** [Phase 4: Progress Tracking & Persistence](./Phase-4.md)

---

*Phase 3 Complete! Your quiz is now fully functional with intelligent question selection and accurate scoring.*
