
import { supabase } from "@/integrations/supabase/client";
import { incrementCounter, decrementCounter } from "@/lib/utils/supabase-utils";

export const useCounterOperations = () => {
  /**
   * Increments a counter in a table column
   * @param tableId - The ID of the row to update
   * @param columnName - The column name to increment
   * @param tableName - The table name (default: 'quotes')
   */
  const increment = async (tableId: string, columnName: string, tableName = 'quotes') => {
    try {
      await incrementCounter(tableId, columnName);
      return true;
    } catch (error) {
      console.error(`Error incrementing ${columnName}:`, error);
      return false;
    }
  };

  /**
   * Decrements a counter in a table column
   * @param tableId - The ID of the row to update
   * @param columnName - The column name to decrement
   * @param tableName - The table name (default: 'quotes')
   */
  const decrement = async (tableId: string, columnName: string, tableName = 'quotes') => {
    try {
      await decrementCounter(tableId, columnName);
      return true;
    } catch (error) {
      console.error(`Error decrementing ${columnName}:`, error);
      return false;
    }
  };

  return {
    increment,
    decrement
  };
};
