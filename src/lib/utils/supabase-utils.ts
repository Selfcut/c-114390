
import { supabase } from '@/integrations/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

/**
 * Initialize any required Supabase utilities
 */
export const initializeSupabaseUtils = async (): Promise<void> => {
  console.log('Initializing Supabase utilities...');
  // This function is called during app initialization
  // You can add any setup code here if needed in the future
};

/**
 * Type-safe counter operation function to modify a counter in a Supabase table
 * 
 * @param operation - The operation to perform (increment or decrement)
 * @param rowId - The ID of the row to update
 * @param columnName - The name of the counter column
 * @param tableName - The name of the table
 * @returns A promise that resolves when the counter is updated
 */
const performCounterOperation = async (
  operation: 'increment' | 'decrement',
  rowId: string,
  columnName: string,
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc(
      `${operation}_counter`,
      {
        row_id: rowId,
        column_name: columnName,
        table_name: tableName
      }
    );
  } catch (error) {
    console.error(`Error ${operation}ing ${columnName} for ${tableName}:${rowId}`, error);
    throw error;
  }
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
  return performCounterOperation('increment', rowId, columnName, tableName);
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
  return performCounterOperation('decrement', rowId, columnName, tableName);
};

/**
 * Execute multiple Supabase operations in parallel with optimized error handling
 * 
 * @param operations - Array of operation functions to batch
 * @returns A promise that resolves when all operations are completed
 */
export const batchOperations = async <T>(
  operations: (() => Promise<T>)[]
): Promise<T[]> => {
  try {
    return await Promise.all(operations.map(op => op()));
  } catch (error) {
    console.error('Error in batch operations:', error);
    throw error;
  }
};

/**
 * Type-safe wrapper for Supabase query execution with error handling
 * 
 * @param queryFn - Function that returns a Supabase query
 * @returns The query result or null if an error occurred
 */
export const executeQuery = async <T>(
  queryFn: () => Promise<PostgrestSingleResponse<T>>
): Promise<T | null> => {
  try {
    const { data, error } = await queryFn();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
    return null;
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
  userId?: string | null
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Use type assertion for the dynamic table name
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

/**
 * Gets the count of items in a table with optional filtering
 * 
 * @param tableName - The name of the table
 * @param filters - Optional filters in the format { column: value }
 * @returns A promise that resolves to the count
 */
export const getCount = async (
  tableName: string,
  filters?: Record<string, any>
): Promise<number> => {
  try {
    let query = supabase
      .from(tableName as any)
      .select('*', { count: 'exact', head: true });
    
    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([column, value]) => {
        query = query.eq(column, value);
      });
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error(`Error counting ${tableName}:`, error);
    return 0;
  }
};
