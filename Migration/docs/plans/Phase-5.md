# Phase 5: Enhanced Features & Polish

## Phase Goal

Elevate the user experience with engaging enhancements including an achievement system, progress visualizations, functional theme toggle, sound effects, haptic feedback, and UI polish. This phase transforms the app from functional to delightful, encouraging continued learning through gamification and personalization.

**Success Criteria:**
- Achievement system with badges unlocked based on milestones
- Progress charts visualizing learning trends over time
- Theme toggle (Light/Dark/Auto) functional with persistence
- Sound effects on interactions (optional, toggleable)
- Haptic feedback on mobile (toggleable)
- Settings fully functional
- Onboarding for new users
- Accessibility improvements (screen readers, contrast)
- All UI polished with consistent styling

**Estimated tokens:** ~88,000

---

## Prerequisites

- [ ] Phase 4 complete (progress tracking working)
- [ ] All progress data persisting correctly
- [ ] Statistics displaying accurately

---

## Tasks

### Task 1: Implement Achievement System

**Goal:** Create a gamified achievement system that rewards users for reaching learning milestones.

**Files to Create:**
- `src/features/progress/utils/achievements.ts` - Achievement definitions and logic
- `src/features/progress/components/AchievementBadge.tsx` - Badge display component
- `src/features/progress/components/AchievementUnlockModal.tsx` - Celebration modal

**Files to Modify:**
- `src/shared/store/progressStore.ts` - Add achievement tracking
- `src/features/progress/screens/StatsScreen.tsx` - Display achievements

**Implementation Steps:**

1. **Define achievement list**
   - First Steps: Complete first quiz
   - Quick Learner: Complete a level in under 5 minutes
   - Perfect Score: Complete level with 0 hints, 0 wrong
   - Consistent Learner: 7-day streak
   - Word Master: Learn 100 words
   - List Completionist: Complete all 5 levels in one list
   - Achievement Hunter: Unlock all achievements
   - 10+ achievements total

2. **Implement achievement checking logic**
   - `checkAchievements(progress: UserProgress): Achievement[]`
   - Check after each quiz completion
   - Return newly unlocked achievements
   - Store in progressStore.achievements array

3. **Create AchievementBadge component**
   - Display badge icon, name, description
   - Show locked/unlocked state
   - Grayscale for locked, color for unlocked
   - Click to view details

4. **Create AchievementUnlockModal**
   - Show when achievement unlocked
   - Animated celebration (confetti, fade-in)
   - "Congrats! You unlocked: [Achievement]"
   - Auto-dismiss or tap to close

5. **Integrate with quiz flow**
   - After quiz completion, check for new achievements
   - Show modal if any unlocked
   - Save unlocked achievements to storage

6. **Display on StatsScreen**
   - Section: "Achievements"
   - Grid of all achievements
   - Show progress bars for progressive achievements
   - Highlight recently unlocked

**Verification:**
- [ ] Achievements unlock at correct milestones
- [ ] Unlock modal displays with animation
- [ ] Achievements persist in storage
- [ ] StatsScreen shows all achievements

**Commit:** `feat(achievements): implement achievement system with gamification`

**Estimated tokens:** ~12,000

---

### Task 2: Add Progress Visualization with Charts

**Goal:** Create visual charts showing learning progress over time.

**Files to Create:**
- `src/features/progress/components/ProgressChart.tsx` - Chart component
- `src/features/progress/components/WordMasteryHeatmap.tsx` - Heatmap visualization

**Dependencies:**
- Install: `react-native-chart-kit` or `react-native-svg-charts`

**Implementation Steps:**

1. **Install chart library**
   - `npm install react-native-chart-kit react-native-svg`
   - Choose react-native-chart-kit for simplicity

2. **Create ProgressChart component**
   - Line chart showing words learned over time
   - X-axis: dates (last 30 days)
   - Y-axis: cumulative words learned
   - Use progressStore to get historical data

3. **Add historical data tracking**
   - Store daily snapshots in progressStore
   - `dailyProgress: Record<string, number>` (date → words learned)
   - Update daily on quiz completion

4. **Create WordMasteryHeatmap**
   - Show grid of all words colored by mastery level
   - State 0: light gray
   - State 1: light blue
   - State 2: blue
   - State 3: dark blue/green
   - Grid organized by list/level

5. **Add chart to StatsScreen**
   - Section: "Learning Progress"
   - Show ProgressChart
   - Show WordMasteryHeatmap
   - Add toggle to switch between views

**Verification:**
- [ ] ProgressChart displays correctly
- [ ] Chart data accurate
- [ ] Heatmap shows word states
- [ ] Charts responsive on all screen sizes

**Commit:** `feat(stats): add progress visualization charts`

**Estimated tokens:** ~10,000

---

### Task 3: Implement Theme Toggle (Dark Mode)

**Goal:** Make the theme toggle in SettingsScreen functional with Light/Dark/Auto modes.

**Files to Create:**
- `src/shared/store/settingsStore.ts` - Settings state with persistence

**Files to Modify:**
- `src/shared/lib/theme.ts` - Add theme selection logic
- `src/app/providers.tsx` - Use settingsStore for theme
- `src/features/settings/screens/SettingsScreen.tsx` - Connect toggle

**Implementation Steps:**

1. **Create settingsStore**
   - State: theme ('light' | 'dark' | 'auto'), soundEnabled, hapticsEnabled
   - Use Zustand persist middleware
   - Save to AsyncStorage

2. **Implement theme selection logic**
   - `getActiveTheme()`: Return theme based on setting
   - If 'auto': use system preference (useColorScheme hook)
   - Return MD3LightTheme or MD3DarkTheme

3. **Update providers to use settingsStore**
   - In providers.tsx, get theme from settingsStore
   - Subscribe to theme changes
   - Apply theme to PaperProvider

4. **Connect SettingsScreen toggle**
   - Theme setting shows current value
   - On press, show menu with 3 options
   - Update settingsStore.theme on selection
   - Theme changes immediately (no restart)

5. **Test theme switching**
   - Switch between Light/Dark/Auto
   - Verify all screens update
   - Check theme persists across app restart

**Verification:**
- [ ] Theme toggle changes theme immediately
- [ ] Dark mode looks good on all screens
- [ ] Auto mode follows system preference
- [ ] Theme persists across restarts

**Commit:** `feat(theme): implement functional theme toggle with dark mode`

**Estimated tokens:** ~9,000

---

### Task 4: Add Sound Effects

**Goal:** Add optional sound effects for user interactions.

**Files to Create:**
- `src/shared/hooks/useSound.ts` - Sound playback hook
- `src/assets/sounds/correct.mp3` - Sound files (find free assets)
- `src/assets/sounds/wrong.mp3`
- `src/assets/sounds/complete.mp3`

**Dependencies:**
- `expo-av` (Audio/Video, included in Expo)

**Implementation Steps:**

1. **Find and add sound files**
   - Correct answer: pleasant chime
   - Wrong answer: gentle buzz
   - Quiz complete: celebration sound
   - Use royalty-free sounds (freesound.org, zapsplat.com)
   - Keep files small (<100KB each)

2. **Create useSound hook**
   - Load sound files with expo-av
   - `playCorrect()`, `playWrong()`, `playComplete()`
   - Check settingsStore.soundEnabled before playing
   - Handle errors gracefully

3. **Integrate with quiz flow**
   - Play correct sound on correct answer
   - Play wrong sound on wrong answer
   - Play complete sound on quiz completion
   - Respect sound toggle in settings

4. **Add sound toggle in SettingsScreen**
   - Already has UI from Phase 2
   - Connect to settingsStore.soundEnabled
   - Test toggle enables/disables sounds

**Verification:**
- [ ] Sounds play on correct/wrong answers
- [ ] Sounds respect toggle setting
- [ ] Sounds don't lag or stutter
- [ ] Works on iOS, Android, Web (Web may have limitations)

**Commit:** `feat(audio): add optional sound effects for interactions`

**Estimated tokens:** ~8,000

---

### Task 5: Add Haptic Feedback (Mobile Only)

**Goal:** Add tactile feedback on mobile devices for enhanced UX.

**Dependencies:**
- `expo-haptics` (included in Expo)

**Files to Create:**
- `src/shared/hooks/useHaptics.ts` - Haptic feedback hook

**Files to Modify:**
- Quiz components, buttons - Add haptic feedback

**Implementation Steps:**

1. **Create useHaptics hook**
   - `triggerLight()`: Light tap (button press)
   - `triggerMedium()`: Medium tap (correct answer)
   - `triggerHeavy()`: Heavy tap (wrong answer)
   - `triggerSuccess()`: Success pattern (quiz complete)
   - Check settingsStore.hapticsEnabled and Platform.OS !== 'web'

2. **Add haptics to quiz interactions**
   - Button press: light haptic
   - Correct answer: medium haptic + success pattern
   - Wrong answer: heavy haptic
   - Quiz complete: success pattern

3. **Add haptics to navigation**
   - Screen transition: light haptic
   - List/level selection: light haptic

4. **Connect toggle in SettingsScreen**
   - Already has UI from Phase 2
   - Connect to settingsStore.hapticsEnabled
   - Only show on mobile (hide on web)

**Verification:**
- [ ] Haptics feel good and not excessive
- [ ] Haptics respect toggle setting
- [ ] Only enabled on mobile (iOS, Android)
- [ ] Performance not impacted

**Commit:** `feat(haptics): add optional haptic feedback on mobile`

**Estimated tokens:** ~7,000

---

### Task 6: Implement Onboarding for New Users

**Goal:** Create first-time user onboarding explaining app features.

**Files to Create:**
- `src/features/onboarding/screens/OnboardingScreen.tsx` - Onboarding flow
- `src/features/onboarding/components/OnboardingSlide.tsx` - Individual slide

**Files to Modify:**
- `src/app/navigation.tsx` - Add onboarding screen
- `src/shared/store/settingsStore.ts` - Track if onboarding completed

**Implementation Steps:**

1. **Create onboarding slides**
   - Slide 1: Welcome, app overview
   - Slide 2: How quizzes work (multiple choice, fill-in-blank)
   - Slide 3: Progress tracking explained
   - Slide 4: Tips for learning (use hints, review mistakes)
   - 3-4 slides total, keep concise

2. **Create OnboardingScreen**
   - Swipeable carousel (use react-native-snap-carousel or similar)
   - Progress dots at bottom
   - "Skip" button (top right)
   - "Next" / "Get Started" button

3. **Add onboarding logic**
   - Check settingsStore.onboardingCompleted on app start
   - If false, show OnboardingScreen before HomeScreen
   - After completion, set flag to true and navigate to Home

4. **Design visuals**
   - Use illustrations or icons
   - Keep minimal and clean
   - Use theme colors

**Verification:**
- [ ] Onboarding shows for new users
- [ ] Can skip or complete onboarding
- [ ] Never shows again after completion
- [ ] Can reset in SettingsScreen for testing

**Commit:** `feat(onboarding): add first-time user onboarding flow`

**Estimated tokens:** ~9,000

---

### Task 7: Accessibility Improvements

**Goal:** Enhance app accessibility for users with disabilities.

**Files to Modify:**
- All screen and component files - Add accessibility props

**Implementation Steps:**

1. **Add accessibility labels**
   - All interactive elements (buttons, inputs)
   - Screen readers should describe purpose
   - Use `accessibilityLabel` and `accessibilityHint`

2. **Add accessibility roles**
   - Use `accessibilityRole` prop (button, header, link, etc.)
   - Helps screen readers understand element purpose

3. **Ensure keyboard navigation (Web)**
   - All interactive elements focusable with Tab
   - Logical tab order
   - Enter key activates buttons

4. **Test with screen readers**
   - iOS: VoiceOver
   - Android: TalkBack
   - Web: NVDA/JAWS
   - Ensure all content readable and navigable

5. **Improve color contrast**
   - Check all text meets WCAG AA standards (4.5:1 ratio)
   - Test with color blindness simulators
   - Adjust colors if needed

6. **Add reduced motion support**
   - Respect `prefers-reduced-motion` setting
   - Disable/reduce animations if user prefers
   - Use React Native's `AccessibilityInfo` API

7. **Add text scaling support**
   - Use `allowFontScaling` prop
   - Test with large text sizes
   - Ensure layouts don't break

**Verification:**
- [ ] All interactive elements have accessibility labels
- [ ] Screen readers can navigate entire app
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works (web)
- [ ] Respects reduced motion preference

**Commit:** `feat(a11y): improve accessibility with labels and WCAG compliance`

**Estimated tokens:** ~10,000

---

### Task 8: UI Polish and Refinements

**Goal:** Final UI polish pass to ensure consistency and quality.

**Implementation Steps:**

1. **Consistent spacing**
   - Review all screens
   - Ensure consistent use of Spacer component
   - Fix any spacing inconsistencies

2. **Typography hierarchy**
   - Ensure clear visual hierarchy
   - Headers, body text, captions distinct
   - Consistent font sizes across app

3. **Button styles**
   - Consistent button variants usage
   - Proper sizing and padding
   - Good touch targets (44x44 minimum)

4. **Loading states**
   - All async operations show loading indicators
   - Skeleton screens where appropriate
   - No blank screens during loads

5. **Error states**
   - Graceful error messages
   - Retry buttons where appropriate
   - User-friendly error text

6. **Empty states**
   - All lists/grids have empty state messages
   - Helpful guidance: "Start learning to see progress"
   - Icons or illustrations for empty states

7. **Animations polish**
   - Smooth, performant (60fps)
   - Not too fast or slow
   - Consistent easing curves

8. **Final visual pass**
   - Test on multiple screen sizes
   - Check tablet layouts
   - Verify web responsiveness
   - Dark mode looks good everywhere

**Verification:**
- [ ] UI consistent across all screens
- [ ] All states handled (loading, error, empty)
- [ ] Animations smooth and polished
- [ ] Works well on phone, tablet, web

**Commit:** `polish(ui): final UI refinements and consistency pass`

**Estimated tokens:** ~8,000

---

### Task 9: Performance Optimizations

**Goal:** Optimize app performance for smooth experience on all devices.

**Implementation Steps:**

1. **Optimize re-renders**
   - Use React.memo for expensive components
   - Use useCallback for event handlers
   - Use useMemo for expensive calculations
   - Fix unnecessary re-renders

2. **Lazy load screens**
   - Use React.lazy and Suspense for screens
   - Load screens on-demand
   - Reduces initial bundle size

3. **Optimize images**
   - Compress images
   - Use appropriate sizes
   - Lazy load images

4. **Optimize animations**
   - Use native driver for animations where possible
   - Reduce animation complexity if needed
   - Test on low-end devices

5. **Measure performance**
   - Use React DevTools Profiler
   - Monitor FPS during animations
   - Check bundle size
   - Test on slower devices/simulators

6. **Code splitting**
   - Split large files
   - Lazy load features
   - Reduce main bundle size

**Verification:**
- [ ] App loads in <2 seconds
- [ ] Animations run at 60fps
- [ ] No janky scrolling
- [ ] Works well on low-end devices

**Commit:** `perf: optimize app performance and reduce bundle size`

**Estimated tokens:** ~7,000

---

### Task 10: Documentation and Help

**Goal:** Add in-app help and documentation.

**Files to Create:**
- `src/features/help/screens/HelpScreen.tsx` - Help/FAQ screen
- `src/features/settings/screens/AboutScreen.tsx` - About app screen

**Implementation Steps:**

1. **Create HelpScreen**
   - FAQ section
   - How to use quiz features
   - How progress tracking works
   - How to reset progress
   - Contact/support information

2. **Create AboutScreen**
   - App version
   - Credits
   - Privacy policy link
   - Terms of service link
   - Open source licenses

3. **Add navigation to help**
   - Link from SettingsScreen
   - Maybe help icon on HomeScreen
   - Easy to find

**Verification:**
- [ ] Help content clear and helpful
- [ ] About screen has all info
- [ ] Links work correctly

**Commit:** `feat(help): add help and about screens with documentation`

**Estimated tokens:** ~6,000

---

## Phase Verification

### Complete Phase Checklist

- [ ] **Task 1:** Achievement system implemented
- [ ] **Task 2:** Progress charts added
- [ ] **Task 3:** Theme toggle functional
- [ ] **Task 4:** Sound effects added
- [ ] **Task 5:** Haptic feedback added (mobile)
- [ ] **Task 6:** Onboarding implemented
- [ ] **Task 7:** Accessibility improved
- [ ] **Task 8:** UI polished
- [ ] **Task 9:** Performance optimized
- [ ] **Task 10:** Help documentation added

### Integration Testing

Test all enhancements:
```bash
# 1. Fresh install → Onboarding shows
# 2. Complete quiz → Achievement unlocks with modal
# 3. View StatsScreen → Charts display
# 4. Toggle theme → Dark mode activates
# 5. Enable sounds → Hear on quiz answers
# 6. Enable haptics → Feel on interactions
# 7. Test screen reader → All content accessible
# 8. Check performance → Smooth 60fps
# 9. View Help → Documentation clear
```

### Quality Checks

```bash
npm run lint
npm run type-check
npm test
npm test -- --coverage # >80% overall
```

**🔍 Code Review Questions:**

> **Q1 - Missing Dependencies:** Running `npm run type-check` shows TypeScript errors for missing modules:
> ```
> error TS2307: Cannot find module 'expo-av' or its corresponding type declarations.
> error TS2307: Cannot find module 'expo-haptics' or its corresponding type declarations.
> ```
> **Consider:** The code in `src/shared/hooks/useSound.ts:9` and `src/shared/hooks/useHaptics.ts:10` imports these packages, but they're not listed in package.json dependencies. Should `expo-av` and `expo-haptics` be added to the dependencies array? Currently only `react-native-chart-kit` was added but these expo packages are missing.

> **Q2 - Tests Failing Due to Missing Dependencies:** Running `npm test` shows 5 test suites failing:
> - QuizScreen.test.tsx: "Cannot find module 'expo-av'"
> - GraduationScreen.test.tsx: "Cannot find module 'expo-av'"
> - StatsScreen.test.tsx: "Cannot find module 'react-native-chart-kit'"
>
> **Think about:** Even though jest.setup.js mocks AsyncStorage, it doesn't mock expo-av or react-native-chart-kit. Since react-native-chart-kit IS in package.json but tests fail, does this mean `npm install` wasn't run after adding it? Should we mock these modules in jest.setup.js as well, or ensure dependencies are installed?

> **Q3 - Phase 3 Issues Still Unresolved:** The adaptiveDifficultyStore tests show 4 failures identical to Phase 3 Review Q1:
> ```
> ✕ tracks multiple choice performance correctly
> ✕ tracks fill-in-blank performance correctly
> ✕ tracks both types independently
> ✕ biases toward multiple when user struggles with fillin (<50%)
> ```
> **Reflect:** This is the same Zustand state snapshot issue from Phase 3. Tests call `store.updatePerformance()` then check `store.multipleChoiceAttempts` which reads stale state. At what phase should this be fixed? Should Phase 5 be approved with Phase 3 test failures still present?

> **Q4 - Code Formatting:** Running `npm run format:check` reports:
> ```
> [warn] Code style issues found in 9 files.
> OnboardingScreen.tsx, AchievementBadge.tsx, WordMasteryHeatmap.tsx,
> achievements.test.ts, achievements.ts, SettingsScreen.tsx,
> HomeScreen.tsx, useReducedMotion.ts, Button.tsx
> ```
> **Consider:** These are all Phase 5 files. Should `npm run format` be executed before final approval?

> **Q5 - TypeScript Legacy Errors:** The same 2 parseXmlToJson.ts errors from Phases 1-4 still exist:
> ```
> scripts/parseXmlToJson.ts(13,29): Missing declaration for 'xml2js'
> scripts/parseXmlToJson.ts(66,30): Parameter 'err' implicitly has 'any' type
> ```
> **Think about:** This has been flagged in every phase review (Phase 2 Q2, Phase 3 Q4, Phase 4 Q3). Should this be resolved now, or is it acceptable to ship with these migration script errors?

> **Q6 - Sound Files Missing:** Reading `src/assets/sounds/README.md` shows placeholder instructions but no actual sound files. The useSound hook at lines 13-18 sets all SOUND_FILES to `null` with comments:
> ```typescript
> const SOUND_FILES = {
>   correct: null, // Will be: require('@/assets/sounds/correct.mp3')
>   wrong: null,   // Will be: require('@/assets/sounds/wrong.mp3')
>   complete: null // Will be: require('@/assets/sounds/complete.mp3')
> }
> ```
> **Consider:** Task 4 (lines 204-254) requires "Add sound files to src/assets/sounds/" and functionality should work. Are sounds functional with null files, or is this incomplete implementation? Should actual .mp3 files be added?

> **Q7 - Quiz Store Test Failures:** Running tests shows quizStore.test.ts has 12 failures:
> ```
> ✕ increments hint count
> ✕ returns word definition
> ✕ calculates sum of word states
> ✕ returns true when all words at state 3
> ✕ sets isQuizActive to false
> ✕ tracks multiple hints
> ✕ tracks multiple wrong answers
> ✕ tracks multiple correct answers
> ```
> **Reflect:** These appear to be the same Zustand state snapshot pattern from Phase 3. Tests call `store.incrementHints()` then check `store.sessionStats.hintsUsed` but get stale values. Should these be fixed before Phase 5 approval?

---

## Known Limitations & Technical Debt

1. **Limited Achievements** - Only basic milestones (can expand in future)
2. **Simple Charts** - Basic visualizations (can enhance with more data)
3. **No Cloud Sync** - Achievements/settings local only

### Migration to Phase 6

Phase 5 added polish and enhancements. Phase 6 will focus on:
- Comprehensive testing (E2E, performance, accessibility)
- Production builds and optimization
- App store deployment
- CI/CD setup

**Proceed to:** [Phase 6: Testing, Optimization & Deployment](./Phase-6.md)

---

*Phase 5 Complete! App is now polished, accessible, and delightful to use.*
