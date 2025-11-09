# Phase 1: Project Setup & Data Migration

## Phase Goal

Initialize a production-ready Expo/React Native project with TypeScript, establish the feature-sliced architecture, and migrate all vocabulary data from the Android app's XML format to structured JSON files. This phase creates the foundation for all subsequent development, ensuring proper tooling, linting, testing infrastructure, and a validated dataset of 300+ words.

**Success Criteria:**
- Expo app runs successfully on Android, iOS (simulator), and Web
- Project structure follows feature-sliced design from Phase 0
- All 8 vocabulary lists migrated to JSON with data integrity validated
- Basic navigation structure in place with placeholder screens
- ESLint, Prettier, and TypeScript configured and passing
- All configuration committed to git with clear commit history

**Estimated tokens:** ~95,000

---

## Prerequisites

### Before Starting This Phase

- [ ] Read Phase 0 completely and understand architectural decisions
- [ ] Node.js 18+ LTS installed (`node --version`)
- [ ] npm or yarn installed and working
- [ ] Git configured with user name and email
- [ ] Code editor installed (VS Code recommended)
- [ ] Terminal/command line access
- [ ] Working directory is `Migration/` at repository root

### External Dependencies

All dependencies will be installed during this phase via npm/yarn. No pre-installation required.

### Knowledge Requirements

- Basic JavaScript/TypeScript syntax
- Understanding of JSON data structures
- Familiarity with npm/yarn package management
- Basic Git operations (add, commit, push)
- Understanding of XML structure (for data migration script)

---

## Tasks

### Task 1: Initialize Expo Project with TypeScript

**Goal:** Create a new Expo managed workflow project with TypeScript template as the foundation for the React Native app.

**Files to Create:**
- `Migration/expo-project/` - New Expo project directory
- `Migration/expo-project/package.json` - Project dependencies
- `Migration/expo-project/tsconfig.json` - TypeScript configuration
- `Migration/expo-project/app.json` - Expo configuration
- `Migration/expo-project/App.tsx` - Root component (temporary, will be reorganized)

**Prerequisites:**
- Working directory: `Migration/`
- Node.js and npm installed

**Implementation Steps:**

1. **Navigate to Migration directory**
   - Change to the `Migration/` directory at repository root
   - Verify you're in the correct location (should see `docs/` folder)

2. **Initialize Expo project**
   - Use Expo CLI to create new project with TypeScript template
   - Name the project folder `expo-project`
   - Choose "blank (TypeScript)" template when prompted
   - Do NOT initialize git inside expo-project (already in parent repo)

3. **Verify project creation**
   - Navigate into `expo-project/` directory
   - Confirm presence of: `package.json`, `tsconfig.json`, `app.json`, `App.tsx`
   - Check that `node_modules/` was created (dependencies installed)

4. **Test the initial app**
   - Start Expo development server
   - Open on at least one platform (web is fastest for testing)
   - Verify "Open up App.tsx to start working" screen appears
   - Stop the development server

5. **Update app.json configuration**
   - Set app name to "Vocabulary"
   - Set slug to "vocabulary"
   - Configure Android package: `gemenielabs.vocabulary`
   - Configure iOS bundle identifier: `com.gemenielabs.vocabulary`
   - Set version to `2.0.0` (migrated version)
   - Set orientation to `portrait`
   - Configure splash screen and icon (use defaults for now)

**Verification Checklist:**
- [ ] `Migration/expo-project/` directory exists
- [ ] `package.json` shows expo SDK 51+ and react-native 0.74+
- [ ] `tsconfig.json` has strict mode enabled
- [ ] `app.json` has correct app name and package identifiers
- [ ] `npm start` or `yarn start` runs without errors
- [ ] App opens in web browser showing default Expo screen
- [ ] TypeScript compilation works (no TS errors in App.tsx)

**Testing Instructions:**

Run these commands to verify setup:
```bash
cd Migration/expo-project
npm run web  # Should open browser with default Expo app
npm run ios  # (macOS only) Should open iOS simulator
npm run android  # Should open Android emulator (if configured)
npx tsc --noEmit  # Should show no TypeScript errors
```

Expected output: App loads successfully with Expo default screen.

**Commit Message Template:**
```
feat(setup): initialize Expo project with TypeScript

- Create expo-project with blank TypeScript template
- Configure app.json with Vocabulary app metadata
- Set package name: gemenielabs.vocabulary
- Enable TypeScript strict mode
- Verify app runs on web, iOS, Android platforms
```

**Estimated tokens:** ~8,000

---

### Task 2: Install Core Dependencies

**Goal:** Install all required npm packages for the React Native app including UI library, state management, navigation, and development tools.

**Files to Modify:**
- `Migration/expo-project/package.json` - Add dependencies and devDependencies

**Prerequisites:**
- Task 1 complete (Expo project initialized)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Install UI and theming dependencies**
   - React Native Paper (Material Design 3 components)
   - React Native Safe Area Context (required by Paper)
   - React Native Vector Icons (icons for Paper)
   - Use the versions compatible with your Expo SDK

2. **Install state management dependencies**
   - Zustand (state management)
   - AsyncStorage (persistence)
   - Zustand persist middleware if not included

3. **Install navigation dependencies**
   - React Navigation (navigation framework)
   - Stack Navigator (screen navigation)
   - Required peer dependencies for React Navigation

4. **Install animation dependencies**
   - React Native Reanimated (for smooth animations)
   - Should already be included in Expo, verify version

5. **Install development dependencies**
   - ESLint (linting)
   - Prettier (code formatting)
   - TypeScript type definitions for all packages
   - Jest and React Native Testing Library (testing)

6. **Verify installation**
   - Check that all packages appear in `package.json`
   - Run install command again to ensure lockfile is updated
   - Verify no peer dependency warnings (acceptable warnings only)

7. **Test imports**
   - Temporarily import key packages in `App.tsx` to verify installation
   - Remove test imports after verification

**Verification Checklist:**
- [ ] `package.json` contains react-native-paper ~5.x
- [ ] `package.json` contains zustand ~4.x
- [ ] `package.json` contains @react-native-async-storage/async-storage
- [ ] `package.json` contains @react-navigation/native and @react-navigation/stack
- [ ] `package.json` devDependencies contains eslint, prettier
- [ ] `package.json` devDependencies contains @testing-library/react-native
- [ ] `node_modules/` updated with new packages
- [ ] No critical npm install errors (peer dependency warnings acceptable)
- [ ] `npm start` still runs successfully after installs

**Testing Instructions:**

Test that imports work:
```typescript
// Temporarily add to App.tsx
import { Button } from 'react-native-paper';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

// Run: npx tsc --noEmit
// Should show no import errors
```

Then remove test imports.

**Commit Message Template:**
```
chore(deps): install core dependencies

- Add react-native-paper 5.x for Material Design UI
- Add zustand 4.x for state management
- Add AsyncStorage for persistence
- Add react-navigation for screen navigation
- Add development dependencies: eslint, prettier
- Add testing dependencies: jest, react-native-testing-library
```

**Estimated tokens:** ~6,000

---

### Task 3: Configure ESLint and Prettier

**Goal:** Set up code quality tools (ESLint for linting, Prettier for formatting) with TypeScript support and React Native best practices.

**Files to Create:**
- `Migration/expo-project/.eslintrc.js` - ESLint configuration
- `Migration/expo-project/.prettierrc` - Prettier configuration
- `Migration/expo-project/.eslintignore` - Files to ignore in linting
- `Migration/expo-project/.prettierignore` - Files to ignore in formatting

**Files to Modify:**
- `Migration/expo-project/package.json` - Add lint and format scripts

**Prerequisites:**
- Task 2 complete (dependencies installed)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Create ESLint configuration (.eslintrc.js)**
   - Extend recommended presets: `@react-native`, `eslint:recommended`, `plugin:@typescript-eslint/recommended`
   - Configure parser for TypeScript
   - Set up React version detection (automatic)
   - Add rules for React Hooks
   - Configure environment: es2021, node, react-native
   - Add custom rules as needed (avoid too strict initially)

2. **Create Prettier configuration (.prettierrc)**
   - Set semi: true (semicolons)
   - Set singleQuote: true (single quotes for strings)
   - Set trailingComma: 'es5' (trailing commas where valid)
   - Set tabWidth: 2 (2 spaces for indentation)
   - Set printWidth: 100 (line length limit)
   - Set arrowParens: 'always' (always parens around arrow function args)

3. **Create ignore files**
   - Add common directories to `.eslintignore`: node_modules, .expo, dist, build
   - Add same directories to `.prettierignore`
   - Add generated files if any

4. **Add npm scripts**
   - Add `lint` script: `eslint . --ext .js,.jsx,.ts,.tsx`
   - Add `lint:fix` script: `eslint . --ext .js,.jsx,.ts,.tsx --fix`
   - Add `format` script: `prettier --write "**/*.{js,jsx,ts,tsx,json,md}"`
   - Add `format:check` script: `prettier --check "**/*.{js,jsx,ts,tsx,json,md}"`
   - Add `type-check` script: `tsc --noEmit`

5. **Test configuration**
   - Run lint command on current codebase
   - Fix any auto-fixable issues
   - Run format command
   - Verify TypeScript checking works

6. **Configure IDE integration (optional but recommended)**
   - If using VS Code, create `.vscode/settings.json` with format-on-save
   - This helps maintain consistency automatically

**Verification Checklist:**
- [ ] `.eslintrc.js` exists and extends TypeScript and React Native configs
- [ ] `.prettierrc` exists with consistent formatting rules
- [ ] `.eslintignore` and `.prettierignore` exclude node_modules, .expo
- [ ] `npm run lint` executes without errors
- [ ] `npm run format` successfully formats files
- [ ] `npm run type-check` runs TypeScript compiler in check mode
- [ ] All scripts in package.json execute successfully

**Testing Instructions:**

Run all quality check scripts:
```bash
npm run lint           # Should pass or show fixable issues
npm run lint:fix       # Should auto-fix issues
npm run format         # Should format all files
npm run format:check   # Should pass after formatting
npm run type-check     # Should show no TypeScript errors
```

**Commit Message Template:**
```
chore(config): configure ESLint and Prettier

- Add .eslintrc.js with TypeScript and React Native rules
- Add .prettierrc with project formatting standards
- Add lint, format, and type-check npm scripts
- Configure ignore files for build artifacts
- Enable strict TypeScript checking
```

**Estimated tokens:** ~7,000

---

### Task 4: Set Up Project Structure (Feature-Sliced Design)

**Goal:** Create the complete folder structure following feature-sliced design architecture from Phase 0, setting the foundation for organized, scalable code.

**Files to Create:**
- `Migration/expo-project/src/` - Source code root
- Directory structure as defined in Phase 0
- Placeholder `index.ts` files for each module
- Basic type definition files

**Files to Modify:**
- `Migration/expo-project/tsconfig.json` - Add path aliases
- `Migration/expo-project/package.json` - Update main entry point

**Prerequisites:**
- Task 3 complete (linting configured)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Create main source directory**
   - Create `src/` directory in project root
   - This will contain all application code

2. **Create app/ directory structure**
   - `src/app/` - Application initialization layer
   - Create placeholder files: `App.tsx`, `navigation.tsx`, `providers.tsx`
   - These will be implemented in later tasks

3. **Create features/ directory structure**
   - `src/features/quiz/` with subdirs: components, hooks, utils, screens, __tests__
   - `src/features/vocabulary/` with subdirs: components, hooks, utils, screens, __tests__
   - `src/features/progress/` with subdirs: components, hooks, screens, __tests__
   - `src/features/settings/` with subdirs: components, screens, __tests__
   - Add empty `index.ts` in each feature to enable clean imports later

4. **Create shared/ directory structure**
   - `src/shared/ui/` - Reusable UI components
   - `src/shared/lib/` - Utilities and helpers (create constants.ts, storage.ts placeholders)
   - `src/shared/store/` - Zustand stores (create placeholder files for each store)
   - `src/shared/types/` - TypeScript type definitions
   - `src/shared/hooks/` - Shared custom hooks
   - Add `index.ts` files for clean exports

5. **Create assets/ directory structure**
   - `src/assets/vocabulary/` - Will hold JSON vocabulary files
   - `src/assets/images/` - Images (empty for now)
   - `src/assets/sounds/` - Sound effects (empty for now, Phase 5)

6. **Create type definition files**
   - `src/shared/types/vocabulary.ts` - Copy type definitions from Phase 0
   - `src/shared/types/progress.ts` - Copy from Phase 0
   - `src/shared/types/quiz.ts` - Copy from Phase 0
   - `src/shared/types/navigation.ts` - Copy from Phase 0
   - `src/shared/types/index.ts` - Re-export all types

7. **Configure TypeScript path aliases**
   - Edit `tsconfig.json` to add `paths` configuration
   - Add aliases: `@/*` → `./src/*`, `@/shared/*` → `./src/shared/*`, `@/features/*` → `./src/features/*`
   - This enables clean imports like `import { Type } from '@/shared/types'`

8. **Update project entry point**
   - Move `App.tsx` logic to `src/app/App.tsx`
   - Update root `App.tsx` to import from `src/app/App`
   - Or configure `package.json` main entry to point to `src/app/App.tsx`

9. **Create scripts/ directory for utilities**
   - `scripts/parseXmlToJson.ts` - Data migration script (skeleton)
   - `scripts/validateVocabulary.ts` - Validation script (skeleton)

**Verification Checklist:**
- [ ] `src/` directory exists with subdirectories: app, features, shared, assets
- [ ] All features have proper subdirectories (components, hooks, utils, screens, __tests__)
- [ ] `src/shared/types/` contains all type definition files from Phase 0
- [ ] `src/shared/types/index.ts` exports all types
- [ ] `tsconfig.json` has path aliases configured
- [ ] TypeScript compiler recognizes path aliases (no import errors)
- [ ] `scripts/` directory exists with placeholder script files
- [ ] Project still runs: `npm start` works without errors
- [ ] Linting passes on new structure: `npm run lint`

**Testing Instructions:**

Verify structure and TypeScript paths:
```bash
# Check directory structure
find src -type d  # Should show all directories

# Verify path aliases work
# Create test file: src/app/App.tsx with import:
import { VocabularyWord } from '@/shared/types';

# Run type check
npm run type-check  # Should resolve path alias correctly
```

**Commit Message Template:**
```
feat(structure): implement feature-sliced design architecture

- Create src/ directory with app, features, shared, assets
- Set up feature modules: quiz, vocabulary, progress, settings
- Add shared modules: ui, lib, store, types, hooks
- Configure TypeScript path aliases for clean imports
- Add type definitions from Phase 0 architecture
- Create scripts/ directory for data migration tools
```

**Estimated tokens:** ~10,000

---

### Task 5: Create Data Migration Script

**Goal:** Build a Node.js script that parses the Android app's XML vocabulary data and transforms it into structured JSON files, one per list (A-H).

**Files to Create:**
- `Migration/expo-project/scripts/parseXmlToJson.ts` - Main migration script
- `Migration/expo-project/scripts/types.ts` - Types for migration script

**Files to Modify:**
- `Migration/expo-project/package.json` - Add migration script command

**Prerequisites:**
- Task 4 complete (project structure set up)
- Access to Android app source code at `../../app/src/main/res/values/array.xml`
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Install XML parsing dependency**
   - Install `xml2js` package for parsing XML
   - Install `@types/xml2js` for TypeScript support
   - Install `zod` for schema validation (used in validation script)

2. **Study the source XML structure**
   - Read the Android app's `array.xml` file
   - Note the naming pattern: `{list}{level}{type}` (e.g., `abasicWordList`)
   - Understand array structure: each array contains 8-10 items
   - Lists A & B have 8 words per level, Lists C-H have 10 words

3. **Create migration script structure**
   - Import required modules: fs, path, xml2js
   - Define interfaces for parsed XML data
   - Define target JSON structure (matching Phase 0 types)

4. **Implement XML parsing**
   - Read `../../app/src/main/res/values/array.xml`
   - Parse XML to JavaScript object using xml2js
   - Extract all `<string-array>` elements
   - Build a Map of array name → items

5. **Implement data transformation logic**
   - Define lists: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
   - Define levels: ['basic', 'intermediate', 'advanced', 'expert', 'professional']
   - For each list:
     - For each level:
       - Build array names: `${list}${level}WordList`, etc.
       - Fetch words, definitions, fillInBlanks from Map
       - Validate lengths match (warn if mismatch)
       - Combine into word objects with unique IDs
       - Build level object with all words
     - Build list object with all levels
   - Handle HTML entities (decode `\'` to `'`, etc.)

6. **Implement JSON generation**
   - For each list, write JSON file to `src/assets/vocabulary/list-{list}.json`
   - Use pretty-printing: `JSON.stringify(data, null, 2)`
   - Log progress for each file generated

7. **Add error handling**
   - Check if source XML file exists before parsing
   - Validate array lengths match before combining
   - Warn about empty arrays (List H may be placeholder)
   - Handle parsing errors gracefully

8. **Add npm script**
   - Add to package.json scripts: `migrate-data: ts-node scripts/parseXmlToJson.ts`
   - Install `ts-node` as dev dependency if not already installed

**Verification Checklist:**
- [ ] `scripts/parseXmlToJson.ts` exists and is well-commented
- [ ] Script can read and parse `array.xml` from Android app
- [ ] Script handles all 8 lists (A-H) and 5 levels
- [ ] Script correctly combines WordList + DefinitionWordList + FillInTheBlank
- [ ] HTML entities are decoded (e.g., `\'` becomes `'`)
- [ ] Word IDs follow pattern: `{list}-{level}-{index}`
- [ ] Script logs progress and any warnings
- [ ] `npm run migrate-data` executes successfully

**Testing Instructions:**

Run migration script:
```bash
npm run migrate-data

# Expected output:
# Reading XML from ../../app/src/main/res/values/array.xml
# Parsing XML...
# Processing List A...
# ✅ Generated src/assets/vocabulary/list-a.json (40 words)
# Processing List B...
# ✅ Generated src/assets/vocabulary/list-b.json (40 words)
# ...
# ✅ Migration complete! 8 files generated.
```

Manually inspect one JSON file to verify structure matches Phase 0 schema.

**Commit Message Template:**
```
feat(migration): create XML to JSON data migration script

- Add parseXmlToJson.ts script to transform Android XML data
- Parse array.xml from Android app source
- Generate 8 JSON files (list-a through list-h)
- Combine WordList, DefinitionWordList, FillInTheBlank arrays
- Decode HTML entities in text content
- Generate unique word IDs: {list}-{level}-{index}
- Add npm script: migrate-data
```

**Estimated tokens:** ~15,000

---

### Task 6: Create Data Validation Script

**Goal:** Build a script that validates the generated JSON vocabulary files against the schema, checks data integrity, and ensures all required fields are present and correct.

**Files to Create:**
- `Migration/expo-project/scripts/validateVocabulary.ts` - Validation script

**Files to Modify:**
- `Migration/expo-project/package.json` - Add validation script command

**Prerequisites:**
- Task 5 complete (migration script created)
- Zod installed (for schema validation)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Create Zod schemas**
   - Define schema for VocabularyWord (id, word, definition, fillInBlank required)
   - Define schema for VocabularyLevel (id, name, words array)
   - Define schema for VocabularyList (id, name, levels array)
   - Mirror the TypeScript types from `shared/types/vocabulary.ts`

2. **Implement file validation function**
   - Accept file path as parameter
   - Read JSON file contents
   - Parse JSON
   - Validate against Zod schema (will throw on validation errors)
   - Return validation result with details

3. **Implement data integrity checks**
   - Check for duplicate word IDs within a level
   - Verify all fillInBlank sentences contain blank placeholder (`___` or `____`)
   - Verify no empty strings in required fields
   - Check word counts: Lists A & B should have 8 words per level, others 10
   - Calculate and log total word count per list

4. **Implement validation runner**
   - Find all JSON files in `src/assets/vocabulary/`
   - Validate each file
   - Collect results (success/failure)
   - Display summary at end

5. **Add detailed logging**
   - Log which file is being validated
   - Log success with word count
   - Log errors with specific field/path
   - Log warnings for non-critical issues (e.g., no blank in fillInBlank)

6. **Handle validation failures**
   - Exit with error code 1 if any file fails validation
   - Exit with code 0 if all files pass
   - This enables CI/CD integration later

7. **Add npm script**
   - Add to package.json: `validate-data: ts-node scripts/validateVocabulary.ts`
   - Add combined script: `migrate-and-validate: npm run migrate-data && npm run validate-data`

**Verification Checklist:**
- [ ] `scripts/validateVocabulary.ts` exists and is well-commented
- [ ] Zod schemas match TypeScript types from Phase 0
- [ ] Script validates all required fields are present
- [ ] Script checks for duplicate word IDs
- [ ] Script verifies fillInBlank sentences have blanks
- [ ] Script logs validation results clearly
- [ ] Script exits with proper exit codes (0 success, 1 failure)
- [ ] `npm run validate-data` executes successfully on generated data

**Testing Instructions:**

First, run migration if not done yet:
```bash
npm run migrate-data
```

Then validate:
```bash
npm run validate-data

# Expected output:
# Validating vocabulary data...
# ✅ List A: 40 words validated
# ✅ List B: 40 words validated
# ✅ List C: 50 words validated
# ...
#
# Summary:
# Total lists: 8
# Total words: ~340
# All files valid: ✅
```

Test with intentionally broken data:
- Temporarily modify a JSON file (remove required field)
- Run validation - should fail with clear error
- Restore file
- Run validation - should pass

**Commit Message Template:**
```
feat(migration): add vocabulary data validation script

- Create validateVocabulary.ts with Zod schema validation
- Validate all required fields: id, word, definition, fillInBlank
- Check for duplicate word IDs within levels
- Verify fillInBlank sentences contain blank placeholders
- Log detailed validation results with word counts
- Exit with error code on validation failure
- Add npm scripts: validate-data, migrate-and-validate
```

**Estimated tokens:** ~12,000

---

### Task 7: Run Data Migration and Validation

**Goal:** Execute the data migration process to generate all 8 vocabulary JSON files and validate their integrity, creating the core dataset for the application.

**Files to Create:**
- `Migration/expo-project/src/assets/vocabulary/list-a.json` through `list-h.json` (8 files)

**Prerequisites:**
- Task 5 complete (migration script created)
- Task 6 complete (validation script created)
- Android source code available at `../../app/src/main/res/values/array.xml`
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Verify source XML exists**
   - Check that `../../app/src/main/res/values/array.xml` is accessible
   - Open file briefly to confirm it contains vocabulary data
   - Note the file size (should be ~102KB)

2. **Run migration script**
   - Execute: `npm run migrate-data`
   - Monitor console output for progress
   - Check for any warning messages
   - Verify 8 JSON files created in `src/assets/vocabulary/`

3. **Inspect generated JSON files**
   - Open `list-a.json` in editor
   - Verify structure matches Phase 0 schema
   - Check sample words, definitions, fillInBlank sentences
   - Verify special characters are properly decoded (e.g., apostrophes)
   - Check that word IDs follow pattern: `a-basic-1`, `a-basic-2`, etc.

4. **Run validation script**
   - Execute: `npm run validate-data`
   - Verify all 8 files pass validation
   - Check reported word counts match expectations:
     - Lists A, B: 40 words each (8 per level × 5 levels)
     - Lists C-H: 50 words each (10 per level × 5 levels) or less if incomplete
   - Note total word count across all lists

5. **Manual spot-check validation**
   - Pick 5 random words from different lists
   - Cross-reference with Android XML to verify accuracy
   - Check that:
     - Word spelling matches
     - Definition text matches
     - FillInBlank sentence matches
     - HTML entities decoded correctly

6. **Document any issues found**
   - If List H is empty or incomplete (expected), document this
   - If any data mismatches found, investigate and fix migration script
   - Re-run migration after fixes

7. **Verify git status**
   - Check that all 8 JSON files are untracked (not yet committed)
   - Review file sizes (each should be several KB)

**Verification Checklist:**
- [ ] All 8 JSON files exist in `src/assets/vocabulary/`
- [ ] Each file has structure: `{ id, name, description?, levels: [...] }`
- [ ] List A has 40 words, List B has 40 words
- [ ] Lists C-G have 50 words each (or document if different)
- [ ] List H status documented (may be empty placeholder)
- [ ] All files pass `npm run validate-data` without errors
- [ ] Spot-check confirms data accuracy vs. Android XML
- [ ] Total word count is ~340 words (document exact count)
- [ ] All special characters properly decoded
- [ ] FillInBlank sentences contain `___` or `____` placeholders

**Testing Instructions:**

Complete migration and validation:
```bash
# Run migration
npm run migrate-data

# Validate output
npm run validate-data

# Count total words across all files (manual or script)
# Expected: ~340 words total

# Manually verify structure of one file
cat src/assets/vocabulary/list-a.json | head -50

# Check file sizes
ls -lh src/assets/vocabulary/
```

**Commit Message Template:**
```
feat(data): migrate vocabulary data from Android XML to JSON

- Generate 8 vocabulary list JSON files (list-a through list-h)
- List A: 40 words (8 per level × 5 levels)
- List B: 40 words (8 per level × 5 levels)
- Lists C-G: 50 words each (10 per level × 5 levels)
- List H: [document status - empty or incomplete]
- Total: ~340 vocabulary words migrated
- All files validated and data integrity confirmed
```

**Estimated tokens:** ~10,000

---

### Task 8: Set Up Basic Navigation Structure

**Goal:** Configure React Navigation with a Stack Navigator and create placeholder screens for all main app screens (Home, Difficulty, Quiz, Graduation, Stats, Settings).

**Files to Create:**
- `Migration/expo-project/src/app/navigation.tsx` - Navigation configuration
- `Migration/expo-project/src/features/vocabulary/screens/HomeScreen.tsx` - Placeholder
- `Migration/expo-project/src/features/vocabulary/screens/DifficultyScreen.tsx` - Placeholder
- `Migration/expo-project/src/features/quiz/screens/QuizScreen.tsx` - Placeholder
- `Migration/expo-project/src/features/quiz/screens/GraduationScreen.tsx` - Placeholder
- `Migration/expo-project/src/features/progress/screens/StatsScreen.tsx` - Placeholder
- `Migration/expo-project/src/features/settings/screens/SettingsScreen.tsx` - Placeholder

**Files to Modify:**
- `Migration/expo-project/src/app/App.tsx` - Import and render navigation
- `Migration/expo-project/src/shared/types/navigation.ts` - Define route params

**Prerequisites:**
- Task 4 complete (project structure set up)
- React Navigation dependencies installed (Task 2)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Define navigation types**
   - Edit `src/shared/types/navigation.ts`
   - Define `RootStackParamList` type with all routes:
     - Home: undefined
     - Difficulty: { listId: string }
     - Quiz: { listId: string; levelId: string }
     - Graduation: { listId: string; levelId: string; stats: SessionStats }
     - Stats: undefined
     - Settings: undefined
   - Define SessionStats type inline or import from quiz types

2. **Create placeholder screen components**
   - For each screen (HomeScreen, DifficultyScreen, etc.):
     - Create functional component with proper TypeScript types
     - Use React Navigation's screen prop types
     - Render simple View with Text showing screen name
     - Add a Button to navigate to next screen (if applicable)
     - Use React Native Paper components (Button, Text, Surface)

3. **Create navigation configuration**
   - Edit `src/app/navigation.tsx`
   - Import Stack Navigator from `@react-navigation/stack`
   - Import all placeholder screen components
   - Create Stack Navigator with TypeScript: `createStackNavigator<RootStackParamList>()`
   - Configure each screen in Stack.Screen components
   - Set screen options (header title, etc.)

4. **Wrap navigation in container**
   - Import NavigationContainer from `@react-navigation/native`
   - Wrap Stack.Navigator in NavigationContainer
   - Export default navigation component

5. **Integrate navigation into App.tsx**
   - Edit `src/app/App.tsx`
   - Import navigation component
   - Render navigation inside app providers (to be added in next task)
   - For now, just render NavigationContainer directly

6. **Test navigation flow**
   - Start app: `npm start`
   - Should show HomeScreen
   - Test navigation between screens using buttons
   - Verify route params are passed correctly (check React Navigation DevTools)

7. **Add navigation types for useNavigation hook**
   - Create typed hooks for useNavigation and useRoute
   - Export from shared/types or navigation file
   - This provides autocomplete for navigation.navigate()

**Verification Checklist:**
- [ ] `src/shared/types/navigation.ts` defines RootStackParamList
- [ ] All 6 placeholder screens created in correct feature directories
- [ ] Each screen uses React Native Paper components
- [ ] `src/app/navigation.tsx` configures Stack Navigator with all routes
- [ ] App.tsx renders NavigationContainer with screens
- [ ] `npm start` launches app showing HomeScreen
- [ ] Can navigate between screens using placeholder buttons
- [ ] TypeScript provides autocomplete for navigation.navigate()
- [ ] No TypeScript errors related to navigation types

**Testing Instructions:**

Test navigation manually:
```bash
npm start  # Launch app

# Should see HomeScreen
# Click button to navigate to DifficultyScreen
# Should show Difficulty screen with listId in params
# Navigate to Quiz screen
# Verify params passed correctly
# Use browser/dev tools to inspect navigation state
```

Verify types:
```typescript
// In any screen component, test autocomplete:
const navigation = useNavigation();
navigation.navigate('Quiz', { listId: 'a', levelId: 'basic' });
// TypeScript should autocomplete route names and require correct params
```

**Commit Message Template:**
```
feat(navigation): set up React Navigation with Stack Navigator

- Configure Stack Navigator with 6 main screens
- Create placeholder screens: Home, Difficulty, Quiz, Graduation, Stats, Settings
- Define RootStackParamList with typed route parameters
- Integrate NavigationContainer in App.tsx
- Add typed useNavigation hooks for autocomplete
- Enable navigation flow between screens
```

**Estimated tokens:** ~12,000

---

### Task 9: Set Up App Providers (Theme, SafeArea)

**Goal:** Configure global providers for React Native Paper theme and SafeAreaProvider, setting up the foundation for consistent styling and layout across the app.

**Files to Create:**
- `Migration/expo-project/src/app/providers.tsx` - Global providers wrapper
- `Migration/expo-project/src/shared/lib/theme.ts` - Theme configuration

**Files to Modify:**
- `Migration/expo-project/src/app/App.tsx` - Wrap app in providers

**Prerequisites:**
- Task 8 complete (navigation set up)
- React Native Paper installed (Task 2)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Create theme configuration**
   - Create `src/shared/lib/theme.ts`
   - Import MD3LightTheme and MD3DarkTheme from react-native-paper
   - Define custom light theme extending MD3LightTheme
   - Define custom dark theme extending MD3DarkTheme
   - Customize colors if desired (or use defaults for now)
   - Export both themes

2. **Create Providers component**
   - Create `src/app/providers.tsx`
   - Import PaperProvider from react-native-paper
   - Import SafeAreaProvider from react-native-safe-area-context
   - Import theme from shared/lib/theme
   - Create Providers component accepting children prop
   - Wrap children in SafeAreaProvider > PaperProvider

3. **Add theme state (optional for Phase 1, required for Phase 5)**
   - For now, just use light theme
   - In Phase 5, add theme toggle with settingsStore

4. **Integrate providers into App.tsx**
   - Import Providers component
   - Wrap NavigationContainer in Providers
   - Structure: `<Providers><NavigationContainer>...</NavigationContainer></Providers>`

5. **Test theme integration**
   - Update a placeholder screen to use Paper components (Button, Text, Card)
   - Verify components use theme colors
   - Check that SafeArea works (insets on notched devices)

6. **Add font configuration (if needed)**
   - React Native Paper uses system fonts by default
   - Can customize fonts later in Phase 5 if desired

**Verification Checklist:**
- [ ] `src/shared/lib/theme.ts` exports light and dark themes
- [ ] `src/app/providers.tsx` wraps children in SafeAreaProvider and PaperProvider
- [ ] App.tsx wraps NavigationContainer in Providers
- [ ] App starts successfully: `npm start`
- [ ] React Native Paper components render with theme colors
- [ ] SafeArea insets work correctly on device with notch (test on simulator/device)
- [ ] No console warnings about missing providers

**Testing Instructions:**

Update a screen to use Paper components:
```typescript
// In HomeScreen.tsx
import { Button, Text, Surface } from 'react-native-paper';

export function HomeScreen() {
  return (
    <Surface style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text variant="headlineLarge">Vocabulary App</Text>
      <Button mode="contained" onPress={() => {}}>
        Get Started
      </Button>
    </Surface>
  );
}
```

Run app and verify Button uses theme primary color.

**Commit Message Template:**
```
feat(theme): configure React Native Paper theme and providers

- Create theme configuration with Material Design 3
- Set up light and dark theme (light theme active)
- Create Providers component with PaperProvider and SafeAreaProvider
- Wrap app in providers for consistent theming
- Enable theme-aware components across the app
```

**Estimated tokens:** ~8,000

---

### Task 10: Create Vocabulary Loader Utility

**Goal:** Build a utility function that loads vocabulary JSON files from assets and provides type-safe access to vocabulary data throughout the app.

**Files to Create:**
- `Migration/expo-project/src/features/vocabulary/utils/vocabularyLoader.ts` - Loader utility

**Files to Modify:**
- None (utility will be used by store in Phase 3)

**Prerequisites:**
- Task 7 complete (vocabulary JSON files exist)
- Task 4 complete (types defined)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Plan the loader approach**
   - Since JSON files are in assets, they can be directly imported in React Native
   - Import all 8 JSON files at module level
   - Create loader function that returns vocabulary data

2. **Import vocabulary JSON files**
   - Import each JSON file: `import listA from '@/assets/vocabulary/list-a.json'`
   - Import all 8 lists (A-H)
   - TypeScript should infer types from JSON structure

3. **Create type guards (optional)**
   - Validate that imported JSON matches VocabularyList type
   - Use runtime validation or just rely on TypeScript

4. **Create loadVocabularyLists function**
   - Return array of all vocabulary lists
   - Return type: `VocabularyList[]`
   - Simply return array: `[listA, listB, ...]`

5. **Create helper functions**
   - `getListById(id: string): VocabularyList | undefined` - Find list by ID
   - `getLevelWords(listId: string, levelId: string): VocabularyWord[]` - Get words for specific level
   - `getAllWords(): VocabularyWord[]` - Get all words from all lists (useful for stats)

6. **Add error handling**
   - If JSON import fails, handle gracefully
   - Provide meaningful error messages
   - Consider fallback data or error state

7. **Add JSDoc comments**
   - Document each function with description, params, return type
   - Helps with autocomplete and understanding

**Verification Checklist:**
- [ ] `vocabularyLoader.ts` imports all 8 JSON files successfully
- [ ] `loadVocabularyLists()` returns array of 8 VocabularyList objects
- [ ] `getListById('a')` returns List A data
- [ ] `getLevelWords('a', 'basic')` returns 8 words for List A Basic level
- [ ] `getAllWords()` returns all ~340 words
- [ ] All functions have proper TypeScript return types
- [ ] JSDoc comments added for documentation
- [ ] No runtime errors when calling functions

**Testing Instructions:**

Create a simple test:
```typescript
// In vocabularyLoader.test.ts or just manual test in console
import { loadVocabularyLists, getListById, getLevelWords } from './vocabularyLoader';

const lists = loadVocabularyLists();
console.log('Total lists:', lists.length); // Should be 8

const listA = getListById('list-a');
console.log('List A name:', listA?.name); // Should be "List A"

const words = getLevelWords('list-a', 'basic');
console.log('List A Basic words:', words.length); // Should be 8
console.log('First word:', words[0].word); // Should be "abject"
```

Run with `npx ts-node` or import in a component and check console.

**Commit Message Template:**
```
feat(vocabulary): create vocabulary data loader utility

- Import all 8 vocabulary JSON files
- Create loadVocabularyLists() to return all lists
- Add getListById() helper to find list by ID
- Add getLevelWords() to get words for specific list/level
- Add getAllWords() to get all vocabulary words
- Add TypeScript types and JSDoc documentation
```

**Estimated tokens:** ~9,000

---

### Task 11: Add Placeholder Content to Screens

**Goal:** Update all placeholder screens with basic layout and navigation flow to demonstrate the app structure and prepare for Phase 2 UI implementation.

**Files to Modify:**
- All screen files created in Task 8

**Prerequisites:**
- Task 8 complete (placeholder screens created)
- Task 9 complete (theme providers set up)
- Task 10 complete (vocabulary loader available)
- Working directory: `Migration/expo-project/`

**Implementation Steps:**

1. **Update HomeScreen**
   - Import vocabulary loader
   - Load and display list of 8 vocabulary lists
   - Create a simple list or grid of buttons (one per list A-H)
   - Each button navigates to Difficulty screen with listId param
   - Add app title/header
   - Use React Native Paper components: Surface, Text, Button

2. **Update DifficultyScreen**
   - Get listId from route params
   - Display list name (e.g., "List A")
   - Show 5 level buttons: Basic, Intermediate, Advanced, Expert, Professional
   - Each button navigates to Quiz screen with listId and levelId params
   - Add back navigation to Home

3. **Update QuizScreen**
   - Get listId and levelId from route params
   - Display list and level name (e.g., "List A - Basic")
   - Show placeholder text: "Quiz will be implemented in Phase 3"
   - Add button to skip to Graduation screen (for testing flow)
   - Add back navigation to Difficulty

4. **Update GraduationScreen**
   - Get listId, levelId, and stats from route params (stats may be undefined for now)
   - Display completion message
   - Show placeholder stats: "Hints: 0, Wrong: 0"
   - Add button to return to Home
   - Add button to reset and try again (navigates back to Quiz)

5. **Update StatsScreen**
   - Display overall statistics placeholder
   - Show: "Total words learned: 0"
   - Show: "Lists completed: 0"
   - Use dummy data for now (real data in Phase 4)
   - Add navigation to this screen from Home (menu or button)

6. **Update SettingsScreen**
   - Display settings placeholder
   - Show: "Theme: Light" (non-functional for now)
   - Show: "Sound: On" (non-functional for now)
   - Add navigation to this screen from Home

7. **Test complete navigation flow**
   - Home → Select List A → Select Basic → Quiz → Graduation → Home
   - Verify all route params passed correctly
   - Check that back navigation works

**Verification Checklist:**
- [ ] HomeScreen displays all 8 vocabulary lists
- [ ] Clicking list navigates to Difficulty with correct listId
- [ ] DifficultyScreen shows 5 level buttons
- [ ] Clicking level navigates to Quiz with correct params
- [ ] QuizScreen displays list and level name from params
- [ ] Can navigate to Graduation screen
- [ ] Graduation screen displays completion message
- [ ] Can navigate back to Home from Graduation
- [ ] Stats and Settings screens accessible from Home
- [ ] All screens use React Native Paper components
- [ ] Navigation flow works end-to-end without errors

**Testing Instructions:**

Manual navigation test:
```bash
npm start

# Test complete flow:
# 1. HomeScreen appears with 8 list buttons
# 2. Click "List A" → Difficulty screen shows
# 3. Click "Basic" → Quiz screen shows "List A - Basic"
# 4. Click "Skip to Graduation" → Graduation screen shows
# 5. Click "Back to Home" → Returns to HomeScreen
# 6. Click "Stats" → Stats screen shows placeholder
# 7. Navigate back
# 8. Click "Settings" → Settings screen shows placeholder
```

**Commit Message Template:**
```
feat(screens): add placeholder content and navigation flow

- HomeScreen displays 8 vocabulary lists with navigation
- DifficultyScreen shows 5 level buttons per list
- QuizScreen displays list and level from route params
- GraduationScreen shows completion message
- StatsScreen and SettingsScreen added to navigation
- Complete navigation flow: Home → Difficulty → Quiz → Graduation
- All screens use React Native Paper components
```

**Estimated tokens:** ~14,000

---

## Phase Verification

### Complete Phase Checklist

Before moving to Phase 2, verify all tasks complete:

- [ ] **Task 1:** Expo project initialized with TypeScript
- [ ] **Task 2:** All core dependencies installed
- [ ] **Task 3:** ESLint and Prettier configured
- [ ] **Task 4:** Project structure follows feature-sliced design
- [ ] **Task 5:** Data migration script created and working
- [ ] **Task 6:** Data validation script created and working
- [ ] **Task 7:** All 8 vocabulary JSON files generated and validated
- [ ] **Task 8:** Navigation configured with 6 screens
- [ ] **Task 9:** App providers (theme, SafeArea) set up
- [ ] **Task 10:** Vocabulary loader utility created
- [ ] **Task 11:** Placeholder screens with navigation flow

### Integration Testing

Run all quality checks:
```bash
cd Migration/expo-project

# Code quality
npm run lint
npm run format:check
npm run type-check

# Data validation
npm run validate-data

# App execution
npm run web  # Should open browser with HomeScreen
npm run ios  # Should open iOS simulator (macOS only)
npm run android  # Should open Android emulator
```

All commands should complete without errors.

### Manual Testing Checklist

- [ ] App launches successfully on web
- [ ] App launches successfully on iOS simulator (if available)
- [ ] App launches successfully on Android emulator (if available)
- [ ] Can navigate through complete flow: Home → Difficulty → Quiz → Graduation
- [ ] All route parameters passed correctly
- [ ] Back navigation works as expected
- [ ] React Native Paper theme applied to all components
- [ ] No console errors or warnings
- [ ] Vocabulary data loads without errors

### File Structure Verification

Confirm directory structure matches Phase 0:
```bash
tree src -L 3  # Should show feature-sliced structure

# Verify key files exist:
ls src/app/
ls src/features/quiz/screens/
ls src/shared/types/
ls src/assets/vocabulary/  # Should show 8 JSON files
```

### Data Integrity Verification

Verify vocabulary data:
```bash
# Total files
ls src/assets/vocabulary/*.json | wc -l  # Should be 8

# Total words (approximate)
# Open one file and check structure
cat src/assets/vocabulary/list-a.json | jq '.levels[0].words | length'  # Should be 8 for List A Basic

# Validate all data
npm run validate-data  # Should pass all checks
```

### Git Status Verification

Before committing, check git status:
```bash
git status

# Should show:
# - Migration/docs/plans/ committed in earlier phase
# - Migration/expo-project/ untracked or partially committed
```

All tasks in Phase 1 should be committed with proper commit messages.

---

## Known Limitations & Technical Debt

### Limitations Introduced in Phase 1

1. **Placeholder Screens**
   - All screens are placeholders with minimal UI
   - Will be implemented properly in Phase 2

2. **No State Management Yet**
   - Store files are empty placeholders
   - Will be implemented in Phase 3

3. **No Persistence**
   - User progress not saved yet
   - Will be implemented in Phase 4

4. **Theme Toggle Not Functional**
   - Theme is hardcoded to light mode
   - Toggle will be added in Phase 5

5. **List H May Be Incomplete**
   - Original Android app may have placeholder data for List H
   - Documented during migration task

### Technical Debt

1. **Test Coverage**
   - No tests written yet in Phase 1
   - Tests will be added in Phase 2+ alongside implementation

2. **Accessibility**
   - AccessibilityLabels not added yet
   - Will be added in Phase 5

3. **Error Boundaries**
   - No error boundaries set up yet
   - Will be added in Phase 2

4. **Loading States**
   - Vocabulary loader has no loading state (JSON import is synchronous)
   - May need async loading if migrating to remote data in future

### Migration to Phase 2

Phase 1 establishes the foundation. Phase 2 will build upon this by:
- Creating a comprehensive UI component library
- Implementing all screen UIs properly
- Adding loading states and error handling
- Starting test coverage for components

**Proceed to:** [Phase 2: Core UI Components](./Phase-2.md)

---

*Phase 1 Complete! You should now have a working Expo app with navigation and validated vocabulary data.*
