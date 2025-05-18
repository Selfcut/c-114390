
import { supabase } from "@/integrations/supabase/client";

export async function fetchLearningProgress(userId: string) {
  try {
    // Get user activities grouped by topic/category
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching learning progress:', error);
      return [];
    }
    
    return activities || [];
  } catch (error) {
    console.error('Error in fetchLearningProgress:', error);
    return [];
  }
}

export function extractTopicsFromActivities(activities: any[]) {
  // Create a map to store topic data
  const topics = new Map();
  
  activities.forEach(activity => {
    // Extract topic from activity metadata
    let topic = null;
    
    if (activity.metadata?.topic) {
      topic = activity.metadata.topic;
    } else if (activity.metadata?.category) {
      topic = activity.metadata.category;
    } else if (activity.metadata?.section) {
      topic = activity.metadata.section;
    }
    
    // If we found a topic, update its data in the map
    if (topic) {
      if (!topics.has(topic)) {
        topics.set(topic, {
          activities: 1,
          lastActivity: new Date(activity.created_at),
          progress: 15 // Start with some progress for a single activity
        });
      } else {
        const topicData = topics.get(topic);
        topicData.activities += 1;
        
        // Update last activity date if this one is more recent
        const activityDate = new Date(activity.created_at);
        if (activityDate > topicData.lastActivity) {
          topicData.lastActivity = activityDate;
        }
        
        // Calculate progress based on number of activities (cap at 100%)
        topicData.progress = Math.min(100, topicData.activities * 15);
      }
    }
  });
  
  return topics;
}

export function createProgressDataFromTopics(topics: Map<string, any>) {
  const progressData = [];
  let idCounter = 1;
  
  // Convert topics map to progress data array
  for (const [topic, data] of topics.entries()) {
    // Skip topics with very little progress
    if (data.activities < 2) continue;
    
    // Create a description based on topic and activity count
    const description = `${data.activities} activities`;
    
    // Calculate streak days (placeholder logic - would need actual streak calculation)
    const streakDays = data.activities > 5 ? Math.floor(data.activities / 2) : null;
    
    // Determine icon based on topic name
    let icon = "book";
    if (topic.toLowerCase().includes("quiz") || topic.toLowerCase().includes("test")) {
      icon = "award";
    } else if (
      topic.toLowerCase().includes("watch") || 
      topic.toLowerCase().includes("video") ||
      topic.toLowerCase().includes("course")
    ) {
      icon = "clock";
    }
    
    progressData.push({
      id: `topic-${idCounter++}`,
      title: topic,
      description,
      progress: data.progress,
      icon,
      streakDays
    });
  }
  
  // Sort by progress (descending)
  progressData.sort((a, b) => b.progress - a.progress);
  
  return progressData;
}

export function addDefaultTopics() {
  return [
    {
      id: 'default-1',
      title: 'Mathematics & Logic',
      progress: 65,
      description: 'Advanced Set Theory',
      icon: 'book',
      streakDays: 12
    },
    {
      id: 'default-2',
      title: 'Philosophy',
      progress: 38,
      description: 'Ethics & Moral Philosophy',
      icon: 'award',
      streakDays: 7
    },
    {
      id: 'default-3',
      title: 'Physics',
      progress: 27,
      description: 'Quantum Mechanics Basics',
      icon: 'clock',
      streakDays: 3
    }
  ];
}
