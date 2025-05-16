
/**
 * Utility functions for persisting state across page navigation
 */

// Store a value in localStorage with a specific key
export const persistState = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to persist state for key ${key}:`, error);
  }
};

// Get a value from localStorage with a specific key
export const getPersistedState = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? (JSON.parse(value) as T) : fallback;
  } catch (error) {
    console.error(`Failed to retrieve persisted state for key ${key}:`, error);
    return fallback;
  }
};

// Remove a value from localStorage
export const clearPersistedState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear persisted state for key ${key}:`, error);
  }
};
