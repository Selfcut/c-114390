
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches user learning progress data
 * @param userId The user ID
 */
export const fetchLearningProgress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('event_type, metadata, created_at')
      .eq('user_id', userId)
      .in('event_type', ['read', 'learned', 'completed', 'view'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching learning progress:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchLearningProgress:", error);
    return [];
  }
};

/**
 * Extracts topics from user activities
 */
export const extractTopicsFromActivities = (activities: any[]) => {
  const topics = new Map<string, {
    activities: number,
    lastActivity: Date,
    progress: number
  }>();

  activities.forEach(activity => {
    // Safely access metadata properties with type checking
    const metadata = activity.metadata as Record<string, any> | null;
    const topic = metadata && typeof metadata === 'object' ? 
      (metadata.topic as string || metadata.category as string || 'General') : 
      'General';
    
    if (!topics.has(topic)) {
      topics.set(topic, { 
        activities: 0, 
        lastActivity: new Date(activity.created_at),
        progress: 0
      });
    }
    
    const topicData = topics.get(topic)!;
    topicData.activities += 1;
    
    const activityDate = new Date(activity.created_at);
    if (activityDate > topicData.lastActivity) {
      topicData.lastActivity = activityDate;
    }
    
    // Calculate progress (more activities = more progress, max 100)
    topicData.progress = Math.min(100, topicData.activities * 20);
  });

  return topics;
};

/**
 * Creates progress data items from topics map
 */
export const createProgressDataFromTopics = (topics: Map<string, {
  activities: number,
  lastActivity: Date,
  progress: number
}>) => {
  // Create progress data based on topics
  return Array.from(topics.entries()).map(([topic, data], index) => {
    // Choose icon based on topic name
    const icons = ["book", "brain", "target", "clock", "award", "trend"];
    const iconIndex = Math.abs(topic.charCodeAt(0) + topic.length) % icons.length;
    
    return {
      id: (index + 1).toString(),
      title: topic,
      description: `${data.activities} learning activities`,
      progress: data.progress,
      icon: icons[iconIndex],
      recentActivity: `Last activity: ${new Date(data.lastActivity).toLocaleDateString()}`,
      streakDays: data.activities > 2 ? Math.max(1, Math.floor(data.activities / 2)) : undefined
    };
  });
};

/**
 * Adds default learning topics if none exist
 */
export const addDefaultTopics = () => {
  const defaultTopics = ['Mathematics & Logic', 'Philosophy', 'Physics', 'Computer Science'];
  const currentDate = new Date().toLocaleDateString();
  
  return defaultTopics.map((topic, index) => ({
    id: (index + 1000).toString(),
    title: topic,
    description: 'Begin your learning journey',
    progress: 0,
    icon: ["book", "brain", "target", "clock"][index % 4],
    recentActivity: `No recent activity`,
    streakDays: 0
  }));
};
