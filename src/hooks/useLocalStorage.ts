
import { useState, useEffect } from 'react';

type SetValueFunction<T> = (value: T | ((prevValue: T) => T)) => void;

/**
 * Custom hook for persisting data in localStorage with type safety
 * 
 * @param key - The key to store under in localStorage
 * @param initialValue - Initial value if nothing exists in localStorage
 * @returns A tuple containing the stored value and a function to update it
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValueFunction<T>] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Load from localStorage on initial mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue: SetValueFunction<T> = (value) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state and localStorage
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}

/**
 * Utility to safely get a value from localStorage
 * 
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The value from localStorage or the default value
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Utility to safely set a value in localStorage
 * 
 * @param key - The localStorage key
 * @param value - The value to store
 */
export function setToLocalStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Utility to safely remove a value from localStorage
 * 
 * @param key - The localStorage key to remove
 */
export function removeFromLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}
