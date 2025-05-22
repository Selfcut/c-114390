
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize any necessary Supabase-related utilities
 */
export async function initializeSupabaseUtils(): Promise<void> {
  console.info('Initializing Supabase utilities...');
  // Check current authentication status
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    console.info('User session exists, user ID:', data.session.user.id);
  } else {
    console.info('No active user session');
  }
  
  // Any other initialization can go here
  
  return Promise.resolve();
}

/**
 * Executes a Supabase query and handles errors
 * 
 * @param queryFn - Function that performs the Supabase query
 * @returns The query result or null if there was an error
 */
export async function executeQuery<T>(queryFn: () => Promise<{ data: T | null; error: any }>): Promise<T | null> {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error('Database query error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Unexpected error during query execution:', err);
    return null;
  }
}

/**
 * Run multiple Supabase operations in parallel
 * 
 * @param operations - Array of functions that return promises
 * @returns Results of all operations
 */
export async function batchOperations<T extends any[]>(operations: Array<() => Promise<T[number]>>): Promise<T> {
  try {
    return await Promise.all(operations.map(op => op().catch(err => {
      console.error('Operation error:', err);
      return null as any;
    }))) as T;
  } catch (err) {
    console.error('Batch operations error:', err);
    return Array(operations.length).fill(null) as unknown as T;
  }
}

/**
 * Increment a counter in a specified table
 * 
 * @param rowId - ID of the row to update 
 * @param columnName - Name of the column to increment
 * @param tableName - Name of the table
 */
export async function incrementCounter(
  rowId: string, 
  columnName: string, 
  tableName: string
): Promise<void> {
  try {
    // Use the RPC function rather than direct update for better performance
    await supabase.rpc('increment_counter', { 
      row_id: rowId, 
      column_name: columnName, 
      table_name: tableName 
    });
  } catch (err) {
    console.error(`Failed to increment ${columnName} in ${tableName}:`, err);
  }
}

/**
 * Decrement a counter in a specified table
 * 
 * @param rowId - ID of the row to update
 * @param columnName - Name of the column to decrement
 * @param tableName - Name of the table
 */
export async function decrementCounter(
  rowId: string, 
  columnName: string, 
  tableName: string
): Promise<void> {
  try {
    // Use the RPC function rather than direct update for better performance
    await supabase.rpc('decrement_counter', { 
      row_id: rowId, 
      column_name: columnName, 
      table_name: tableName 
    });
  } catch (err) {
    console.error(`Failed to decrement ${columnName} in ${tableName}:`, err);
  }
}

/**
 * Type-safe function to query a table by ID
 * 
 * @param tableName - Name of the table to query
 * @param id - ID to search for
 * @returns The found row or null
 */
export async function getRecordById<T>(tableName: string, id: string): Promise<T | null> {
  const { data, error } = await supabase
    .from(tableName as any)
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching ${tableName} with ID ${id}:`, error);
    return null;
  }
    
  return data as T;
}

/**
 * Helper to safely insert a record with error handling
 * 
 * @param tableName - Name of the table
 * @param data - Data to insert
 * @returns The inserted record or null
 */
export async function insertRecord<T, U>(tableName: string, data: U): Promise<T | null> {
  const { data: inserted, error } = await supabase
    .from(tableName as any)
    .insert(data)
    .select()
    .single();
    
  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    return null;
  }
  
  return inserted as T;
}
