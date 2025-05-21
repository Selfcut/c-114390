
import { supabase } from "@/integrations/supabase/client";

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
