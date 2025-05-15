
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export type ActivityType = 
  | 'view'
  | 'read'
  | 'comment'
  | 'like'
  | 'bookmark'
  | 'achievement'
  | 'learned'
  | 'completed'
  | 'quote_created'
  | 'quote_liked'
  | 'forum_post'
  | 'forum_reply'
  | 'wiki_edit'
  | 'library_add';

/**
 * Tracks user activity in the application
 * @param eventType The type of activity
 * @param metadata Additional information about the activity
 */
export const trackActivity = async (
  userId: string,
  eventType: ActivityType, 
  metadata: Record<string, any> = {}
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata
      });

    if (error) {
      console.error('Error tracking activity:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in trackActivity:', error);
    return false;
  }
};

/**
 * React hook for tracking user activity
 */
export const useActivityTracker = () => {
  const { user } = useAuth();
  
  const trackUserActivity = async (
    eventType: ActivityType, 
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user) return false;
    return trackActivity(user.id, eventType, metadata);
  };

  return { trackUserActivity };
};
