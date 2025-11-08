# Vocabulary Data Migration Guide

## Overview

This guide explains how to migrate vocabulary data from the Android XML format to the React Native JSON format.

---

## Current XML Structure (Android)

The Android app stores vocabulary in `/app/src/main/res/values/array.xml` with this pattern:

```xml
<!-- List A, Basic level -->
<string-array name="abasicWordList">
    <item>abject</item>
    <item>aberration</item>
    <!-- ... more words -->
</string-array>

<string-array name="abasicDefinitionWordList">
    <item>(of something bad) experienced or present to the maximum degree</item>
    <item>a departure from what is normal, usual, or expected...</item>
    <!-- ... more definitions -->
</string-array>

<string-array name="abasicFillInTheBlank">
    <item>Timmy was _____ after falling off the jungle gym...</item>
    <item>It wasn't an ________ they really were making her pull her hair out</item>
    <!-- ... more sentences -->
</string-array>
```

### Naming Convention:

**Pattern:** `{list}{level}{type}`

- **List:** a, b, c, d, e, f, g, h (lowercase)
- **Level:** basic, intermediate, advanced, professional, expert
- **Type:** WordList, DefinitionWordList, FillInTheBlank

**Examples:**
- `abasicWordList` = List A, Basic level, words
- `cadvancedDefinitionWordList` = List C, Advanced level, definitions
- `gexpertFillInTheBlank` = List G, Expert level, fill-in-blank sentences

### Data Organization:

- **Lists A & B:** 8 words per level
- **Lists C-H:** 10 words per level
- **Levels:** 5 per list (Basic, Intermediate, Advanced, Professional, Expert)
- **Total Arrays:** 8 lists × 5 levels × 3 types = 120 string-arrays

---

## Target JSON Structure (React Native)

### File Organization:

```
assets/vocabulary/
├── list-a.json
├── list-b.json
├── list-c.json
├── list-d.json
├── list-e.json
├── list-f.json
├── list-g.json
└── list-h.json
```

Each file represents one vocabulary list with all levels.

### JSON Schema:

```typescript
interface VocabularyWord {
  id: string;                    // Unique identifier (e.g., "word-1")
  word: string;                  // The vocabulary word
  definition: string;            // Definition text
  fillInBlank: string;          // Sentence with blank
  examples?: string[];           // Optional usage examples (future)
  synonyms?: string[];          // Optional synonyms (future)
  difficulty?: number;          // Optional 1-10 difficulty rating (future)
}

interface VocabularyLevel {
  id: string;                    // "basic", "intermediate", etc.
  name: string;                  // "Basic", "Intermediate", etc.
  words: VocabularyWord[];      // Array of words for this level
}

interface VocabularyList {
  id: string;                    // "list-a", "list-b", etc.
  name: string;                  // "List A", "List B", etc.
  description?: string;          // Optional description
  levels: VocabularyLevel[];    // Array of 5 levels
}
```

### Sample JSON (list-a.json):

```json
{
  "id": "list-a",
  "name": "List A",
  "description": "Foundation vocabulary - essential words for advanced learners",
  "levels": [
    {
      "id": "basic",
      "name": "Basic",
      "words": [
        {
          "id": "a-basic-1",
          "word": "abject",
          "definition": "(of something bad) experienced or present to the maximum degree",
          "fillInBlank": "Timmy was _____ after falling off the jungle gym and into the lava"
        },
        {
          "id": "a-basic-2",
          "word": "aberration",
          "definition": "a departure from what is normal, usual, or expected, typically one that is unwelcome",
          "fillInBlank": "It wasn't an ________ they really were making her pull her hair out"
        },
        {
          "id": "a-basic-3",
          "word": "abjure",
          "definition": "solemnly renounce (a belief, cause, or claim)",
          "fillInBlank": "After months of late-night cheese binges, she decided to ______ all dairy, embracing the concept of salads and reluctantly turning her back on extra-mature cheddar."
        },
        {
          "id": "a-basic-4",
          "word": "abnegate",
          "definition": "renounce or reject (something desired or valuable)",
          "fillInBlank": "The monk chose to _______ worldly pleasures, seeking enlightenment through meditation and a surprisingly competitive board game collection."
        },
        {
          "id": "a-basic-5",
          "word": "abrogate",
          "definition": "repeal or do away with (a law, right, or formal agreement)",
          "fillInBlank": "The band was ______ from the hotel after an unfortunate incident involving a flock of pigeons, a confetti cannon, and some questionable room service choices."
        },
        {
          "id": "a-basic-6",
          "word": "abscond",
          "definition": "leave hurriedly and secretly, typically to avoid detection of or arrest for an unlawful action",
          "fillInBlank": "Seeking sun over spreadsheets, the overworked employee simply _______, leaving behind nothing but a lingering whiff of rebellion."
        },
        {
          "id": "a-basic-7",
          "word": "abstruse",
          "definition": "difficult to understand; obscure",
          "fillInBlank": "He stared at her blankly as if the words were ______."
        },
        {
          "id": "a-basic-8",
          "word": "accede",
          "definition": "assent or agree to a demand, request, or treaty",
          "fillInBlank": "Later, in the ditch, he ______ they did have the right of way"
        }
      ]
    },
    {
      "id": "intermediate",
      "name": "Intermediate",
      "words": [
        {
          "id": "a-intermediate-1",
          "word": "accost",
          "definition": "approach and address (someone) boldly or aggressively",
          "fillInBlank": "The charity worker tried to _____  passersby on the street for donations, but after the third failed attempt, had to revise her strategy to involve less eye contact and a faster walking pace."
        },
        {
          "id": "a-intermediate-2",
          "word": "accretion",
          "definition": "the growth or increase of something by the gradual accumulation of additional layers or matter",
          "fillInBlank": "The coral reef grows slowly due to the ______ of tiny marine organisms, a process that makes for a surprisingly soothing nature documentary but somewhat less exciting live-action adventure."
        },
        {
          "id": "a-intermediate-3",
          "word": "acumen",
          "definition": "the ability to make good judgments and quick decisions",
          "fillInBlank": "The seasoned detective possessed remarkable _____ , solving complex cases with an unnerving speed that involved crumpled newspapers, an old magnifying glass, and a collection of half-eaten donuts."
        },
        {
          "id": "a-intermediate-4",
          "word": "adamant",
          "definition": "refusing to be persuaded or to change one's mind",
          "fillInBlank": "The toddler stood with ______ resolve, arms crossed, refusing to eat broccoli even when it was disguised as a tiny tree, a landing pad for superheroes, or a dinosaur snack."
        },
        {
          "id": "a-intermediate-5",
          "word": "admonish",
          "definition": "warn or reprimand someone firmly",
          "fillInBlank": "After repeatedly misplacing her keys, the teacher had to ______ herself, developing an elaborate system of brightly colored keychains, jangling bracelets, and increasingly frantic morning searches."
        },
        {
          "id": "a-intermediate-6",
          "word": "adumbrate",
          "definition": "represent in outline or in a suggestive way",
          "fillInBlank": "The artist's sketch seemed to ______  the deeper emotions of the subject, hinting at a hidden sorrow with a few skillfully drawn lines and a strategically placed shadow."
        },
        {
          "id": "a-intermediate-7",
          "word": "adverse",
          "definition": "preventing success or development; harmful; unfavorable",
          "fillInBlank": "The storm created ______ sailing conditions for the small boat, which bravely endured waves the size of small mountains and a distinct feeling among the crew that they should have just stayed home."
        },
        {
          "id": "a-intermediate-8",
          "word": "advocate",
          "definition": "a person who publicly supports or recommends a particular cause or policy",
          "fillInBlank": "She became a passionate _____ for animal rights, fiercely determined to make a difference, one rescued hedgehog and indignantly protesting squirrel at a time."
        }
      ]
    },
    {
      "id": "advanced",
      "name": "Advanced",
      "words": [
        {
          "id": "a-advanced-1",
          "word": "affluent",
          "definition": "...",
          "fillInBlank": "..."
        }
        // ... more words
      ]
    },
    {
      "id": "professional",
      "name": "Professional",
      "words": []
    },
    {
      "id": "expert",
      "name": "Expert",
      "words": []
    }
  ]
}
```

---

## Migration Script Specification

### Script: `parseXmlToJson.ts`

**Location:** `/src/scripts/parseXmlToJson.ts`

**Purpose:** Parse Android XML arrays and generate JSON files

**Algorithm:**

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

interface XMLArray {
  name: string;
  items: string[];
}

async function parseXmlToJson() {
  // 1. Read array.xml file
  const xmlPath = path.join(__dirname, '../../app/src/main/res/values/array.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

  // 2. Parse XML to JavaScript object
  const parsed = await parseStringPromise(xmlContent);
  const stringArrays = parsed.resources['string-array'];

  // 3. Build lookup map: name → items[]
  const arrayMap = new Map<string, string[]>();
  for (const array of stringArrays) {
    const name = array.$.name;
    const items = array.item || [];
    arrayMap.set(name, items);
  }

  // 4. Define structure
  const lists = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const levels = [
    { id: 'basic', name: 'Basic' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
    { id: 'professional', name: 'Professional' },
    { id: 'expert', name: 'Expert' }
  ];

  // 5. For each list, generate JSON
  for (const list of lists) {
    const listData = {
      id: `list-${list}`,
      name: `List ${list.toUpperCase()}`,
      description: `Vocabulary List ${list.toUpperCase()}`,
      levels: []
    };

    for (const level of levels) {
      // Build array names
      const wordArrayName = `${list}${level.id}WordList`;
      const defArrayName = `${list}${level.id}DefinitionWordList`;
      const fibArrayName = `${list}${level.id}FillInTheBlank`;

      // Get arrays
      const words = arrayMap.get(wordArrayName) || [];
      const definitions = arrayMap.get(defArrayName) || [];
      const fillInBlanks = arrayMap.get(fibArrayName) || [];

      // Validate lengths match
      if (words.length !== definitions.length || words.length !== fillInBlanks.length) {
        console.warn(`Mismatch in ${list}-${level.id}: words=${words.length}, defs=${definitions.length}, fibs=${fillInBlanks.length}`);
      }

      // Build word objects
      const levelWords = words.map((word, index) => ({
        id: `${list}-${level.id}-${index + 1}`,
        word: word.trim(),
        definition: definitions[index]?.trim() || '',
        fillInBlank: fillInBlanks[index]?.trim() || ''
      }));

      listData.levels.push({
        id: level.id,
        name: level.name,
        words: levelWords
      });
    }

    // 6. Write JSON file
    const outputPath = path.join(__dirname, `../../assets/vocabulary/list-${list}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(listData, null, 2), 'utf-8');
    console.log(`✅ Generated ${outputPath}`);
  }

  console.log('\n🎉 Migration complete!');
}

parseXmlToJson().catch(console.error);
```

### Running the Script:

```bash
# Install dependencies
npm install xml2js @types/xml2js

# Run migration
npx ts-node src/scripts/parseXmlToJson.ts

# Output:
# ✅ Generated assets/vocabulary/list-a.json
# ✅ Generated assets/vocabulary/list-b.json
# ...
# 🎉 Migration complete!
```

---

## Validation Script

### Script: `validateVocabulary.ts`

**Purpose:** Validate generated JSON files for correctness

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

// Zod schema for validation
const VocabularyWordSchema = z.object({
  id: z.string().min(1),
  word: z.string().min(1),
  definition: z.string().min(1),
  fillInBlank: z.string().min(1),
  examples: z.array(z.string()).optional(),
  synonyms: z.array(z.string()).optional(),
  difficulty: z.number().min(1).max(10).optional()
});

const VocabularyLevelSchema = z.object({
  id: z.string(),
  name: z.string(),
  words: z.array(VocabularyWordSchema)
});

const VocabularyListSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  levels: z.array(VocabularyLevelSchema)
});

function validateVocabularyFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Validate against schema
    VocabularyListSchema.parse(data);

    // Additional validation
    let totalWords = 0;
    for (const level of data.levels) {
      totalWords += level.words.length;

      // Check for duplicates
      const wordSet = new Set(level.words.map(w => w.word.toLowerCase()));
      if (wordSet.size !== level.words.length) {
        console.error(`❌ Duplicate words found in ${data.id} - ${level.name}`);
        return false;
      }

      // Check blank placeholders
      for (const word of level.words) {
        if (!word.fillInBlank.includes('___')) {
          console.warn(`⚠️  No blank found in fill-in-blank for "${word.word}"`);
        }
      }
    }

    console.log(`✅ ${data.name}: ${totalWords} words validated`);
    return true;
  } catch (error) {
    console.error(`❌ Validation failed for ${filePath}:`, error.message);
    return false;
  }
}

function validateAll() {
  const vocabDir = path.join(__dirname, '../../assets/vocabulary');
  const files = fs.readdirSync(vocabDir).filter(f => f.endsWith('.json'));

  let allValid = true;
  for (const file of files) {
    const filePath = path.join(vocabDir, file);
    if (!validateVocabularyFile(filePath)) {
      allValid = false;
    }
  }

  if (allValid) {
    console.log('\n🎉 All vocabulary files are valid!');
  } else {
    console.error('\n❌ Some vocabulary files have errors');
    process.exit(1);
  }
}

validateAll();
```

### Running Validation:

```bash
npm run validate-vocabulary

# Output:
# ✅ List A: 40 words validated
# ✅ List B: 40 words validated
# ...
# 🎉 All vocabulary files are valid!
```

---

## Data Integrity Checklist

Before migration is complete, verify:

### ✅ Data Completeness
- [ ] All 8 lists (A-H) have JSON files
- [ ] Each list has 5 levels (Basic, Intermediate, Advanced, Professional, Expert)
- [ ] Word counts match original:
  - Lists A & B: 8 words × 5 levels = 40 words each
  - Lists C-H: 10 words × 5 levels = 50 words each
- [ ] Total word count: ~340 words

### ✅ Data Accuracy
- [ ] Each word has corresponding definition
- [ ] Each word has corresponding fill-in-blank sentence
- [ ] Fill-in-blank sentences contain blank placeholder (`___`)
- [ ] No duplicate words within a level
- [ ] Special characters properly escaped (quotes, apostrophes)

### ✅ Schema Validation
- [ ] All JSON files parse correctly (valid JSON syntax)
- [ ] All files pass Zod schema validation
- [ ] All required fields present (id, word, definition, fillInBlank)
- [ ] ID format consistent: `{list}-{level}-{index}`

### ✅ Manual Spot Check
- [ ] Compare 10 random words between XML and JSON
- [ ] Verify HTML entities decoded (e.g., `\'` → `'`)
- [ ] Check long sentences are intact (no truncation)
- [ ] Verify Unicode characters preserved

---

## Migration Process

### Step-by-Step:

1. **Prepare Environment**
   ```bash
   mkdir -p assets/vocabulary
   npm install xml2js @types/xml2js zod
   ```

2. **Create Migration Script**
   - Copy `parseXmlToJson.ts` to `src/scripts/`
   - Review and adjust paths if needed

3. **Run Migration**
   ```bash
   npx ts-node src/scripts/parseXmlToJson.ts
   ```

4. **Validate Output**
   ```bash
   npx ts-node src/scripts/validateVocabulary.ts
   ```

5. **Manual Review**
   - Open 2-3 generated JSON files
   - Verify structure looks correct
   - Spot check word data

6. **Compare with Original**
   - Load Android app
   - Load a specific list (e.g., List A, Basic)
   - Verify words match JSON file

7. **Commit to Git**
   ```bash
   git add assets/vocabulary/*.json
   git commit -m "feat: migrate vocabulary data from XML to JSON"
   ```

---

## Handling Special Cases

### HTML Entities

XML may contain escaped characters that need decoding:

```
XML:  <item>It wasn\'t an aberration</item>
JSON: "It wasn't an aberration"
```

Update parser to decode entities:

```typescript
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"');
}

// Apply when building word objects:
word: decodeHtmlEntities(word.trim())
```

### Empty or Missing Arrays

List H appears to have placeholder arrays. Handle gracefully:

```typescript
const words = arrayMap.get(wordArrayName) || [];
if (words.length === 0) {
  console.log(`⚠️  Empty level: ${list}-${level.id}`);
}
```

### Inconsistent Word Counts

If word/definition/fillInBlank arrays have different lengths:

```typescript
const minLength = Math.min(words.length, definitions.length, fillInBlanks.length);
console.warn(`Using first ${minLength} items due to length mismatch`);

const levelWords = words.slice(0, minLength).map((word, index) => ({
  // ...
}));
```

---

## Future Enhancements

### Adding New Lists

**Easy Process:**

1. Create new JSON file: `assets/vocabulary/list-i.json`
2. Follow the schema structure
3. Validate with script: `npm run validate-vocabulary`
4. Restart app (or OTA update in production)

**Template:**

```json
{
  "id": "list-i",
  "name": "List I",
  "description": "Description here",
  "levels": [
    {
      "id": "basic",
      "name": "Basic",
      "words": [
        {
          "id": "i-basic-1",
          "word": "example",
          "definition": "a thing characteristic of its kind...",
          "fillInBlank": "She provided an _____ of the concept."
        }
      ]
    }
    // ... more levels
  ]
}
```

### Adding Optional Fields

Extend words with synonyms, examples, etc.:

```json
{
  "id": "a-basic-1",
  "word": "abject",
  "definition": "(of something bad) experienced or present to the maximum degree",
  "fillInBlank": "Timmy was _____ after falling...",
  "synonyms": ["miserable", "wretched", "hopeless"],
  "examples": [
    "They live in abject poverty.",
    "An abject apology"
  ],
  "difficulty": 7,
  "pronunciation": "https://example.com/audio/abject.mp3"
}
```

### Versioning

Include version number for future migrations:

```json
{
  "version": "2.0.0",
  "id": "list-a",
  "name": "List A",
  // ...
}
```

---

## NPM Scripts (package.json)

Add these to your `package.json`:

```json
{
  "scripts": {
    "migrate-vocabulary": "ts-node src/scripts/parseXmlToJson.ts",
    "validate-vocabulary": "ts-node src/scripts/validateVocabulary.ts",
    "vocabulary": "npm run migrate-vocabulary && npm run validate-vocabulary"
  }
}
```

**Usage:**

```bash
# Run full migration + validation
npm run vocabulary

# Just migrate
npm run migrate-vocabulary

# Just validate
npm run validate-vocabulary
```

---

## Summary

**Migration Steps:**
1. ✅ Create migration script (`parseXmlToJson.ts`)
2. ✅ Run migration to generate JSON files
3. ✅ Validate with schema validation script
4. ✅ Manual spot check
5. ✅ Commit to version control

**Benefits of JSON Format:**
- ✅ Human-readable and editable
- ✅ Version control friendly (diff-able)
- ✅ Easy to extend with new fields
- ✅ Type-safe with TypeScript interfaces
- ✅ Plug-and-play: just add new JSON files
- ✅ No rebuild needed for content updates (in future with OTA)

**Next Steps:**
- Proceed to Phase 1 of migration plan
- Set up Expo project
- Run migration script
- Integrate vocabulary loader in React Native app

---

*Ready to migrate the data!* 🚀
