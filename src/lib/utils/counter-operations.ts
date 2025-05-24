
import { supabase } from '@/integrations/supabase/client';

/**
 * Increment a counter field in a table
 */
export const incrementCounter = async (
  rowId: string,
  columnName: string,
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('increment_counter_fn', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    throw error;
  }
};

/**
 * Decrement a counter field in a table
 */
export const decrementCounter = async (
  rowId: string,
  columnName: string,
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('decrement_counter_fn', {
      row_id: rowId,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error('Error decrementing counter:', error);
    throw error;
  }
};

/**
 * Batch increment multiple counters
 */
export const batchIncrementCounters = async (
  rowIds: string[],
  columnName: string,
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('batch_increment_counter_fn', {
      row_ids: rowIds,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error('Error batch incrementing counters:', error);
    throw error;
  }
};

/**
 * Batch decrement multiple counters
 */
export const batchDecrementCounters = async (
  rowIds: string[],
  columnName: string,
  tableName: string
): Promise<void> => {
  try {
    await supabase.rpc('batch_decrement_counter_fn', {
      row_ids: rowIds,
      column_name: columnName,
      table_name: tableName
    });
  } catch (error) {
    console.error('Error batch decrementing counters:', error);
    throw error;
  }
};
