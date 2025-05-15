
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
  | 'library_add'
  | 'interaction';

/**
 * Tracks user activity in the application
 * @param userId The user ID
 * @param eventType The type of activity
 * @param metadata Additional information about the activity
 */
export const trackActivity = async (
  userId: string,
  eventType: ActivityType, 
  metadata: Record<string, any> = {}
): Promise<boolean> => {
  if (!userId) {
    console.warn('Cannot track activity: No user ID provided');
    return false;
  }
  
  try {
    // Add timestamp if not provided
    if (!metadata.timestamp) {
      metadata.timestamp = new Date().toISOString();
    }
    
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
  
  const trackView = async (section: string, metadata: Record<string, any> = {}) => {
    return trackUserActivity('view', { section, ...metadata });
  };
  
  const trackInteraction = async (action: string, target: string, metadata: Record<string, any> = {}) => {
    return trackUserActivity('interaction', { action, target, ...metadata });
  };
  
  const trackLearning = async (topic: string, activity: 'learned' | 'completed', metadata: Record<string, any> = {}) => {
    return trackUserActivity(activity, { topic, ...metadata });
  };

  const trackForumActivity = async (action: 'post' | 'reply' | 'like', metadata: Record<string, any> = {}) => {
    const eventType = action === 'post' ? 'forum_post' : action === 'reply' ? 'forum_reply' : 'like';
    return trackUserActivity(eventType as ActivityType, metadata);
  };
  
  const trackLibraryActivity = async (action: string, resourceId: string, metadata: Record<string, any> = {}) => {
    return trackUserActivity('library_add', { action, resourceId, ...metadata });
  };
  
  const trackWikiEdit = async (pageId: string, metadata: Record<string, any> = {}) => {
    return trackUserActivity('wiki_edit', { pageId, ...metadata });
  };

  return { 
    trackUserActivity,
    trackView,
    trackInteraction,
    trackLearning,
    trackForumActivity,
    trackLibraryActivity,
    trackWikiEdit
  };
};

/**
 * Fetches all activities for a user
 */
export const fetchUserActivities = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user activities:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchUserActivities:", error);
    return [];
  }
};

/**
 * Creates a new activity entry in bulk for performance optimization
 */
export const trackActivityBatch = async (
  activities: Array<{
    userId: string;
    eventType: ActivityType;
    metadata?: Record<string, any>;
  }>
): Promise<boolean> => {
  if (!activities.length) return true;
  
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert(
        activities.map(activity => ({
          user_id: activity.userId,
          event_type: activity.eventType,
          metadata: activity.metadata || {},
          created_at: new Date().toISOString()
        }))
      );

    if (error) {
      console.error('Error tracking activity batch:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in trackActivityBatch:', error);
    return false;
  }
};
