
// Media post types
export type MediaPostType = 'image' | 'video' | 'document' | 'youtube' | 'text';

// Media post interface
export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: MediaPostType;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  author?: {
    name: string;
    avatar_url?: string;
    username?: string;
  };
}

// Function to validate media post type
export const validateMediaType = (type: string): MediaPostType => {
  const validTypes: MediaPostType[] = ['image', 'video', 'document', 'youtube', 'text'];
  return validTypes.includes(type as MediaPostType) ? (type as MediaPostType) : 'text';
};

// Helper functions for media interaction analytics
export const trackMediaView = async (mediaId: string, userId?: string): Promise<void> => {
  if (!mediaId) return;
  
  try {
    // Record view even for anonymous users
    await fetch('/api/media/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaId, userId })
    });
  } catch (error) {
    console.error('Error tracking media view:', error);
  }
};

// Format media created date for display
export const formatMediaDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};
