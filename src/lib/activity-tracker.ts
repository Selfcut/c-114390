
import { supabase } from "@/integrations/supabase/client";

export type ActivityType = 'view' | 'create' | 'update' | 'delete' | 'like' | 'bookmark' | 'comment' | 'interaction' | 'learned' | 'completed';

// Track user activity
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
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error tracking activity:", error);
    return false;
  }
};

// Get user activity stats
export const getUserActivityStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Calculate streak
    const today = new Date();
    const dates = data.map(activity => {
      const date = new Date(activity.created_at);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    });
    
    const uniqueDates = [...new Set(dates)].sort();
    
    // Check if the user was active today
    const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const wasActiveToday = uniqueDates.includes(todayString);
    
    // Calculate streak
    let streak = 0;
    
    if (wasActiveToday) {
      streak = 1;
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check for consecutive days backwards from yesterday
      for (let i = 1; i < 100; i++) { // Limit to 100 days to prevent infinite loop
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        
        const checkDateString = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
        
        if (uniqueDates.includes(checkDateString)) {
          streak++;
        } else {
          break;
        }
      }
    } else {
      // Check if the user was active yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      
      if (uniqueDates.includes(yesterdayString)) {
        streak = 1;
        
        // Check for consecutive days backwards from the day before yesterday
        for (let i = 2; i < 100; i++) { // Limit to 100 days
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          
          const checkDateString = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
          
          if (uniqueDates.includes(checkDateString)) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
    
    // Calculate XP - 10 points per activity
    const xp = data.length * 10;
    
    // Calculate level - Every 100 XP is a new level
    const level = Math.max(1, Math.floor(xp / 100) + 1);
    
    return {
      activityCount: data.length,
      streak,
      level,
      xp,
      nextLevelXp: level * 100,
      activityTypes: countActivityTypes(data)
    };
  } catch (error) {
    console.error("Error getting user activity stats:", error);
    throw error;
  }
};

// Calculate activity streak for a user
export const calculateActivityStreak = async (userId: string): Promise<number> => {
  try {
    const stats = await getUserActivityStats(userId);
    return stats.streak;
  } catch (error) {
    console.error("Error calculating activity streak:", error);
    return 0;
  }
};

// Count activity types
const countActivityTypes = (activities: any[]) => {
  const counts: Record<string, number> = {};
  
  activities.forEach(activity => {
    const type = activity.event_type;
    counts[type] = (counts[type] || 0) + 1;
  });
  
  return counts;
};
