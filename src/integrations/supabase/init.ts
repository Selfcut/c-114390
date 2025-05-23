
import { supabase } from "./client";

export const initializeSupabase = async () => {
  try {
    // Set up realtime subscriptions for tables using the native channel API
    
    const userActivitiesChannel = supabase.channel('public:user_activities')
      .on('postgres_changes', { 
        event: '*',
        schema: 'public',
        table: 'user_activities'
      }, payload => {
        console.log('User activities change received:', payload);
      })
      .subscribe();
      
    const quoteCommentsChannel = supabase.channel('public:quote_comments')
      .on('postgres_changes', { 
        event: '*',
        schema: 'public',
        table: 'quote_comments'
      }, payload => {
        console.log('Quote comments change received:', payload);
      })
      .subscribe();
    
    // Initialize complete
    console.log("Supabase initialization complete");
  } catch (error) {
    console.error("Error initializing Supabase:", error);
  }
};
