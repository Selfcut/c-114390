
export type ActivityType = 'view' | 'create' | 'update' | 'delete' | 'like' | 'bookmark' | 'comment' | 
  'share' | 'learned' | 'completed' | 'interaction';

export const trackActivity = async (
  userId: string, 
  eventType: ActivityType,
  metadata: Record<string, any> = {}
) => {
  try {
    // Import is inside function to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        event_type: eventType,
        metadata
      });
    
    if (error) {
      console.error("Error tracking activity:", error);
    }
  } catch (err) {
    console.error("Failed to track activity:", err);
  }
};
