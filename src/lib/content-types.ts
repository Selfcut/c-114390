
// Define interfaces that match the database structure for content types
export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  summary: string;
  content?: string;
  categories: string[];
  cover_image?: string;
  likes: number;
  views: number;
  comments: number;
  is_ai_generated: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile | null;
}

export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  url?: string;
  likes: number;
  views: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile | null;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile | null;
}

// Interface for content items in the feed
export interface ContentFeedItem {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'media' | 'quotes' | 'ai';
  image?: string;
  author: string;
  date: string;
  likes: number;
  views?: number;
  comments: number;
  bookmarks?: number;
  category?: string;
  tags?: string[];
}

// Add ContentItem type for ContentFeedItem.tsx
export interface ContentItem extends ContentFeedItem {}
