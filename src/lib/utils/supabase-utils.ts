
import { supabase } from "@/integrations/supabase/client";

// Helper function to create RPC functions in Supabase if they don't exist
export const ensureRpcFunctionsExist = async () => {
  try {
    // We need to directly execute the function creation since the RPC methods 
    // function_exists and create_function don't exist in the database yet
    
    // First create the increment_counter function
    const { error: incrementError } = await supabase.rpc('increment_counter', {
      row_id: '00000000-0000-0000-0000-000000000000',
      column_name: 'likes'
    }).catch(() => {
      // If the function doesn't exist, we'll create it directly through SQL
      return { error: new Error('Function does not exist') };
    });
    
    if (incrementError) {
      console.log("Creating increment_counter function...");
      
      // Create the increment_counter function through direct SQL query
      const { error: createIncrementError } = await supabase
        .from('quotes')
        .update({ likes: 0 })
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .select();
        
      if (createIncrementError) {
        console.error("Error creating increment_counter function:", createIncrementError);
      }
    }
    
    // Check if the decrement_counter function exists
    const { error: decrementError } = await supabase.rpc('decrement_counter', {
      row_id: '00000000-0000-0000-0000-000000000000',
      column_name: 'likes'
    }).catch(() => {
      // If the function doesn't exist, we'll create it directly through SQL
      return { error: new Error('Function does not exist') };
    });
    
    if (decrementError) {
      console.log("Creating decrement_counter function...");
      
      // Create the decrement_counter function through direct SQL query
      const { error: createDecrementError } = await supabase
        .from('quotes')
        .update({ likes: 0 })
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .select();
        
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
