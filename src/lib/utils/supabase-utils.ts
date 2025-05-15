
import { supabase } from "@/integrations/supabase/client";

// Helper function to create RPC functions in Supabase if they don't exist
export const ensureRpcFunctionsExist = async () => {
  try {
    // First, check if the increment_counter function exists
    const { data: incrementFunctionExists, error: incrementCheckError } = await supabase
      .rpc('function_exists', { 
        function_name: 'increment_counter'
      });
      
    if (incrementCheckError || !incrementFunctionExists) {
      // Create the increment_counter function
      const { error: createIncrementError } = await supabase.rpc('create_function', {
        function_body: `
          CREATE OR REPLACE FUNCTION increment_counter(row_id uuid, column_name text)
          RETURNS int
          LANGUAGE SQL
          AS $$
            UPDATE quotes 
            SET ${column_name} = COALESCE(${column_name}, 0) + 1 
            WHERE id = row_id
            RETURNING ${column_name};
          $$;
        `
      });
      
      if (createIncrementError) {
        console.error("Error creating increment_counter function:", createIncrementError);
      }
    }
    
    // Check if the decrement_counter function exists
    const { data: decrementFunctionExists, error: decrementCheckError } = await supabase
      .rpc('function_exists', { 
        function_name: 'decrement_counter'
      });
      
    if (decrementCheckError || !decrementFunctionExists) {
      // Create the decrement_counter function
      const { error: createDecrementError } = await supabase.rpc('create_function', {
        function_body: `
          CREATE OR REPLACE FUNCTION decrement_counter(row_id uuid, column_name text)
          RETURNS int
          LANGUAGE SQL
          AS $$
            UPDATE quotes 
            SET ${column_name} = GREATEST(0, COALESCE(${column_name}, 0) - 1)
            WHERE id = row_id
            RETURNING ${column_name};
          $$;
        `
      });
      
      if (createDecrementError) {
        console.error("Error creating decrement_counter function:", createDecrementError);
      }
    }
  } catch (error) {
    console.error("Error ensuring RPC functions exist:", error);
  }
};

// Call this function when the application starts
export const initializeSupabaseUtils = () => {
  ensureRpcFunctionsExist();
};
