
// Format a date as "X time ago" (e.g. "2 hours ago")
export const formatTimeAgo = (date: Date): string => {
  try {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    // Less than a month
    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }
    
    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    // More than a year
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'unknown time ago';
  }
};

// Define the interface for a discussion topic
export interface DiscussionTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: Date;
  tags: string[];
  upvotes: number;
  views: number;
  comments: number;
  isPinned: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

// Helper function to safely parse a date string
export const safeParseDate = (dateString: string | Date | null | undefined): Date => {
  if (!dateString) return new Date();
  
  try {
    return typeof dateString === 'string' ? new Date(dateString) : dateString;
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date(); // Return current date as fallback
  }
};

// Helper function to safely get excerpt from content
export const getExcerpt = (content: string | null | undefined, maxLength: number = 120): string => {
  if (!content) return '';
  
  try {
    return content.length > maxLength 
      ? content.slice(0, maxLength) + '...' 
      : content;
  } catch (error) {
    console.error('Error creating excerpt:', error);
    return '';
  }
};

// Helper function to determine if a post is new (less than 24h old)
export const isNewPost = (createdAt: Date): boolean => {
  try {
    const now = new Date();
    const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  } catch (error) {
    console.error('Error checking if post is new:', error);
    return false;
  }
};
