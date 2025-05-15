
import { supabase } from "./client";
import { initializeSupabaseUtils } from "@/lib/utils/supabase-utils";

export const initializeSupabase = async () => {
  try {
    // Enable PostgreSQL changes for realtime subscriptions
    const { error: realtimeError } = await supabase.rpc('enable_realtime', {
      table_name: 'user_activities'
    });
    
    if (realtimeError) {
      console.error("Error enabling realtime for user_activities:", realtimeError);
    }
    
    // Enable realtime for quote comments
    const { error: commentsRealtimeError } = await supabase.rpc('enable_realtime', {
      table_name: 'quote_comments'
    });
    
    if (commentsRealtimeError) {
      console.error("Error enabling realtime for quote_comments:", commentsRealtimeError);
    }
    
    // Initialize any required RPC functions or utilities
    initializeSupabaseUtils();
    
    console.log("Supabase initialization complete");
  } catch (error) {
    console.error("Error initializing Supabase:", error);
  }
};
