/**
 * Progress Export/Import Utilities
 *
 * Allows users to export their progress data for backup and import on new devices.
 */

import { Platform, Share } from 'react-native';
import { useProgressStore } from '@/shared/store/progressStore';

const EXPORT_VERSION = '1.0.0';

interface ExportData {
  version: string;
  exportedAt: string;
  progress: ReturnType<typeof useProgressStore.getState>;
}

/**
 * Export progress data as JSON
 * On web: Downloads as file
 * On mobile: Uses Share API
 */
export async function exportProgress(): Promise<{ success: boolean; error?: string }> {
  try {
    const progressData = useProgressStore.getState();

    const exportData: ExportData = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      progress: progressData,
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    if (Platform.OS === 'web') {
      // Web: Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vocabulary-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } else {
      // Mobile: Use Share API
      await Share.share({
        message: jsonString,
        title: 'Vocabulary Progress Export',
      });

      return { success: true };
    }
  } catch (error) {
    console.error('Export failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Import progress data from JSON string
 * Validates version compatibility and data structure
 */
export async function importProgress(
  jsonString: string,
  mergeStrategy: 'replace' | 'merge' = 'replace'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Parse JSON
    const importData: ExportData = JSON.parse(jsonString);

    // Validate version
    if (!importData.version || importData.version !== EXPORT_VERSION) {
      return {
        success: false,
        error: `Incompatible version. Expected ${EXPORT_VERSION}, got ${importData.version || 'unknown'}`,
      };
    }

    // Validate data structure
    if (!importData.progress || !importData.progress.listLevelProgress) {
      return {
        success: false,
        error: 'Invalid data structure',
      };
    }

    // Apply import based on strategy
    if (mergeStrategy === 'replace') {
      // Replace all progress
      useProgressStore.setState({
        listLevelProgress: importData.progress.listLevelProgress,
        globalStats: importData.progress.globalStats,
        currentListId: importData.progress.currentListId,
        currentLevelId: importData.progress.currentLevelId,
        lastSyncedAt: new Date().toISOString(),
      });
    } else {
      // Merge strategy (keep better progress for each word)
      const currentProgress = useProgressStore.getState();
      const mergedProgress = { ...currentProgress.listLevelProgress };

      // Merge list-level progress
      Object.entries(importData.progress.listLevelProgress).forEach(([key, imported]) => {
        const existing = mergedProgress[key];

        if (!existing) {
          // New level, add it
          mergedProgress[key] = imported;
        } else {
          // Merge word progress, keeping higher state
          const mergedWordProgress = { ...existing.wordProgress };

          Object.entries(imported.wordProgress).forEach(([wordId, importedWord]) => {
            const existingWord = mergedWordProgress[wordId];

            if (!existingWord || importedWord.state > existingWord.state) {
              mergedWordProgress[wordId] = importedWord;
            }
          });

          mergedProgress[key] = {
            ...existing,
            wordProgress: mergedWordProgress,
          };
        }
      });

      // Merge global stats (sum them up)
      useProgressStore.setState({
        listLevelProgress: mergedProgress,
        globalStats: {
          allTimeHints:
            currentProgress.globalStats.allTimeHints + importData.progress.globalStats.allTimeHints,
          allTimeWrong:
            currentProgress.globalStats.allTimeWrong + importData.progress.globalStats.allTimeWrong,
          allTimeCorrect:
            currentProgress.globalStats.allTimeCorrect +
            importData.progress.globalStats.allTimeCorrect,
          totalWordsLearned: 0, // Will be recalculated
          listsCompleted: Array.from(
            new Set([
              ...currentProgress.globalStats.listsCompleted,
              ...importData.progress.globalStats.listsCompleted,
            ])
          ),
        },
        lastSyncedAt: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Import failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON format',
    };
  }
}

/**
 * Get import preview information
 * Shows user what will be imported before confirmation
 */
export function getImportPreview(jsonString: string): {
  valid: boolean;
  preview?: {
    version: string;
    exportedAt: string;
    wordsLearned: number;
    listsCompleted: number;
  };
  error?: string;
} {
  try {
    const importData: ExportData = JSON.parse(jsonString);

    if (!importData.version) {
      return { valid: false, error: 'Invalid format: missing version' };
    }

    // Count words learned
    let wordsLearned = 0;
    Object.values(importData.progress.listLevelProgress).forEach((progress) => {
      wordsLearned += Object.values(progress.wordProgress).filter((w) => w.state === 3).length;
    });

    return {
      valid: true,
      preview: {
        version: importData.version,
        exportedAt: importData.exportedAt,
        wordsLearned,
        listsCompleted: importData.progress.globalStats.listsCompleted.length,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid JSON format',
    };
  }
}
