
import { supabase } from "@/integrations/supabase/client";

// Define ActivityType for use in other files
export type ActivityType = 'view' | 'create' | 'update' | 'delete' | 'interaction' | 'learned' | 'completed';

/**
 * Track user activity in the application
 * @param userId The ID of the user performing the activity
 * @param eventType The type of event (e.g., 'view', 'create', 'update', 'delete')
 * @param metadata Additional data about the activity
 */
export const trackActivity = async (
  userId: string,
  eventType: string,
  metadata: Record<string, any> = {}
): Promise<boolean> => {
  try {
    if (!userId) {
      console.warn('Cannot track activity without a user ID');
      return false;
    }

    const { error } = await supabase.from('user_activities').insert({
      user_id: userId,
      event_type: eventType,
      metadata
    });

    if (error) {
      console.error('Error tracking activity:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception tracking activity:', err);
    return false;
  }
};

/**
 * Fetch recent activities for a user
 * @param userId The ID of the user to fetch activities for
 * @param limit The maximum number of activities to fetch
 */
export const fetchUserActivities = async (userId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching user activities:', err);
    return [];
  }
};

/**
 * Calculate the user's activity streak (days in a row with activity)
 * @param userId The ID of the user to calculate the streak for
 */
export const calculateActivityStreak = async (userId: string): Promise<number> => {
  try {
    if (!userId) {
      return 0;
    }
    
    const { data, error } = await supabase
      .from('user_activities')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error || !data || data.length === 0) {
      return 0;
    }
    
    // Convert to Date objects and get just the date part (no time)
    const dates = data.map(activity => {
      const date = new Date(activity.created_at);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    });
    
    // Remove duplicates (multiple activities on same day)
    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a);
    
    if (uniqueDates.length === 0) {
      return 0;
    }
    
    // Get today's date without time
    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(), 
      today.getMonth(), 
      today.getDate()
    ).getTime();
    
    // If no activity today, check if there was activity yesterday
    let currentDate = todayWithoutTime;
    let streakCount = 0;
    
    // Loop through dates to find consecutive days
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      
      // If this date is the expected consecutive date
      if (date === currentDate || date === currentDate - 86400000) {
        if (date === currentDate - 86400000) {
          currentDate = date;
        }
        streakCount++;
      } else if (date < currentDate - 86400000) {
        // Break streak if more than one day gap
        break;
      }
    }
    
    return streakCount;
  } catch (err) {
    console.error('Exception calculating activity streak:', err);
    return 0;
  }
};
