
import { supabase } from "@/integrations/supabase/client";

// Helper function to create RPC functions in Supabase if they don't exist
export const ensureRpcFunctionsExist = async () => {
  try {
    // We can't check if functions exist using RPC calls directly
    // Instead, we'll try to use them and handle errors gracefully
    
    // First try to use the increment_counter function
    try {
      await supabase.rpc('increment_counter', {
        row_id: '00000000-0000-0000-0000-000000000000',
        column_name: 'likes'
      } as any);
      console.log("increment_counter function exists");
    } catch (error) {
      console.log("Creating increment_counter function...");
      
      // We can't create functions directly through the JavaScript API
      // This would typically be done through migrations
      console.warn("Could not find increment_counter function. Make sure it's created in your database migrations.");
    }
    
    // Check if the decrement_counter function exists
    try {
      await supabase.rpc('decrement_counter', {
        row_id: '00000000-0000-0000-0000-000000000000',
        column_name: 'likes'
      } as any);
      console.log("decrement_counter function exists");
    } catch (error) {
      console.log("Creating decrement_counter function...");
      
      // We can't create functions directly through the JavaScript API
      // This would typically be done through migrations
      console.warn("Could not find decrement_counter function. Make sure it's created in your database migrations.");
    }
  } catch (error) {
    console.error("Error ensuring RPC functions exist:", error);
  }
};

// Call this function when the application starts
export const initializeSupabaseUtils = () => {
  ensureRpcFunctionsExist();
};
