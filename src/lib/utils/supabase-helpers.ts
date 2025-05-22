
import { supabase } from '@/integrations/supabase/client';

// Define interface for query result to avoid complex typing issues
export interface QueryResult {
  data: any;
  error: any;
}

/**
 * Helper function to safely execute Supabase queries without complex typing issues
 * @param queryFn Function that returns a Supabase query
 * @returns Promise with query result
 */
export async function executeQuery<T>(queryFn: () => any): Promise<QueryResult> {
  try {
    // Execute the query function
    const result = await queryFn();
    // Return a standardized result format
    return { data: result.data, error: result.error };
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error executing Supabase query:', error);
    return { data: null, error };
  }
}
