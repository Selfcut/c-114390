
import { supabase } from "@/integrations/supabase/client";

export async function trackActivity(userId: string, eventType: string, metadata: Record<string, any> = {}) {
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
}

export async function getRecentActivity(userId: string, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRecentActivity:', error);
    return [];
  }
}

export async function calculateActivityStreak(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching activities for streak:', error);
      return 0;
    }
    
    if (!data || data.length === 0) {
      return 0;
    }
    
    // Extract dates from activities and remove time
    const dates = data.map(activity => {
      const date = new Date(activity.created_at);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    });
    
    // Get unique dates (as timestamps)
    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
    
    if (uniqueDates.length === 0) {
      return 0;
    }
    
    // Check if most recent activity is today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimestamp = yesterday.getTime();
    
    // If most recent activity is not from today or yesterday, streak is broken
    if (uniqueDates[0] !== todayTimestamp && uniqueDates[0] !== yesterdayTimestamp) {
      return 0;
    }
    
    // Count consecutive days
    let streak = 1; // Start with 1 for today/yesterday
    let currentDate = uniqueDates[0] === todayTimestamp ? yesterday : new Date(yesterday);
    currentDate.setDate(currentDate.getDate() - 1);
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const expectedDate = currentDate.getTime();
      if (uniqueDates[i] === expectedDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (uniqueDates[i] < expectedDate) {
        // Found a gap, streak is broken
        break;
      }
      // If date is more recent than expected, continue checking the array
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating activity streak:', error);
    return 0;
  }
}
