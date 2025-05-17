
export interface MediaPostAuthor {
  name: string;
  avatar_url?: string | null;
  username?: string | null;
}

export type MediaPostType = "youtube" | "image" | "document" | "text";

export interface MediaPost {
  id: string;
  title: string;
  content?: string | null;
  url?: string | null;
  type: MediaPostType;
  user_id: string;
  created_at?: string | null;
  updated_at?: string | null;
  likes?: number | null;
  comments?: number | null;
  author?: MediaPostAuthor;
}

// Function to validate media type
export const validateMediaType = (type: string): MediaPostType => {
  const validTypes: MediaPostType[] = ["youtube", "image", "document", "text"];
  return validTypes.includes(type as MediaPostType) 
    ? (type as MediaPostType) 
    : "text";  // Default to "text" if invalid type
};

// Function to track media views
export const trackMediaView = async (mediaId: string, userId?: string) => {
  try {
    // Implementation would depend on your tracking mechanism
    console.log(`Media ${mediaId} viewed by user ${userId || 'anonymous'}`);
    // Here you would typically call an API or update database
  } catch (error) {
    console.error("Error tracking media view:", error);
  }
};

// Utility function to format a date
export const formatMediaDate = (dateString?: string | null): string => {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'Invalid date';
  }
};
