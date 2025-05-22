
/**
 * Executes a Supabase query and handles potential errors
 * 
 * @param queryFn - Function that returns a Supabase query
 * @returns A promise that resolves to the result of the query or null on error
 */
export async function executeQuery<T>(queryFn: () => Promise<{ data: T | null; error: any }>): Promise<T | null> {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error('Supabase query error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Error executing query:', err);
    return null;
  }
}

/**
 * Executes multiple operations in parallel and returns their results
 * 
 * @param operations - Array of functions that return promises
 * @returns A promise that resolves to an array of results
 */
export async function batchOperations<T extends any[]>(
  operations: Array<() => Promise<any>>
): Promise<T> {
  try {
    return await Promise.all(operations.map(op => op().catch(err => {
      console.error('Batch operation error:', err);
      return null;
    }))) as T;
  } catch (err) {
    console.error('Error in batch operations:', err);
    return [] as unknown as T;
  }
}

/**
 * Increment a counter for a specific record in a table
 * 
 * @param rowId - The ID of the record to update
 * @param columnName - The column to increment
 * @param tableName - The table containing the record
 * @returns A promise that resolves when the operation is complete
 */
export async function incrementCounter(
  rowId: string,
  columnName: string,
  tableName: string
): Promise<void> {
  try {
    await supabase.rpc('increment_counter_fn', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (err) {
    console.error(`Error incrementing ${columnName} for ${tableName}:`, err);
  }
}

/**
 * Decrement a counter for a specific record in a table
 * 
 * @param rowId - The ID of the record to update
 * @param columnName - The column to decrement
 * @param tableName - The table containing the record
 * @returns A promise that resolves when the operation is complete
 */
export async function decrementCounter(
  rowId: string,
  columnName: string,
  tableName: string
): Promise<void> {
  try {
    await supabase.rpc('decrement_counter_fn', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (err) {
    console.error(`Error decrementing ${columnName} for ${tableName}:`, err);
  }
}

// Import statement was missing in the original code snippet
import { supabase } from '@/integrations/supabase/client';
