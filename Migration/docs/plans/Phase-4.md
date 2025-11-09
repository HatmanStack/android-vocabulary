# Phase 4: Progress Tracking & Persistence

## Phase Goal

Implement comprehensive progress tracking and data persistence using AsyncStorage and Zustand, enabling users to save their learning progress, track best scores, view all-time statistics, and resume quizzes across app restarts. This phase transforms the app from a session-based quiz into a persistent learning platform.

**Success Criteria:**
- User progress persists across app restarts
- Word states (0-3) saved and restored for all lists/levels
- Best scores per list/level tracked and displayed
- All-time statistics accumulated correctly
- Progress visible on HomeScreen and StatsScreen
- AsyncStorage integration with Zustand working
- Data migration strategy for future updates
- >80% test coverage for progress logic

**Estimated tokens:** ~92,000

---

## Prerequisites

- [ ] Phase 3 completely finished (quiz logic working)
- [ ] Quiz flow functional end-to-end
- [ ] Zustand stores implemented
- [ ] Understanding of AsyncStorage API

---

## Tasks

### Task 1: Create AsyncStorage Wrapper Utility

**Goal:** Build a type-safe wrapper around AsyncStorage for consistent data persistence throughout the app.

**Files to Create:**
- `src/shared/lib/storage.ts` - AsyncStorage wrapper with type safety

**Implementation Steps:**

1. **Create storage utility functions**
   - `getItem<T>(key: string): Promise<T | null>` - Get and parse JSON
   - `setItem<T>(key: string, value: T): Promise<void>` - Stringify and store
   - `removeItem(key: string): Promise<void>` - Delete key
   - `clear(): Promise<void>` - Clear all storage
   - Add error handling and logging

2. **Add storage keys constants**
   - Define all storage keys in one place
   - `STORAGE_KEYS` object with USER_PROGRESS, SETTINGS, etc.
   - Prevents typos and enables refactoring

3. **Implement data migration helper**
   - `migrate(oldVersion: string, newVersion: string): Promise<void>`
   - For future schema changes
   - Placeholder for now, implement when needed

**Verification:**
- [ ] Storage utility functions work correctly
- [ ] Type safety enforced (TypeScript)
- [ ] Error handling prevents crashes
- [ ] Storage keys centralized

**Commit:** `feat(storage): create AsyncStorage wrapper utility`

**Estimated tokens:** ~6,000

---

### Task 2: Create Progress Store

**Goal:** Implement Zustand store for managing user progress with AsyncStorage persistence.

**Files to Create:**
- `src/shared/store/progressStore.ts` - Progress tracking and persistence

**Implementation Steps:**

1. **Define progress store state**
   - `wordProgress: Record<string, WordProgress>` - Progress for each word (keyed by wordId)
   - `listLevelProgress: Record<string, ListLevelProgress>` - Progress per list/level
   - `globalStats: GlobalStats` - All-time statistics
   - `isLoading: boolean` - Loading state
   - `lastSyncedAt: string` - Last save timestamp

2. **Implement Zustand persist middleware**
   - Use `persist` middleware from zustand/middleware
   - Configure with AsyncStorage backend
   - Set storage key: 'vocabulary-progress'
   - Enable automatic persistence

3. **Implement word progress actions**
   - `updateWordProgress(wordId, listId, levelId, newState)` - Update single word
   - `getWordProgress(wordId)` - Get progress for word
   - `getListLevelProgress(listId, levelId)` - Get all words for list/level
   - Update both wordProgress and listLevelProgress records

4. **Implement session stats actions**
   - `startSession(listId, levelId)` - Initialize session stats
   - `updateSessionStats(hints, wrong, correct)` - Update current session
   - `endSession(listId, levelId, stats)` - Finalize and save session

5. **Implement best score tracking**
   - `updateBestScore(listId, levelId, stats)` - Update if better than previous
   - `getBestScore(listId, levelId)` - Retrieve best score
   - Compare: better = fewer hints AND fewer wrong answers
   - Store in listLevelProgress[key].bestScore

6. **Implement global stats tracking**
   - `incrementGlobalStats(hints, wrong, correct)` - Add to all-time totals
   - `getGlobalStats()` - Return all-time statistics
   - Track: total hints, wrong, correct, words learned, lists completed

7. **Implement progress calculation**
   - `calculateListProgress(listId)` - % complete for entire list
   - `calculateLevelProgress(listId, levelId)` - % complete for level
   - `getTotalWordsLearned()` - Count words at state 3 across all lists

8. **Add data reset functionality**
   - `resetListLevelProgress(listId, levelId)` - Reset specific level
   - `resetAllProgress()` - Clear all progress (with confirmation)

**Verification:**
- [ ] Progress store persists to AsyncStorage
- [ ] Word states saved and restored correctly
- [ ] Best scores tracked per list/level
- [ ] Global stats accumulate correctly
- [ ] Data survives app restart

**Commit:** `feat(progress): implement progress store with persistence`

**Estimated tokens:** ~15,000

---

### Task 3: Integrate Progress Store with Quiz Store

**Goal:** Connect progress tracking to the quiz flow so progress is saved during quizzes.

**Files to Modify:**
- `src/shared/store/quizStore.ts` - Integrate with progressStore

**Implementation Steps:**

1. **Load progress on quiz start**
   - In `startQuiz()`, load existing word states from progressStore
   - Initialize answered array with saved states instead of all 0s
   - Allow resuming partially completed levels

2. **Save progress after each answer**
   - In `submitAnswer()`, call progressStore.updateWordProgress()
   - Save word state immediately after updating
   - Update session stats in progressStore

3. **Save best scores on quiz completion**
   - In `endQuiz()`, compare session stats with best scores
   - Call progressStore.updateBestScore() if better
   - Update global stats with session totals

4. **Update global statistics**
   - On quiz completion, call progressStore.incrementGlobalStats()
   - Pass session hints, wrong, correct totals
   - Increment words learned count

5. **Handle quiz interruption**
   - Save progress even if quiz not completed
   - On app backgrounding/closing, persist current state
   - User can resume next session

**Verification:**
- [ ] Word states loaded from storage on quiz start
- [ ] Progress saved after each answer
- [ ] Best scores updated on completion
- [ ] Global stats increment correctly
- [ ] Progress persists if quiz interrupted

**Commit:** `feat(quiz): integrate progress tracking with quiz flow`

**Estimated tokens:** ~10,000

---

### Task 4: Update UI to Display Progress

**Goal:** Show real progress data throughout the app UI.

**Files to Modify:**
- `src/features/vocabulary/screens/HomeScreen.tsx` - Show list progress
- `src/features/vocabulary/components/ListCard.tsx` - Add progress indicator
- `src/features/vocabulary/screens/DifficultyScreen.tsx` - Show level progress
- `src/features/quiz/screens/GraduationScreen.tsx` - Show best scores
- `src/features/progress/screens/StatsScreen.tsx` - Show all statistics

**Implementation Steps:**

1. **Update ListCard with progress**
   - Get list progress from progressStore
   - Show ProgressBar: "24 / 40 words learned (60%)"
   - Color code: green if complete, blue if in progress
   - Show checkmark if list fully completed

2. **Update HomeScreen progress display**
   - Load progress for all lists on mount
   - Pass progress to each ListCard
   - Show overall completion: "3 / 8 lists completed"

3. **Update DifficultyScreen with level progress**
   - Get progress for each level in selected list
   - Show on LevelButton: "8 / 10 words" or checkmark if complete
   - Highlight completed levels with different color

4. **Update GraduationScreen with real best scores**
   - Get bestScore from progressStore for current list/level
   - Replace placeholders with real data
   - Show comparison: "Previous best: 2 hints, 1 wrong"
   - Celebrate if new best: "New best score!"

5. **Update StatsScreen with real data**
   - Get globalStats from progressStore
   - Display:
     - Total words learned
     - All-time hints used
     - All-time wrong answers
     - Lists completed count
   - Add list completion overview with progress bars
   - Show recent quiz sessions (from listLevelProgress)

**Verification:**
- [ ] HomeScreen shows real progress for all lists
- [ ] DifficultyScreen shows real progress for all levels
- [ ] GraduationScreen shows real best scores
- [ ] StatsScreen shows accurate all-time statistics
- [ ] Progress updates immediately after quiz completion

**Commit:** `feat(ui): display real progress data throughout app`

**Estimated tokens:** ~12,000

---

### Task 5: Implement Progress Reset Functionality

**Goal:** Allow users to reset progress for individual levels or entire app.

**Files to Modify:**
- `src/features/quiz/screens/GraduationScreen.tsx` - Add reset option
- `src/features/settings/screens/SettingsScreen.tsx` - Add reset all option

**Implementation Steps:**

1. **Add "Reset This Level" to GraduationScreen**
   - Add button: "Reset and Try Again"
   - Show confirmation dialog
   - On confirm, call progressStore.resetListLevelProgress()
   - Navigate back to QuizScreen with fresh start

2. **Add "Reset All Progress" to SettingsScreen**
   - Add button in danger zone section (red)
   - Show strong confirmation: "Are you sure? This cannot be undone."
   - On confirm, call progressStore.resetAllProgress()
   - Show success message
   - Navigate to HomeScreen

3. **Implement reset logic in progressStore**
   - `resetListLevelProgress()`: Clear word states for level
   - `resetAllProgress()`: Clear entire storage
   - Preserve settings (only clear progress data)

**Verification:**
- [ ] "Reset This Level" clears level progress only
- [ ] "Reset All Progress" clears all progress
- [ ] Confirmations prevent accidental resets
- [ ] Settings preserved after progress reset

**Commit:** `feat(progress): add progress reset functionality`

**Estimated tokens:** ~8,000

---

### Task 6: Add List Completion Tracking

**Goal:** Track which lists have been fully completed and show completion status.

**Files to Modify:**
- `src/shared/store/progressStore.ts` - Add completion tracking
- UI files from Task 4

**Implementation Steps:**

1. **Implement completion detection**
   - `isListCompleted(listId)`: Check if all levels at 100%
   - `isLevelCompleted(listId, levelId)`: Check if all words state 3
   - Store completion timestamps

2. **Track completion events**
   - When level completes, record timestamp
   - When list completes, add to listsCompleted array
   - Show completion badge/trophy in UI

3. **Add "completed" visual indicators**
   - Checkmark on completed ListCards
   - Trophy icon on completed levels
   - Special styling for completed items

**Verification:**
- [ ] Completion detected correctly
- [ ] Timestamps recorded
- [ ] UI shows completion status

**Commit:** `feat(progress): add list completion tracking`

**Estimated tokens:** ~7,000

---

### Task 7: Implement Progress Export/Import

**Goal:** Allow users to export progress data for backup and import on new device.

**Files to Create:**
- `src/features/settings/utils/progressExport.ts` - Export/import utilities

**Files to Modify:**
- `src/features/settings/screens/SettingsScreen.tsx` - Add export/import buttons

**Implementation Steps:**

1. **Implement export functionality**
   - `exportProgress()`: Serialize progressStore to JSON string
   - On web: Download as JSON file
   - On mobile: Share using Share API
   - Include version number for future compatibility

2. **Implement import functionality**
   - `importProgress(jsonString)`: Parse and validate JSON
   - Merge with existing progress (or replace based on user choice)
   - Show import confirmation with preview

3. **Add UI buttons in SettingsScreen**
   - "Export Progress" button
   - "Import Progress" button
   - Show success/error messages

**Verification:**
- [ ] Export creates valid JSON file
- [ ] Import restores progress correctly
- [ ] Version compatibility checked

**Commit:** `feat(settings): add progress export/import`

**Estimated tokens:** ~9,000

---

### Task 8: Add Progress Loading States

**Goal:** Show loading indicators while progress data loads from AsyncStorage.

**Files to Modify:**
- `src/app/App.tsx` - Add app-level loading
- Various screens - Handle loading states

**Implementation Steps:**

1. **Add app initialization loading**
   - In App.tsx, wait for progress to load before rendering
   - Show LoadingIndicator while loading
   - Handle load errors gracefully

2. **Add loading states to screens**
   - HomeScreen: Show skeleton while loading list progress
   - StatsScreen: Show loading for statistics
   - Handle slow storage reads

3. **Implement optimistic updates**
   - Update UI immediately
   - Persist in background
   - Revert if save fails (rare)

**Verification:**
- [ ] Loading indicators shown appropriately
- [ ] No blank screens during data load
- [ ] Errors handled gracefully

**Commit:** `feat(progress): add loading states and error handling`

**Estimated tokens:** ~7,000

---

### Task 9: Add Progress Store Tests

**Goal:** Write comprehensive tests for progress tracking logic.

**Files to Create:**
- `src/shared/store/__tests__/progressStore.test.ts`

**Implementation Steps:**

1. **Test word progress tracking**
   - Test updateWordProgress saves correctly
   - Test state progression saved
   - Test retrieval of word progress

2. **Test best score logic**
   - Test better score updates best
   - Test worse score doesn't update best
   - Test first completion sets best

3. **Test global stats**
   - Test stats accumulate across sessions
   - Test words learned count
   - Test lists completed tracking

4. **Test persistence**
   - Test data saves to AsyncStorage
   - Test data loads on initialization
   - Mock AsyncStorage for testing

5. **Test reset functionality**
   - Test reset list level
   - Test reset all progress
   - Verify data cleared

**Verification:**
- [ ] >85% test coverage for progressStore
- [ ] All tests pass
- [ ] AsyncStorage properly mocked

**Commit:** `test(progress): add comprehensive progress store tests`

**Estimated tokens:** ~10,000

---

### Task 10: Performance Optimization for Progress Data

**Goal:** Optimize progress data storage and retrieval for performance.

**Files to Modify:**
- `src/shared/store/progressStore.ts`
- `src/shared/lib/storage.ts`

**Implementation Steps:**

1. **Implement selective persistence**
   - Only persist changed data, not entire store
   - Use Zustand's partialize option
   - Debounce saves (don't save on every answer)

2. **Optimize data structure**
   - Flatten nested objects where possible
   - Index by composite keys for faster lookup
   - Remove redundant data

3. **Add caching layer**
   - Cache frequently accessed progress in memory
   - Reduce AsyncStorage reads
   - Invalidate cache on updates

4. **Implement batch updates**
   - Batch multiple word updates into single save
   - Useful for quiz completion (multiple words may update)

**Verification:**
- [ ] Progress saves don't cause UI lag
- [ ] Data loads quickly on app start
- [ ] Storage size reasonable (<1MB for full progress)

**Commit:** `perf(progress): optimize progress data persistence`

**Estimated tokens:** ~8,000

---

## Phase Verification

### Complete Phase Checklist

- [ ] **Task 1:** AsyncStorage wrapper created
- [ ] **Task 2:** Progress store implemented with persistence
- [ ] **Task 3:** Progress integrated with quiz flow
- [ ] **Task 4:** UI updated to show real progress
- [ ] **Task 5:** Reset functionality added
- [ ] **Task 6:** Completion tracking implemented
- [ ] **Task 7:** Export/import functionality added
- [ ] **Task 8:** Loading states added
- [ ] **Task 9:** Progress tests written (>85% coverage)
- [ ] **Task 10:** Performance optimized

### Integration Testing

```bash
# Complete flow test:
# 1. Start fresh app (clear storage)
# 2. Complete List A Basic → Progress saves
# 3. Close and restart app → Progress restored
# 4. Check HomeScreen → Shows 8/40 words learned
# 5. Check StatsScreen → Shows accurate stats
# 6. Complete level → Best score saves
# 7. Try again with worse score → Best score unchanged
# 8. Export progress → JSON file created
# 9. Reset all progress → Storage cleared
# 10. Import progress → Previous state restored
```

### Quality Checks

```bash
npm run lint
npm run type-check
npm test
npm test -- --coverage # >85% for progress logic
```

**🔍 Code Review Questions:**

> **Q1 - AsyncStorage Mock Missing:** Running `npm test` shows 9 test suites failing with the same error:
> ```
> [@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.
> If this happens while testing with Jest, check out how to integrate AsyncStorage here:
> https://react-native-async-storage.github.io/async-storage/docs/advanced/jest
> ```
> **Consider:** The progressStore.ts imports AsyncStorage directly (line 10), causing all tests importing progressStore to fail. According to the AsyncStorage Jest documentation, AsyncStorage needs to be mocked in Jest setup. Should a `jest.setup.js` file be created with `jest.mock('@react-native-async-storage/async-storage')` to allow tests to run?
>
> **Affected test suites:** quizStore.test.ts, progressStore.test.ts, QuizScreen.test.tsx, GraduationScreen.test.tsx, HomeScreen.test.tsx, DifficultyScreen.test.tsx, SettingsScreen.test.tsx, StatsScreen.test.tsx (8 failed due to this issue)

> **Q2 - Best Score Tracking Tests Failing:** In progressStore.test.ts, 4 tests related to best score tracking are failing:
> - "sets initial best score on first completion" (line 108: `expect(bestScore).toBeDefined()` fails)
> - "updates best score when new score is better"
> - "updates best score when hints same but fewer wrong"
> - "does not update best score when new score is worse"
>
> **Think about:** The test calls `endSession('list-a', 'basic', { hints: 2, wrong: 1, correct: 10 })` and expects `getBestScore('list-a', 'basic')` to return a defined value. Looking at the progressStore implementation, does `endSession` actually call `updateBestScore`? Or is there a missing connection between ending a session and tracking the best score?

> **Q3 - TypeScript Compilation Errors:** Running `npm run type-check` shows 5 TypeScript errors:
> - `storage.ts(84,5)`: Type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'
>   - **Consider:** AsyncStorage.getAllKeys() returns `Promise<readonly string[]>` but the function signature promises `Promise<string[]>`. Should the return type be changed to `Promise<readonly string[]>`?
> - `SettingsScreen.tsx(128,71)`: Type '{ color: string; }' is not assignable to type 'StyleProp<ViewStyle>'
> - `SettingsScreen.tsx(195,70)`: Type '{ color: string; }' is not assignable to type 'StyleProp<ViewStyle>'
>   - **Think about:** Are color props being passed to components expecting ViewStyle? Should these use TextStyle or be restructured?
> - `parseXmlToJson.ts` errors (2): Phase 1 legacy issues still unresolved
>
> **Reflect:** The quality check at line 512 requires type-check to pass. Should these TypeScript errors be fixed before Phase 4 approval?

> **Q4 - Missing Task 7: Progress Export/Import:** The plan specifies Task 7 (lines 317-353) requiring:
> - File: `src/features/settings/utils/progressExport.ts`
> - Functions: `exportProgress()`, `importProgress()`
> - UI: Export/Import buttons in SettingsScreen
>
> **Verify:** Running `grep -r "exportProgress\|importProgress" src/` finds no matches. The task commit message should be `feat(settings): add progress export/import` but this commit doesn't exist. Was Task 7 implemented? If not, how can Phase 4 be complete without this backup functionality?

> **Q5 - Missing Task 8: Loading States:** Task 8 (lines 356-390) requires:
> - App.tsx: Wait for progress to load before rendering, show LoadingIndicator
> - Screens: Show skeleton/loading states while loading progress
>
> **Consider:** Reading `src/app/App.tsx` shows it's unchanged - just renders `<Providers><Navigation /></Providers>` with no loading logic. Should `useProgressStore` be accessed in App.tsx to check `_hydrated` state before showing the main UI? How does the app handle the AsyncStorage load delay on startup?

> **Q6 - Missing Task 10: Performance Optimization:** Task 10 (lines 437-474) requires:
> - Implement selective persistence (Zustand partialize option)
> - Debounce saves
> - Add caching layer
> - Implement batch updates
>
> **Reflect:** The commit history shows no `perf(progress): optimize progress data persistence` commit. Are there performance optimizations in progressStore.ts? Or was this task deferred? The specification lists this as Task 10 of 10, suggesting it's required for phase completion.

> **Q7 - Code Formatting:** Running `npm run format:check` reports:
> ```
> [warn] src/features/quiz/screens/GraduationScreen.tsx
> [warn] src/shared/lib/levenshtein.ts
> [warn] src/shared/store/adaptiveDifficultyStore.ts
> [warn] src/shared/store/progressStore.ts
> [warn] src/shared/store/quizStore.ts
> Code style issues found in 5 files.
> ```
> **Consider:** progressStore.ts is a Phase 4 file that should be properly formatted. Should `npm run format` be executed on Phase 4 files before committing?

> **Q8 - Phase 3 Issues Unresolved:** The adaptiveDifficultyStore.test.ts failures from Phase 3 Review (Q1) still persist:
> - 4 tests failing with the same pattern: after calling store mutations, tests read stale state
>
> **Think about:** Phase 4 builds on Phase 3's quiz logic. Should Phase 3 test failures be resolved before Phase 4 is approved? Or can these persist into later phases?

---

## Known Limitations & Technical Debt

1. **No Cloud Sync** - Progress only stored locally (future: Firebase/Supabase)
2. **No Backup Automation** - User must manually export (future: auto-backup)
3. **No Conflict Resolution** - Import replaces (future: merge strategies)

### Migration to Phase 5

Phase 4 added persistence. Phase 5 will add enhancements:
- Achievement system
- Progress visualizations with charts
- Theme toggle functionality
- Sound effects and haptics
- Advanced statistics

**Proceed to:** [Phase 5: Enhanced Features & Polish](./Phase-5.md)

---

*Phase 4 Complete! Progress now persists across app restarts with full statistics tracking.*
