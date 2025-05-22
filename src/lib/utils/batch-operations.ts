
// Simplify return type to avoid excessive type instantiation
export type BatchOperation = () => Promise<unknown>;

/**
 * Execute multiple operations in parallel with optimized error handling
 * @param operations Array of functions that return promises
 * @returns Promise with array of results
 */
export const batchOperations = async (operations: BatchOperation[]): Promise<unknown[]> => {
  return Promise.all(operations.map(operation => operation()));
};

/**
 * Initialize necessary Supabase utilities
 * @returns Promise<boolean> indicating success
 */
export const initializeSupabaseUtils = async (): Promise<boolean> => {
  try {
    console.log('[Supabase Utils] Initialized');
    return true;
  } catch (error) {
    console.error('[Supabase Utils] Initialization error:', error);
    return false;
  }
};
