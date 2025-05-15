
import { supabase } from "@/integrations/supabase/client";

// Helper functions for counter operations
export const incrementCounter = async (tableId: string, columnName: string) => {
  try {
    await (supabase.rpc as any)('increment_counter', {
      row_id: tableId,
      column_name: columnName
    });
    return true;
  } catch (error) {
    console.error(`Error incrementing ${columnName}:`, error);
    return false;
  }
};

export const decrementCounter = async (tableId: string, columnName: string) => {
  try {
    await (supabase.rpc as any)('decrement_counter', {
      row_id: tableId,
      column_name: columnName
    });
    return true;
  } catch (error) {
    console.error(`Error decrementing ${columnName}:`, error);
    return false;
  }
};

// Helper function to create a user activity
export const createUserActivity = async (
  userId: string, 
  eventType: string, 
  metadata: Record<string, any> = {}
) => {
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata
      });

    if (error) {
      console.error('Error creating user activity:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in createUserActivity:', error);
    return false;
  }
};

// Helper function to create RPC functions in Supabase if they don't exist
export const ensureRpcFunctionsExist = async () => {
  try {
    // We can't check if functions exist using RPC calls directly
    // Instead, we'll try to use them and handle errors gracefully
    
    // First try to use the increment_counter function
    try {
      // TypeScript doesn't understand custom RPC functions by default
      // We need to cast to any to bypass type checking for custom RPCs
      await (supabase.rpc as any)('increment_counter', {
        row_id: '00000000-0000-0000-0000-000000000000',
        column_name: 'likes'
      });
      console.info("increment_counter function exists");
    } catch (error) {
      console.info("Creating increment_counter function...");
      
      // We can't create functions directly through the JavaScript API
      // This would typically be done through migrations
      console.warn("Could not find increment_counter function. Make sure it's created in your database migrations.");
    }
    
    // Check if the decrement_counter function exists
    try {
      // TypeScript doesn't understand custom RPC functions by default
      // We need to cast to any to bypass type checking for custom RPCs
      await (supabase.rpc as any)('decrement_counter', {
        row_id: '00000000-0000-0000-0000-000000000000',
        column_name: 'likes'
      });
      console.info("decrement_counter function exists");
    } catch (error) {
      console.info("Creating decrement_counter function...");
      
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

// Helper function to get user activity stats
export const getUserActivityStats = async (userId: string) => {
  try {
    // Get user activities
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user activities:", error);
      return null;
    }
    
    if (!activities || activities.length === 0) {
      return {
        streak: 0,
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        badges: 0
      };
    }
    
    // Calculate streak
    const dates = activities.map(a => new Date(a.created_at).toDateString());
    const uniqueDates = [...new Set(dates)].sort();
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (uniqueDates.includes(today)) {
      streak = 1;
      let checkDate = yesterday;
      let dateString = checkDate.toDateString();
      
      while (uniqueDates.includes(dateString)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        dateString = checkDate.toDateString();
      }
    } else if (uniqueDates.includes(yesterdayString)) {
      streak = 1;
      let checkDate = new Date(yesterday);
      checkDate.setDate(checkDate.getDate() - 1);
      let dateString = checkDate.toDateString();
      
      while (uniqueDates.includes(dateString)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        dateString = checkDate.toDateString();
      }
    }
    
    // Calculate XP - 10 points per activity
    const xp = activities.length * 10;
    const level = Math.max(1, Math.floor(xp / 100) + 1);
    const nextLevelXp = level * 100;
    
    // Count "achievements" as activities with type 'achievement'
    const badgeCount = activities.filter(a => a.event_type === 'achievement').length;
    
    return {
      streak,
      level,
      xp,
      nextLevelXp,
      badges: badgeCount
    };
  } catch (error) {
    console.error("Error in getUserActivityStats:", error);
    return null;
  }
};
