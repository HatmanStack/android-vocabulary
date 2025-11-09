# Phase 2: Core UI Components

## Phase Goal

Build a comprehensive, reusable UI component library and implement polished user interfaces for all app screens using React Native Paper. This phase transforms the placeholder screens from Phase 1 into production-ready, visually appealing interfaces that match Material Design 3 standards while maintaining cross-platform consistency.

**Success Criteria:**
- All screens have complete, polished UI implementations
- Reusable component library established in `shared/ui/`
- All components use React Native Paper for consistency
- Responsive layouts work on mobile (phone/tablet) and web
- Basic animations implemented for screen transitions and user feedback
- Component tests written with >80% coverage
- App visually matches or exceeds the Android app quality

**Estimated tokens:** ~98,000

---

## Prerequisites

### Before Starting This Phase

- [ ] Phase 1 completely finished and verified
- [ ] Expo app runs successfully on all target platforms
- [ ] All 8 vocabulary JSON files validated and loaded
- [ ] Navigation structure working with placeholder screens
- [ ] React Native Paper theme configured
- [ ] Working directory: `Migration/expo-project/`

### Phase 1 Verification

Run these commands to verify Phase 1 completion:
```bash
npm run lint           # Should pass
npm run type-check     # Should pass
npm run validate-data  # Should validate all 8 JSON files
npm start              # Should launch app with navigation working
```

### Knowledge Requirements

- React component composition patterns
- React Hooks (useState, useEffect, useCallback, useMemo)
- React Native layout (Flexbox)
- React Native Paper component library
- Basic animation concepts
- Component testing with React Native Testing Library

---

## Tasks

### Task 1: Create Shared UI Component Library

**Goal:** Build a library of reusable UI components that enforce consistent styling, reduce code duplication, and serve as building blocks for all screens.

**Files to Create:**
- `src/shared/ui/Card.tsx` - Custom card component wrapping Paper Card
- `src/shared/ui/Button.tsx` - Custom button with variants
- `src/shared/ui/Typography.tsx` - Text components with consistent styling
- `src/shared/ui/ProgressBar.tsx` - Custom progress bar component
- `src/shared/ui/LoadingIndicator.tsx` - Loading spinner component
- `src/shared/ui/ErrorBoundary.tsx` - Error boundary for graceful error handling
- `src/shared/ui/Spacer.tsx` - Spacing utility component
- `src/shared/ui/index.ts` - Re-export all components

**Files to Modify:**
- None (new components)

**Prerequisites:**
- Phase 1 Task 4 complete (structure created)
- React Native Paper installed and configured

**Implementation Steps:**

1. **Create Card component**
   - Wrap React Native Paper's Card component
   - Add elevation/shadow presets (low, medium, high)
   - Support custom styles via props
   - Export Card, Card.Title, Card.Content, Card.Actions
   - Add TypeScript prop types

2. **Create Button component**
   - Wrap Paper Button with custom variants
   - Variants: primary (contained), secondary (outlined), text
   - Add size prop: small, medium, large
   - Add fullWidth prop for full-width buttons
   - Add loading state with activity indicator
   - Add disabled state styling
   - Use useCallback for onPress handlers

3. **Create Typography components**
   - Create Text component wrapping Paper Text
   - Add semantic variants: heading1, heading2, heading3, body, caption, label
   - Map to Paper's variant prop appropriately
   - Add color prop: primary, secondary, error, disabled
   - Add align prop: left, center, right
   - Support custom styles

4. **Create ProgressBar component**
   - Wrap Paper ProgressBar
   - Add label showing "X / Y" or percentage
   - Add color variants based on progress (e.g., success when 100%)
   - Animate progress changes smoothly
   - Support determinate and indeterminate modes

5. **Create LoadingIndicator component**
   - Use Paper ActivityIndicator
   - Center on screen with overlay option
   - Add optional loading text below spinner
   - Support size and color props

6. **Create ErrorBoundary component**
   - Implement React Error Boundary
   - Catch errors in child components
   - Display user-friendly error message
   - Add "Try Again" button to reset error state
   - Log errors to console (in dev) for debugging
   - Accept fallback component prop

7. **Create Spacer component**
   - Simple View with configurable height or width
   - Props: size (number or preset: xs, sm, md, lg, xl)
   - Direction: vertical (default) or horizontal
   - Helps maintain consistent spacing

8. **Create index.ts barrel export**
   - Re-export all components
   - Enables clean imports: `import { Card, Button } from '@/shared/ui'`

9. **Add JSDoc comments**
   - Document each component's purpose
   - Document props with descriptions
   - Add usage examples in comments

**Verification Checklist:**
- [ ] All 7 UI components created in `src/shared/ui/`
- [ ] Each component uses React Native Paper primitives
- [ ] All components have proper TypeScript prop types
- [ ] Components accept style props for customization
- [ ] Button component has loading and disabled states
- [ ] ProgressBar animates smoothly
- [ ] ErrorBoundary catches and displays errors
- [ ] `index.ts` exports all components
- [ ] JSDoc comments added for all components
- [ ] No TypeScript errors: `npm run type-check`

**Testing Instructions:**

Create a test screen to verify components:
```typescript
// src/app/TestScreen.tsx (temporary)
import { Card, Button, Typography, ProgressBar, LoadingIndicator, Spacer } from '@/shared/ui';

export function TestScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Typography variant="heading1">UI Components Test</Typography>
      <Spacer size="md" />

      <Card>
        <Card.Title title="Card Component" />
        <Card.Content>
          <Typography variant="body">This is a card with content.</Typography>
        </Card.Content>
      </Card>

      <Spacer size="md" />

      <Button variant="primary" onPress={() => alert('Primary')}>
        Primary Button
      </Button>
      <Spacer size="sm" />
      <Button variant="secondary" onPress={() => alert('Secondary')}>
        Secondary Button
      </Button>

      <Spacer size="md" />

      <ProgressBar progress={0.65} max={1} label="65%" />

      <Spacer size="md" />

      <LoadingIndicator text="Loading..." />
    </ScrollView>
  );
}
```

Add to navigation temporarily and verify all components render correctly.

**Commit Message Template:**
```
feat(ui): create shared UI component library

- Add Card component with elevation presets
- Add Button component with variants (primary, secondary, text)
- Add Typography components with semantic variants
- Add ProgressBar with animations and labels
- Add LoadingIndicator with overlay option
- Add ErrorBoundary for graceful error handling
- Add Spacer utility for consistent spacing
- Export all components from index.ts barrel file
```

**Estimated tokens:** ~18,000

---

### Task 2: Implement HomeScreen UI

**Goal:** Transform the HomeScreen placeholder into a polished interface displaying all vocabulary lists as cards with visual hierarchy and clear navigation.

**Files to Modify:**
- `src/features/vocabulary/screens/HomeScreen.tsx` - Implement complete UI

**Files to Create:**
- `src/features/vocabulary/components/ListCard.tsx` - Individual list card component

**Prerequisites:**
- Task 1 complete (UI library created)
- Vocabulary loader from Phase 1 available

**Implementation Steps:**

1. **Create ListCard component**
   - Accept list data as prop (id, name, description)
   - Use shared Card component
   - Display list name as title (e.g., "List A")
   - Display description if available
   - Show progress indicator (0% for now, real data in Phase 4)
   - Add icon or visual indicator (e.g., letter badge)
   - Add press handler prop: `onPress: () => void`
   - Add hover state for web (opacity change)
   - Make card accessible with accessibilityLabel

2. **Implement HomeScreen layout**
   - Import vocabularyLoader to get all lists
   - Use ScrollView for scrollable content
   - Add app header with title "Vocabulary Builder"
   - Add subtitle or description: "Choose a list to begin"
   - Use FlatList or map to render ListCard for each list
   - Configure grid layout: 2 columns on tablet/web, 1 column on phone
   - Use responsive breakpoints or dimension detection

3. **Add header actions**
   - Add icon button to navigate to StatsScreen (chart icon)
   - Add icon button to navigate to SettingsScreen (settings icon)
   - Use React Native Paper IconButton component

4. **Implement list navigation**
   - On ListCard press, navigate to DifficultyScreen
   - Pass listId as route param
   - Use navigation.navigate() with type-safe params

5. **Add visual polish**
   - Use Spacer components for consistent spacing
   - Add subtle animations: fade-in on mount
   - Add ripple effect on card press (built-into Paper)
   - Ensure sufficient contrast for accessibility

6. **Handle empty state (unlikely but good practice)**
   - If no lists loaded, show message: "No vocabulary lists found"
   - Add illustration or icon
   - Won't happen with current setup but shows error handling

7. **Add loading state**
   - vocabularyLoader is synchronous, but simulate loading for UX
   - Show LoadingIndicator while loading (or just render immediately)
   - Prepare for async loading in future

**Verification Checklist:**
- [ ] HomeScreen displays all 8 vocabulary lists
- [ ] Each list shown as ListCard with name and description
- [ ] Cards arranged in responsive grid (1-2 columns based on screen size)
- [ ] Pressing card navigates to DifficultyScreen with correct listId
- [ ] Header includes app title and action icons (Stats, Settings)
- [ ] Stats and Settings icons navigate to respective screens
- [ ] Visual spacing is consistent using Spacer components
- [ ] Cards have press feedback (ripple effect)
- [ ] Layout works on mobile, tablet, and web
- [ ] No TypeScript or linting errors

**Testing Instructions:**

Manual testing:
```bash
npm start

# On HomeScreen:
# - Verify all 8 lists displayed as cards
# - Verify 2-column layout on tablet/web, 1-column on phone
# - Click List A card → Should navigate to Difficulty screen
# - Click Stats icon → Should navigate to Stats screen
# - Click Settings icon → Should navigate to Settings screen
# - Verify smooth animations and ripple effects
```

Responsive testing:
```bash
# On web: Resize browser window
# - Wide: Should show 2 columns
# - Narrow: Should show 1 column

# On mobile: Rotate device
# - Portrait: 1 column
# - Landscape: 1-2 columns (depending on size)
```

**Commit Message Template:**
```
feat(home): implement HomeScreen UI with list selection

- Create ListCard component for vocabulary list display
- Implement responsive grid layout (1-2 columns)
- Add app header with title and action icons
- Add navigation to Stats and Settings screens
- Implement list selection with navigation to Difficulty
- Add press feedback and subtle animations
- Ensure responsive layout across mobile, tablet, web
```

**Estimated tokens:** ~15,000

---

### Task 3: Implement DifficultyScreen UI

**Goal:** Create an interface for selecting difficulty level with clear visual hierarchy and engaging button layout.

**Files to Modify:**
- `src/features/vocabulary/screens/DifficultyScreen.tsx` - Implement complete UI

**Files to Create:**
- `src/features/vocabulary/components/LevelButton.tsx` - Difficulty level button component

**Prerequisites:**
- Task 1 complete (UI library)
- Task 2 complete (HomeScreen implemented)

**Implementation Steps:**

1. **Create LevelButton component**
   - Accept level data: id, name, description (optional)
   - Use shared Button component as base
   - Display level name prominently (e.g., "Basic")
   - Add icon or badge to indicate difficulty
   - Show progress/completion status (checkmark if completed - data in Phase 4)
   - Add press handler: `onPress: () => void`
   - Support disabled state (for locked levels - future feature)
   - Add accessibility labels

2. **Implement DifficultyScreen layout**
   - Get listId from route params
   - Load selected list using vocabularyLoader.getListById()
   - Display list name in header (e.g., "List A")
   - Add back button to return to HomeScreen
   - Show description or instructions: "Select difficulty level"

3. **Render level buttons**
   - Display all 5 levels: Basic, Intermediate, Advanced, Expert, Professional
   - Use vertical stack layout with spacing
   - Each level button full-width
   - Add difficulty indicators (e.g., stars, color coding)
   - Order from easiest (Basic) to hardest (Professional)

4. **Add difficulty indicators**
   - Visual cues for difficulty:
     - Basic: 1 star or green
     - Intermediate: 2 stars or blue
     - Advanced: 3 stars or orange
     - Expert: 4 stars or red
     - Professional: 5 stars or purple
   - Use icons from React Native Paper or custom

5. **Implement level navigation**
   - On button press, navigate to QuizScreen
   - Pass listId and levelId as route params
   - Use type-safe navigation

6. **Add progress preview**
   - Show word count for each level (e.g., "8 words" or "10 words")
   - Show completion status: "0/8 mastered" (real data in Phase 4)
   - For now, show static "0/N mastered"

7. **Add visual polish**
   - Use Spacer for consistent vertical spacing
   - Add header with gradient or background
   - Animate level buttons (stagger fade-in)
   - Add haptic feedback on button press (Phase 5)

**Verification Checklist:**
- [ ] DifficultyScreen displays list name from route params
- [ ] Shows 5 level buttons vertically stacked
- [ ] Each button shows level name and difficulty indicator
- [ ] Buttons show word count per level (8 for A/B, 10 for C-H)
- [ ] Pressing level button navigates to QuizScreen with params
- [ ] Back button navigates to HomeScreen
- [ ] Layout is responsive and works on all screen sizes
- [ ] Visual indicators clearly distinguish difficulty levels
- [ ] Animations enhance user experience without being distracting
- [ ] No TypeScript or linting errors

**Testing Instructions:**

Manual test flow:
```bash
npm start

# From HomeScreen, click List A
# DifficultyScreen should show:
# - Header: "List A"
# - 5 level buttons with difficulty indicators
# - Word count: "8 words" for each level

# Click "Basic" → Navigates to QuizScreen with listId="list-a", levelId="basic"
# Navigate back → Returns to DifficultyScreen
# Navigate back again → Returns to HomeScreen
```

**Commit Message Template:**
```
feat(difficulty): implement DifficultyScreen UI with level selection

- Create LevelButton component with difficulty indicators
- Display list name in header from route params
- Show 5 difficulty levels: Basic through Professional
- Add visual difficulty cues (stars, colors)
- Display word count per level (8 or 10 words)
- Implement navigation to QuizScreen with level params
- Add back navigation to HomeScreen
- Add staggered fade-in animations for level buttons
```

**Estimated tokens:** ~13,000

---

### Task 4: Implement Quiz Screen UI Structure

**Goal:** Build the quiz screen layout with separate components for question header, question display area, and answer input areas, preparing the structure for quiz logic in Phase 3.

**Files to Modify:**
- `src/features/quiz/screens/QuizScreen.tsx` - Main quiz screen

**Files to Create:**
- `src/features/quiz/components/QuizHeader.tsx` - Progress and stats header
- `src/features/quiz/components/QuestionDisplay.tsx` - Question text display
- `src/features/quiz/components/AnswerFeedback.tsx` - Correct/Wrong feedback animation

**Prerequisites:**
- Task 1 complete (UI library)
- Phase 1 vocabulary loader available

**Implementation Steps:**

1. **Create QuizHeader component**
   - Display current list and level (e.g., "List A - Basic")
   - Show progress bar: "Question X of Y"
   - Display session stats: hints used, wrong answers
   - Use ProgressBar component from shared UI
   - Use Typography for consistent text styling
   - Accept props: listName, levelName, currentIndex, totalWords, hintsUsed, wrongAnswers
   - Layout horizontally: info on left, stats on right (responsive)

2. **Create QuestionDisplay component**
   - Display question text (definition or fill-in-blank sentence)
   - Use large, readable typography
   - Center text or left-align based on question type
   - Accept props: questionText, type (multiple | fillin)
   - Add subtle background or card for visual separation
   - Ensure sufficient padding for readability

3. **Create AnswerFeedback component**
   - Display "Correct!" or "Wrong!" message
   - Animate in/out with fade effect
   - Use green color for correct, red for wrong
   - Position: overlay or below question (test both)
   - Accept props: isCorrect, isVisible, onAnimationEnd
   - Auto-hide after 1-2 seconds
   - Use React Native Animated API or Reanimated

4. **Implement QuizScreen layout**
   - Get listId and levelId from route params
   - Load list and level data using vocabularyLoader
   - Render QuizHeader at top
   - Render QuestionDisplay in middle section
   - Reserve bottom section for answer inputs (Task 5)
   - Use SafeAreaView for proper insets
   - Add background color or gradient

5. **Add placeholder question content**
   - For now, show first word from level
   - Display its definition as question
   - Placeholder: "Answer options will appear here"
   - This will be replaced with actual quiz logic in Phase 3

6. **Add exit/back navigation**
   - Add close/back button in header (IconButton)
   - On press, show confirmation dialog: "Exit quiz? Progress will be lost"
   - If confirmed, navigate back to DifficultyScreen
   - Use Paper Dialog component for confirmation

7. **Structure for answer components**
   - Create placeholder area for MultipleChoiceQuestion (Task 5)
   - Create placeholder area for FillInBlankQuestion (Task 5)
   - Add comments indicating where these will be integrated

**Verification Checklist:**
- [ ] QuizScreen renders with list and level from params
- [ ] QuizHeader displays list name, level name, progress
- [ ] QuizHeader shows placeholder stats (0 hints, 0 wrong)
- [ ] QuestionDisplay shows first word's definition
- [ ] AnswerFeedback component animates in/out correctly
- [ ] Layout is clean with proper spacing
- [ ] Back button shows confirmation dialog
- [ ] Dialog can cancel or confirm exit
- [ ] Confirming exit navigates back to DifficultyScreen
- [ ] Layout is responsive on mobile and web

**Testing Instructions:**

Navigate to QuizScreen:
```bash
npm start

# Navigate: Home → List A → Basic → Quiz
# QuizScreen should show:
# - Header: "List A - Basic"
# - Progress: "Question 1 of 8"
# - Stats: "Hints: 0, Wrong: 0"
# - Question: First word's definition
# - Placeholder: "Answer options will appear here"

# Click back button → Shows "Exit quiz?" dialog
# Click "Cancel" → Stays on QuizScreen
# Click "Confirm" → Returns to DifficultyScreen
```

Test AnswerFeedback animation:
```typescript
// Temporarily add button to trigger feedback
<Button onPress={() => setShowFeedback(true)}>
  Test Correct
</Button>

// Should animate in "Correct!" message and auto-hide
```

**Commit Message Template:**
```
feat(quiz): implement QuizScreen UI structure

- Create QuizHeader component with progress and stats
- Create QuestionDisplay component for question text
- Create AnswerFeedback component with fade animations
- Implement main QuizScreen layout and structure
- Add exit confirmation dialog for quiz navigation
- Display list, level, and first question from params
- Prepare structure for answer input components (Task 5)
```

**Estimated tokens:** ~14,000

---

### Task 5: Implement Quiz Answer Components

**Goal:** Create the two quiz question type components: MultipleChoiceQuestion (4-button grid) and FillInBlankQuestion (text input with hint button).

**Files to Create:**
- `src/features/quiz/components/MultipleChoiceQuestion.tsx` - Multiple choice 2x2 grid
- `src/features/quiz/components/FillInBlankQuestion.tsx` - Text input quiz

**Files to Modify:**
- `src/features/quiz/screens/QuizScreen.tsx` - Integrate answer components

**Prerequisites:**
- Task 4 complete (QuizScreen structure)
- UI library from Task 1

**Implementation Steps:**

1. **Create MultipleChoiceQuestion component**
   - Accept props: options (array of 4 strings), onSelectAnswer: (answer: string) => void
   - Render 4 buttons in 2x2 grid using Flexbox
   - Use shared Button component with variant="outlined"
   - Each button shows one word option
   - Buttons should be equal size and responsive
   - Add press feedback (ripple)
   - Style buttons to fill available space evenly
   - Add accessibility labels for each option

2. **Add answer selection feedback to MultipleChoice**
   - When answer selected, highlight button briefly
   - Correct answer: green background
   - Wrong answer: red background
   - Disable all buttons after selection (prevent double-tap)
   - Reset after feedback animation complete
   - Accept selectedAnswer prop to control state externally (for Phase 3)

3. **Create FillInBlankQuestion component**
   - Accept props: sentence (with blank), onSubmitAnswer: (answer: string) => void, onUseHint: () => void
   - Render sentence text with blank placeholder highlighted
   - Render TextInput for user answer
   - Style TextInput with Paper styling (outlined variant)
   - Add "Submit" button below input
   - Add "Hint" button beside submit (different color, secondary variant)

4. **Add input validation to FillInBlank**
   - Disable submit button if input is empty
   - Clear input after submission
   - Auto-focus input on component mount
   - Add keyboard handling (submit on Enter key - web)
   - Trim whitespace from user input

5. **Add hint functionality UI**
   - Hint button shows icon (lightbulb or question mark)
   - On press, trigger onUseHint callback (logic in Phase 3)
   - Visual feedback: button glows or changes color after use
   - Add hint counter in QuizHeader (already prepared in Task 4)

6. **Integrate both components into QuizScreen**
   - Add state to track current question type: 'multiple' | 'fillin'
   - For now, toggle between types with a button (demo purposes)
   - Conditionally render MultipleChoiceQuestion or FillInBlankQuestion
   - Pass dummy data for testing:
     - Multiple choice: 4 word options
     - Fill in blank: sentence with blank
   - Connect onSelectAnswer and onSubmitAnswer to handlers (log for now)

7. **Add keyboard dismissal for mobile**
   - Import Keyboard from react-native
   - Dismiss keyboard when answer submitted
   - Add KeyboardAvoidingView to prevent input obscuring on iOS
   - Use Platform.OS to apply iOS-specific behavior

**Verification Checklist:**
- [ ] MultipleChoiceQuestion renders 4 buttons in 2x2 grid
- [ ] Buttons are equal size and responsive
- [ ] Pressing button triggers onSelectAnswer callback
- [ ] Selected button shows visual feedback (color change)
- [ ] FillInBlankQuestion renders sentence and text input
- [ ] TextInput auto-focuses on mount
- [ ] Submit button disabled when input empty
- [ ] Hint button renders with icon
- [ ] QuizScreen toggles between both question types
- [ ] KeyboardAvoidingView works on iOS
- [ ] Keyboard dismisses after answer submission
- [ ] Layout works on mobile, tablet, web

**Testing Instructions:**

Test MultipleChoiceQuestion:
```bash
# In QuizScreen, render MultipleChoice with dummy data:
options={["abject", "aberration", "abjure", "abnegate"]}
onSelectAnswer={(answer) => console.log('Selected:', answer)}

# Verify:
# - 4 buttons in 2x2 grid
# - Clicking button logs answer to console
# - Selected button changes color briefly
```

Test FillInBlankQuestion:
```bash
# Render FillInBlank with dummy data:
sentence="Timmy was _____ after falling off the jungle gym"
onSubmitAnswer={(answer) => console.log('Submitted:', answer)}
onUseHint={() => console.log('Hint used')}

# Verify:
# - Sentence displays with blank highlighted
# - TextInput appears below
# - Typing enables submit button
# - Clicking submit logs answer
# - Clicking hint logs hint usage
# - Keyboard dismisses after submit (mobile)
```

**Commit Message Template:**
```
feat(quiz): implement quiz answer input components

- Create MultipleChoiceQuestion with 2x2 button grid
- Add answer selection feedback (correct/wrong highlighting)
- Create FillInBlankQuestion with text input and hint button
- Implement input validation and keyboard handling
- Add KeyboardAvoidingView for iOS input visibility
- Integrate both components into QuizScreen
- Connect answer callbacks for Phase 3 quiz logic
- Add accessibility labels for answer options
```

**Estimated tokens:** ~16,000

---

### Task 6: Implement GraduationScreen UI

**Goal:** Create a celebratory completion screen showing user performance stats and options to continue learning.

**Files to Modify:**
- `src/features/quiz/screens/GraduationScreen.tsx` - Implement complete UI

**Files to Create:**
- None (may extract components if complex)

**Prerequisites:**
- Task 1 complete (UI library)
- Navigation from QuizScreen

**Implementation Steps:**

1. **Design celebration header**
   - Show "Congratulations!" or "Complete!" message
   - Use large Typography variant (display or headline)
   - Add checkmark icon or trophy icon
   - Use festive colors (green for success)
   - Consider subtle animation (fade-in, scale)

2. **Display completion stats**
   - Get stats from route params: hintsUsed, wrongAnswers
   - Show current session performance:
     - "Hints used: X"
     - "Wrong answers: Y"
   - Use Card component to group stats
   - Use readable typography and icons

3. **Display best scores**
   - For now, show placeholder: "Best score: 0 hints, 0 wrong"
   - In Phase 4, this will show real best scores from progressStore
   - Use different Card or section to distinguish from current stats

4. **Display all-time stats**
   - Show placeholder all-time totals:
     - "All-time hints: 0"
     - "All-time wrong: 0"
     - "Total words learned: 0"
   - Use Card with distinct styling

5. **Add action buttons**
   - Primary button: "Try Again" - Restarts same list/level
     - Navigates back to QuizScreen with same params
   - Secondary button: "Choose Another Level" - Goes to DifficultyScreen
   - Text button: "Back to Home" - Navigates to HomeScreen
   - Stack buttons vertically with spacing

6. **Add visual polish**
   - Use background gradient or color
   - Add subtle animations: stats count up from 0 (optional)
   - Add confetti animation on mount (Phase 5 enhancement)
   - Ensure sufficient contrast for readability
   - Use Spacer for consistent spacing

7. **Handle edge cases**
   - If stats not provided in params, use defaults (0)
   - If navigation state is missing, add back button to Home

**Verification Checklist:**
- [ ] GraduationScreen displays congratulations message
- [ ] Shows current session stats from route params
- [ ] Shows placeholder best scores and all-time stats
- [ ] Three action buttons present and styled correctly
- [ ] "Try Again" navigates to QuizScreen with same params
- [ ] "Choose Another Level" navigates to DifficultyScreen
- [ ] "Back to Home" navigates to HomeScreen
- [ ] Layout is visually appealing and celebratory
- [ ] Works on mobile, tablet, web
- [ ] No TypeScript or linting errors

**Testing Instructions:**

Navigate to GraduationScreen:
```typescript
// From QuizScreen (or any screen for testing):
navigation.navigate('Graduation', {
  listId: 'list-a',
  levelId: 'basic',
  stats: {
    hints: 3,
    wrong: 2,
    bestHints: 0,
    bestWrong: 0,
  },
});

// GraduationScreen should display:
// - "Congratulations!" header
// - "Hints used: 3"
// - "Wrong answers: 2"
// - Placeholder best and all-time stats
// - 3 action buttons

// Test navigation:
// Click "Try Again" → Returns to QuizScreen
// Click "Choose Another Level" → Goes to DifficultyScreen
// Click "Back to Home" → Goes to HomeScreen
```

**Commit Message Template:**
```
feat(graduation): implement GraduationScreen with stats display

- Create celebratory completion screen with congratulations message
- Display current session performance stats (hints, wrong answers)
- Add placeholders for best scores and all-time statistics
- Implement three action buttons: Try Again, Choose Level, Home
- Add visual polish with icons and celebratory styling
- Ensure responsive layout across all screen sizes
- Handle missing stats with default values
```

**Estimated tokens:** ~12,000

---

### Task 7: Implement StatsScreen UI

**Goal:** Build a statistics dashboard showing overall learning progress across all lists with visual charts and metrics.

**Files to Modify:**
- `src/features/progress/screens/StatsScreen.tsx` - Implement complete UI

**Files to Create:**
- `src/features/progress/components/StatCard.tsx` - Individual stat display card
- `src/features/progress/components/ProgressRing.tsx` - Circular progress indicator (optional)

**Prerequisites:**
- Task 1 complete (UI library)
- May need chart library (Phase 5 - for now use simple displays)

**Implementation Steps:**

1. **Design screen header**
   - Title: "Your Progress"
   - Subtitle: "Overall learning statistics"
   - Add back button to HomeScreen
   - Use consistent header styling

2. **Create StatCard component**
   - Display single metric with label and value
   - Props: label (string), value (number or string), icon (optional)
   - Use Card component from shared UI
   - Center content
   - Add icon above value for visual interest
   - Make size responsive

3. **Display key metrics**
   - Total words learned: 0 (placeholder - Phase 4)
   - Lists completed: 0 / 8 (placeholder)
   - All-time hints: 0 (placeholder)
   - All-time wrong answers: 0 (placeholder)
   - Current streak: 0 days (Phase 5 feature)
   - Use StatCard for each metric
   - Arrange in grid: 2 columns on mobile, 3-4 on tablet/web

4. **Add lists overview section**
   - Show completion status for each of 8 lists
   - For each list, show:
     - List name (A-H)
     - Completion percentage: 0% (placeholder)
     - Number of words mastered: 0 / 40 or 0 / 50
   - Use ProgressBar component for visual progress
   - Stack vertically or in grid

5. **Add recent activity section (optional)**
   - Show placeholder: "No recent activity"
   - In Phase 4, show last 5 quiz sessions
   - Each entry: List name, level, date, score

6. **Add visual polish**
   - Use Spacer for consistent spacing
   - Add section headers (Typography variant="heading3")
   - Use different card elevations to create hierarchy
   - Add subtle background colors to sections
   - Ensure readability with sufficient contrast

7. **Handle empty state**
   - If no progress yet (expected in Phase 2), show encouraging message
   - "Start learning to see your progress here!"
   - Add button to navigate back to HomeScreen

**Verification Checklist:**
- [ ] StatsScreen displays "Your Progress" header
- [ ] Shows 4-6 key metrics using StatCard components
- [ ] Shows list overview with 8 lists and progress bars
- [ ] Layout is responsive: grid on desktop, stack on mobile
- [ ] Back button navigates to HomeScreen
- [ ] Empty state message shows for new users
- [ ] Visual hierarchy is clear with section headers
- [ ] All metrics show placeholder values (0 for now)
- [ ] Works on mobile, tablet, web
- [ ] No TypeScript or linting errors

**Testing Instructions:**

Navigate to StatsScreen:
```bash
# From HomeScreen, click Stats icon
# StatsScreen should display:
# - Header: "Your Progress"
# - Stat cards with placeholder values (all 0s)
# - 8 list progress bars at 0%
# - Empty state or placeholder recent activity

# Verify layout:
# - Mobile: Stat cards in 2 columns
# - Tablet/Web: Stat cards in 3-4 columns
# - Lists stack vertically or in grid

# Navigate back to HomeScreen
```

**Commit Message Template:**
```
feat(stats): implement StatsScreen with progress dashboard

- Create StatCard component for metric display
- Display key metrics: words learned, lists completed, hints, wrong answers
- Add list overview section with 8 list progress bars
- Implement responsive grid layout for stat cards
- Add empty state message for new users
- Add section headers for visual hierarchy
- Use placeholders for all metrics (real data in Phase 4)
```

**Estimated tokens:** ~13,000

---

### Task 8: Implement SettingsScreen UI

**Goal:** Create a settings interface for theme selection, sound toggles, and app preferences (functionality in Phase 5).

**Files to Modify:**
- `src/features/settings/screens/SettingsScreen.tsx` - Implement complete UI

**Files to Create:**
- `src/features/settings/components/SettingItem.tsx` - Individual setting row

**Prerequisites:**
- Task 1 complete (UI library)

**Implementation Steps:**

1. **Create SettingItem component**
   - Props: label, value, type ('toggle' | 'select' | 'button'), onChange
   - Render row with label on left, control on right
   - For toggle: use Paper Switch component
   - For select: use Paper Button showing current value (opens menu)
   - For button: use Paper Button
   - Add divider between items
   - Use accessible labels

2. **Design screen header**
   - Title: "Settings"
   - Back button to HomeScreen
   - Use consistent header styling

3. **Add theme setting**
   - Label: "Theme"
   - Type: select
   - Options: Light, Dark, Auto
   - Current value: "Light" (placeholder - Phase 5 for functionality)
   - On press, show menu or modal with options

4. **Add sound setting**
   - Label: "Sound Effects"
   - Type: toggle
   - Current value: On (true)
   - Toggle switch (non-functional in Phase 2)

5. **Add haptics setting**
   - Label: "Haptic Feedback"
   - Type: toggle
   - Current value: On (true)
   - Toggle switch (non-functional in Phase 2)
   - Show only on mobile (not web)

6. **Add app info section**
   - Section header: "About"
   - App version: "2.0.0" (from package.json or hardcoded)
   - Privacy policy button (navigate to placeholder or external link)
   - Terms of service button (navigate to placeholder or external link)

7. **Add danger zone section (optional)**
   - Section header: "Data"
   - Reset progress button (red, destructive color)
   - Shows confirmation dialog before reset (non-functional in Phase 2)
   - Placeholder for Phase 4 when progress is implemented

8. **Add visual polish**
   - Group settings into sections with headers
   - Use Spacer for consistent spacing
   - Add icons to setting items for visual interest
   - Ensure touch targets are adequate size (44x44 minimum)

**Verification Checklist:**
- [ ] SettingsScreen displays "Settings" header
- [ ] Shows theme setting with current value "Light"
- [ ] Shows sound effects toggle (non-functional)
- [ ] Shows haptic feedback toggle on mobile only
- [ ] Shows app info section with version
- [ ] Settings grouped into logical sections with headers
- [ ] SettingItem component reusable for all setting types
- [ ] Layout is clean with proper spacing
- [ ] Back button navigates to HomeScreen
- [ ] Works on mobile, tablet, web
- [ ] No TypeScript or linting errors

**Testing Instructions:**

Navigate to SettingsScreen:
```bash
# From HomeScreen, click Settings icon
# SettingsScreen should display:
# - Header: "Settings"
# - Theme: "Light" (select type)
# - Sound Effects: toggle (on)
# - Haptic Feedback: toggle (on) - mobile only
# - About section: App version "2.0.0"

# Try clicking settings:
# - Theme: Nothing happens (functionality in Phase 5)
# - Sound toggle: Switch toggles but no actual effect
# - Haptics toggle: Switch toggles but no actual effect

# Navigate back to HomeScreen
```

**Commit Message Template:**
```
feat(settings): implement SettingsScreen with preferences

- Create SettingItem component for reusable setting rows
- Add theme selection setting (Light/Dark/Auto placeholder)
- Add sound effects toggle (UI only, functionality in Phase 5)
- Add haptic feedback toggle (mobile only, UI only)
- Add app info section with version number
- Group settings into logical sections with headers
- Add icons to setting items for visual clarity
```

**Estimated tokens:** ~11,000

---

### Task 9: Add Screen Transitions and Animations

**Goal:** Enhance user experience with smooth screen transitions and subtle UI animations throughout the app.

**Files to Modify:**
- `src/app/navigation.tsx` - Configure screen transitions
- Various screen and component files - Add micro-animations

**Prerequisites:**
- All screens implemented (Tasks 2-8)
- React Native Reanimated available (from Expo)

**Implementation Steps:**

1. **Configure stack navigator transitions**
   - Import CardStyleInterpolators from @react-navigation/stack
   - Set default transition style for all screens
   - Options: forHorizontalIOS (slide), forVerticalIOS (modal), forFadeFromCenter
   - Use forHorizontalIOS for main flow, forVerticalIOS for modals
   - Configure animation duration and easing

2. **Add custom transitions for specific screens**
   - HomeScreen → DifficultyScreen: slide from right
   - DifficultyScreen → QuizScreen: slide from right
   - QuizScreen → GraduationScreen: fade with scale
   - Settings/Stats: modal from bottom (forVerticalIOS)

3. **Implement ListCard animations on HomeScreen**
   - Stagger fade-in animation when screen mounts
   - Use React Native Animated API or Reanimated
   - Each card fades in with slight delay (100ms between cards)
   - Subtle scale animation on press

4. **Implement LevelButton animations on DifficultyScreen**
   - Stagger slide-in from left when screen mounts
   - Each button slides in with delay
   - Ripple effect on press (built into Paper Button)

5. **Add AnswerFeedback animation**
   - Already created in Task 4, ensure it works smoothly
   - Fade in from top
   - Scale slightly (1.0 → 1.1 → 1.0)
   - Fade out after 1.5 seconds
   - Use spring animation for natural feel

6. **Add progress bar animations**
   - Animate progress changes smoothly
   - Use timing animation with easing
   - Duration: 300-500ms
   - Ensure color transitions are smooth

7. **Add button feedback animations**
   - Scale down slightly on press (0.95)
   - Return to normal on release (spring animation)
   - Apply to custom buttons, not Paper buttons (they have built-in)

8. **Add page load animations**
   - Fade-in animation for main content on each screen
   - Slide up animation for cards and sections
   - Stagger animations for lists of items
   - Keep animations subtle and not distracting

9. **Test animations across platforms**
   - Verify animations run at 60fps on all platforms
   - Test on slower devices/simulators
   - Disable animations if performance is poor (accessibility preference)
   - Ensure animations respect reduced motion preference (accessibility)

**Verification Checklist:**
- [ ] Stack navigator has smooth screen transitions
- [ ] HomeScreen cards fade in with stagger effect
- [ ] DifficultyScreen buttons slide in with stagger
- [ ] AnswerFeedback animates in and out smoothly
- [ ] Progress bars animate value changes
- [ ] Button press feedback is responsive
- [ ] All animations run at 60fps (check with performance monitor)
- [ ] Animations respect accessibility reduced motion setting
- [ ] No janky or stuttering animations
- [ ] Transitions feel natural and consistent across app

**Testing Instructions:**

Test navigation transitions:
```bash
npm start

# Navigate through app:
# Home → Difficulty: Should slide from right
# Difficulty → Quiz: Should slide from right
# Quiz → Graduation: Should fade with subtle scale
# Open Stats from Home: Should animate from bottom
# Open Settings from Home: Should animate from bottom

# Use React DevTools Performance monitor:
# - Enable FPS meter
# - Verify animations stay at 60fps
# - Check for dropped frames
```

Test component animations:
```bash
# HomeScreen: Refresh or re-navigate
# - Cards should fade in one by one
# - Subtle stagger delay visible

# DifficultyScreen: Navigate from Home
# - Buttons should slide in from left
# - Stagger effect visible

# QuizScreen: Submit answer
# - Feedback should animate in from top
# - Slight scale effect
# - Auto-hide after ~1.5s
```

**Commit Message Template:**
```
feat(animations): add screen transitions and UI animations

- Configure stack navigator with smooth transitions
- Add horizontal slide for main navigation flow
- Add modal slide-up for Stats and Settings screens
- Implement staggered fade-in for ListCards on HomeScreen
- Implement staggered slide-in for LevelButtons on DifficultyScreen
- Add smooth AnswerFeedback fade and scale animation
- Add progress bar value change animations
- Ensure all animations run at 60fps
- Respect reduced motion accessibility preference
```

**Estimated tokens:** ~14,000

---

### Task 10: Add Component Tests

**Goal:** Write comprehensive tests for all UI components and screens to ensure reliability and prevent regressions.

**Files to Create:**
- Test files for each component in `__tests__/` directories
- Test utilities in `src/shared/lib/testUtils.ts`

**Prerequisites:**
- All components and screens implemented
- Jest and React Native Testing Library installed (Phase 1)

**Implementation Steps:**

1. **Create test utilities**
   - Create `testUtils.ts` with helper functions
   - Wrapper for rendering with providers (PaperProvider, NavigationContainer)
   - Mock navigation helper
   - Mock data generators for vocabulary, progress, etc.
   - Custom matchers if needed

2. **Write tests for shared UI components**
   - Card.test.tsx: Renders correctly, accepts styles
   - Button.test.tsx: Renders variants, handles press, shows loading state
   - Typography.test.tsx: Renders with correct variants and colors
   - ProgressBar.test.tsx: Displays progress correctly, animates
   - LoadingIndicator.test.tsx: Renders with text
   - ErrorBoundary.test.tsx: Catches errors, displays fallback
   - Spacer.test.tsx: Renders with correct size

3. **Write tests for HomeScreen**
   - Renders all 8 vocabulary lists
   - Navigates to DifficultyScreen on list press
   - Navigates to Stats and Settings from header icons
   - Displays list cards with correct data

4. **Write tests for DifficultyScreen**
   - Renders list name from params
   - Displays 5 level buttons
   - Navigates to QuizScreen on level press
   - Back button navigates to HomeScreen

5. **Write tests for QuizScreen**
   - Renders quiz header with correct data
   - Displays question text
   - Renders MultipleChoiceQuestion or FillInBlankQuestion
   - Exit dialog shows on back press

6. **Write tests for quiz components**
   - MultipleChoiceQuestion.test.tsx: Renders 4 options, handles selection
   - FillInBlankQuestion.test.tsx: Renders input, validates, submits
   - QuizHeader.test.tsx: Displays progress and stats
   - AnswerFeedback.test.tsx: Animates in/out, shows correct/wrong

7. **Write tests for GraduationScreen**
   - Displays stats from route params
   - Shows action buttons
   - Navigates correctly on button press

8. **Write tests for StatsScreen**
   - Renders stat cards with values
   - Shows list progress bars
   - Displays empty state if no data

9. **Write tests for SettingsScreen**
   - Renders all setting items
   - Toggle switches work (UI state)
   - Theme setting shows current value

10. **Run all tests and fix failures**
    - Execute: `npm test`
    - Ensure all tests pass
    - Aim for >80% component test coverage
    - Fix any failing tests

**Verification Checklist:**
- [ ] Test utilities created with rendering helpers
- [ ] All shared UI components have tests (7 components)
- [ ] All screens have tests (6 screens)
- [ ] Quiz components have tests (4 components)
- [ ] Vocabulary components have tests (2 components)
- [ ] All tests pass: `npm test`
- [ ] Test coverage >80%: `npm test -- --coverage`
- [ ] No warnings in test output
- [ ] Tests run fast (<30 seconds total)

**Testing Instructions:**

Run tests:
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test Card.test.tsx

# Run in watch mode (during development)
npm test -- --watch
```

Expected output:
```
Test Suites: 19 passed, 19 total
Tests:       95 passed, 95 total
Coverage:    >80% statements, branches, functions, lines
Time:        ~15-30s
```

**Commit Message Template:**
```
test(ui): add comprehensive component tests

- Create test utilities with rendering helpers and mocks
- Add tests for all shared UI components (7 components)
- Add tests for all screen components (6 screens)
- Add tests for quiz-specific components (4 components)
- Add tests for vocabulary components (2 components)
- Achieve >80% test coverage for UI layer
- All tests passing with no warnings
```

**Estimated tokens:** ~16,000

---

## Phase Verification

### Complete Phase Checklist

Before moving to Phase 3, verify all tasks complete:

- [ ] **Task 1:** Shared UI component library created (7 components)
- [ ] **Task 2:** HomeScreen UI implemented with list selection
- [ ] **Task 3:** DifficultyScreen UI implemented with level selection
- [ ] **Task 4:** QuizScreen structure implemented with header and feedback
- [ ] **Task 5:** Quiz answer components created (MultipleChoice, FillInBlank)
- [ ] **Task 6:** GraduationScreen UI implemented with stats display
- [ ] **Task 7:** StatsScreen UI implemented with metrics dashboard
- [ ] **Task 8:** SettingsScreen UI implemented with preferences
- [ ] **Task 9:** Screen transitions and animations added
- [ ] **Task 10:** Component tests written with >80% coverage

### Integration Testing

Run complete app flow:
```bash
npm start

# Complete flow test:
# 1. HomeScreen loads with 8 lists
# 2. Click List A → DifficultyScreen shows
# 3. Click Basic → QuizScreen shows
# 4. View question and answer components
# 5. Click back → Exit dialog appears
# 6. Navigate to Graduation (manually for now)
# 7. Click buttons to navigate
# 8. Open Stats screen → Metrics display
# 9. Open Settings screen → Preferences display

# All transitions should be smooth
# All UI should be polished and responsive
# No console errors or warnings
```

### Quality Checks

Run all quality checks:
```bash
npm run lint           # Should pass
npm run type-check     # Should pass
npm test               # All tests pass
npm test -- --coverage # >80% coverage
npm run format:check   # Should pass
```

### Visual Quality Checklist

- [ ] All screens visually polished with consistent styling
- [ ] React Native Paper theme applied consistently
- [ ] Typography hierarchy is clear
- [ ] Spacing is consistent (using Spacer component)
- [ ] Colors meet accessibility contrast ratios
- [ ] Touch targets are adequate size (44x44 minimum)
- [ ] Animations enhance UX without being distracting
- [ ] Layout responsive on mobile, tablet, web
- [ ] No visual bugs or glitches

### Cross-Platform Testing

- [ ] App works on web browser
- [ ] App works on iOS simulator (if available)
- [ ] App works on Android emulator
- [ ] Layouts adapt to different screen sizes
- [ ] Animations perform well on all platforms
- [ ] Navigation works consistently across platforms

---

## Known Limitations & Technical Debt

### Limitations Introduced in Phase 2

1. **Non-functional Settings**
   - Theme toggle UI exists but doesn't change theme
   - Sound and haptics toggles UI exist but don't work
   - Will be implemented in Phase 5

2. **Placeholder Data in UI**
   - Stats screen shows all 0s (no real data yet)
   - Progress bars show 0% (no real progress tracking)
   - Best scores placeholders
   - Will be populated with real data in Phase 4

3. **Quiz Components Without Logic**
   - Answer components accept callbacks but don't validate answers
   - No word state progression
   - No actual quiz session management
   - Will be implemented in Phase 3

4. **Static Question Display**
   - Quiz screen shows first word only
   - No randomization or question flow
   - Will be implemented in Phase 3

### Technical Debt

1. **Animation Performance**
   - Animations not tested on low-end devices
   - May need optimization for older Android devices
   - Consider adding animation disable option

2. **Accessibility**
   - AccessibilityLabels added but not comprehensive
   - Screen reader testing not performed yet
   - Will be improved in Phase 5

3. **Test Coverage**
   - Snapshot tests not included (may add if needed)
   - Animation testing limited
   - E2E tests not included (manual testing for now)

### Migration to Phase 3

Phase 2 provides the complete UI shell. Phase 3 will add the intelligence:
- Zustand stores for state management
- Quiz logic (answer validation, word selection)
- Adaptive difficulty algorithm
- Real quiz session flow

**Proceed to:** [Phase 3: Quiz Logic & State Management](./Phase-3.md)

---

*Phase 2 Complete! Your app now has polished, production-ready UI for all screens.*
