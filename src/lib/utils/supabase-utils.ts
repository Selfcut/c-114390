
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize any required Supabase utilities
 */
export const initializeSupabaseUtils = async (): Promise<void> => {
  console.log('Initializing Supabase utilities...');
  // This function is called during app initialization
  // You can add any setup code here if needed in the future
};

/**
 * Optimized function to increment a counter in a Supabase table
 * 
 * @param rowId - The ID of the row to update
 * @param columnName - The name of the counter column
 * @param tableName - The name of the table
 * @returns A promise that resolves when the counter is incremented
 */
export const incrementCounter = async (
  rowId: string, 
  columnName: string, 
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('increment_counter', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error(`Error incrementing ${columnName} for ${tableName}:${rowId}`, error);
    throw error;
  }
};

/**
 * Optimized function to decrement a counter in a Supabase table
 * 
 * @param rowId - The ID of the row to update
 * @param columnName - The name of the counter column
 * @param tableName - The name of the table
 * @returns A promise that resolves when the counter is decremented
 */
export const decrementCounter = async (
  rowId: string, 
  columnName: string, 
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('decrement_counter', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error(`Error decrementing ${columnName} for ${tableName}:${rowId}`, error);
    throw error;
  }
};

/**
 * Optimized batch operations for Supabase
 * 
 * @param operations - Array of operation functions to batch
 * @returns A promise that resolves when all operations are completed
 */
export const batchOperations = async (
  operations: (() => Promise<any>)[]
): Promise<any[]> => {
  try {
    return await Promise.all(operations.map(op => op()));
  } catch (error) {
    console.error('Error in batch operations:', error);
    throw error;
  }
};

/**
 * Optimized function to check if a user has interacted with content
 * 
 * @param tableName - The name of the interaction table (e.g. quote_likes)
 * @param contentColumn - The name of the content ID column (e.g. quote_id)
 * @param contentId - The ID of the content to check
 * @param userId - The ID of the user
 * @returns A promise that resolves to a boolean indicating if the user has interacted with the content
 */
export const checkUserInteraction = async (
  tableName: string,
  contentColumn: string,
  contentId: string,
  userId?: string
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Fix for TypeScript strict type checking - use type assertion for the table name
    // This tells TypeScript we know what we're doing with the dynamic table name
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .eq(contentColumn, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error(`Error checking ${tableName} interaction:`, error);
    return false;
  }
};
