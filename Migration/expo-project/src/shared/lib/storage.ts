/**
 * AsyncStorage Wrapper Utility
 *
 * Type-safe wrapper around AsyncStorage for consistent data persistence
 * throughout the app. Provides error handling and logging.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys used throughout the app
 * Centralized to prevent typos and enable refactoring
 */
export const STORAGE_KEYS = {
  USER_PROGRESS: 'vocabulary-progress',
  SETTINGS: 'vocabulary-settings',
  VERSION: 'vocabulary-version',
  LAST_SYNC: 'vocabulary-last-sync',
} as const;

/**
 * Get item from storage with type safety
 * @param key Storage key
 * @returns Parsed value or null if not found
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error reading from storage (key: ${key}):`, error);
    return null;
  }
}

/**
 * Set item in storage with automatic JSON serialization
 * @param key Storage key
 * @param value Value to store (will be JSON stringified)
 */
export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error writing to storage (key: ${key}):`, error);
    throw error; // Re-throw to allow callers to handle critical failures
  }
}

/**
 * Remove item from storage
 * @param key Storage key to remove
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from storage (key: ${key}):`, error);
  }
}

/**
 * Clear all storage
 * WARNING: This will delete all app data
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}

/**
 * Get all storage keys
 * Useful for debugging and migration
 */
export async function getAllKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
}

/**
 * Get multiple items at once
 * More efficient than multiple getItem calls
 */
export async function getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, T | null> = {};

    for (const [key, value] of pairs) {
      result[key] = value ? (JSON.parse(value) as T) : null;
    }

    return result;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return {};
  }
}

/**
 * Set multiple items at once
 * More efficient than multiple setItem calls
 */
export async function setMultiple(items: Record<string, any>): Promise<void> {
  try {
    const pairs: [string, string][] = Object.entries(items).map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Error setting multiple items:', error);
    throw error;
  }
}

/**
 * Data migration helper
 * Migrates data from old version to new version
 * @param oldVersion Previous version number
 * @param newVersion New version number
 */
export async function migrate(oldVersion: string, newVersion: string): Promise<void> {
  console.log(`Migrating data from version ${oldVersion} to ${newVersion}`);

  try {
    const currentVersion = await getItem<string>(STORAGE_KEYS.VERSION);

    if (!currentVersion || currentVersion === oldVersion) {
      // Migration logic will be added here in future when schema changes
      // For now, just update version
      await setItem(STORAGE_KEYS.VERSION, newVersion);
      console.log('Migration completed successfully');
    } else {
      console.log('No migration needed, version up to date');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Get storage size estimate (for debugging)
 * Returns approximate size in bytes
 */
export async function getStorageSize(): Promise<number> {
  try {
    const keys = await getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length * 2; // UTF-16 encoding (2 bytes per char)
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
}
