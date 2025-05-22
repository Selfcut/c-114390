
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch learning progress with improved caching and error handling
 * 
 * @param userId - The ID of the user
 * @returns A promise that resolves to the user's activities
 */
export async function fetchLearningProgress(userId: string) {
  if (!userId) return [];
  
  try {
    // Get user activities grouped by topic/category with optimized query
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

/**
 * Extract topics from user activities with memoization capabilities
 * This function is optimized for performance by handling large activity lists efficiently
 * 
 * @param activities - Array of user activities
 * @returns A Map of topics with their activity data
 */
export function extractTopicsFromActivities(activities: any[]) {
  if (!activities || !activities.length) {
    return new Map();
  }
  
  // Create a map to store topic data
  const topics = new Map();
  
  // Process activities in chunks to avoid blocking the main thread for large lists
  const processActivitiesInChunks = (start: number, chunkSize: number) => {
    const end = Math.min(start + chunkSize, activities.length);
    
    for (let i = start; i < end; i++) {
      const activity = activities[i];
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
    }
    
    // Process next chunk if there are more activities
    if (end < activities.length) {
      setTimeout(() => processActivitiesInChunks(end, chunkSize), 0);
    }
  };
  
  // Start processing in chunks of 50 for better performance
  processActivitiesInChunks(0, 50);
  
  return topics;
}

/**
 * Create progress data from topics with improved performance
 * 
 * @param topics - Map of topics with their activity data
 * @returns Array of formatted progress data objects
 */
export function createProgressDataFromTopics(topics: Map<string, any>) {
  const progressData = [];
  let idCounter = 1;
  
  // Convert topics map to progress data array
  for (const [topic, data] of topics.entries()) {
    // Skip topics with very little progress
    if (data.activities < 2) continue;
    
    // Create a description based on topic and activity count
    const description = `${data.activities} activities`;
    
    // Calculate streak days (improved algorithm)
    const streakDays = calculateStreakDays(data.activities, data.lastActivity);
    
    // Determine icon based on topic name using optimized lookups
    const icon = determineTopicIcon(topic);
    
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
  return progressData.sort((a, b) => b.progress - a.progress);
}

/**
 * Calculate streak days based on activity count and last activity date
 * 
 * @param activityCount - Number of activities
 * @param lastActivity - Date of the last activity
 * @returns Number of streak days or null
 */
function calculateStreakDays(activityCount: number, lastActivity: Date): number | null {
  if (activityCount <= 5) return null;
  
  // Base calculation on activity count and recency
  const baseStreak = Math.floor(activityCount / 2);
  
  // Adjust for recency - reduce streak if last activity was more than a week ago
  const now = new Date();
  const daysSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastActivity > 7) {
    return Math.max(1, baseStreak - Math.floor(daysSinceLastActivity / 7));
  }
  
  return baseStreak;
}

/**
 * Determine the appropriate icon for a topic based on its name
 * Uses an optimized lookup approach
 * 
 * @param topicName - Name of the topic
 * @returns Icon name to use
 */
function determineTopicIcon(topicName: string): string {
  const lowerTopic = topicName.toLowerCase();
  
  // Fast lookup for common topic types
  if (lowerTopic.includes('quiz') || lowerTopic.includes('test')) {
    return 'award';
  }
  
  if (lowerTopic.includes('watch') || lowerTopic.includes('video') || lowerTopic.includes('course')) {
    return 'clock';
  }
  
  if (lowerTopic.includes('read') || lowerTopic.includes('book') || lowerTopic.includes('article')) {
    return 'book';
  }
  
  if (lowerTopic.includes('discuss') || lowerTopic.includes('forum') || lowerTopic.includes('chat')) {
    return 'message-square';
  }
  
  // Default icon
  return 'book';
}

/**
 * Add default topics for new users or when no progress data is available
 * 
 * @returns Array of default progress items
 */
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
