
import { supabase } from '@/integrations/supabase/client';

/**
 * Increment a counter for a specific row in a table
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
    console.error(`Error incrementing ${columnName} in ${tableName}:`, error);
  }
};

/**
 * Decrement a counter for a specific row in a table
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
    console.error(`Error decrementing ${columnName} in ${tableName}:`, error);
  }
};
