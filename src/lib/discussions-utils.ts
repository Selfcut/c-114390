
// Format dates for discussions
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

// Re-export DiscussionTopic interface for wider use
export interface DiscussionTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: Date;
  tags?: string[];
  upvotes: number;
  views: number;
  comments: number;
  isPinned: boolean;
  isPopular: boolean;
  isNew?: boolean;
  replies?: number;
  excerpt?: string;
}

// Helper function to check if a post is new (less than 24 hours old)
export const isNewPost = (date: Date): boolean => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffInHours < 24;
};

// Helper function to create excerpt from content
export const createExcerpt = (content: string, maxLength = 150): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};
