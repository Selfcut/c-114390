
/**
 * Type definitions for Supabase tables to improve type safety in our application
 */

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
  profiles?: UserProfile;
}

export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  url?: string;
  likes: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
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
  profiles?: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
}

export interface ContentLike {
  id: string;
  content_id: string;
  user_id: string;
  content_type: 'knowledge' | 'media' | 'quote' | 'research';
  created_at: string;
}

export interface ContentBookmark {
  id: string;
  content_id: string;
  user_id: string;
  content_type: 'knowledge' | 'media' | 'quote';
  created_at: string;
}

export interface ContentComment {
  id: string;
  content_id: string;
  user_id: string;
  content_type: 'knowledge' | 'media' | 'quote';
  comment: string;
  created_at: string;
  updated_at: string;
}

// Add interface for wiki articles
export interface WikiArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  last_updated: Date;
  contributors: number;
  views: number;
  author_name?: string;
  tags?: string[];
  image_url?: string;
  user_id: string;
  created_at: Date;
  likes?: number;
}

// Add interface for research papers
export interface ResearchPaper {
  id: string;
  title: string;
  summary: string;
  author: string;
  content?: string;
  created_at: string;
  updated_at: string;
  views: number;
  likes: number;
  category: string;
  image_url?: string;
  user_id?: string;
}
