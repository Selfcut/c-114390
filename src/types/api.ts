
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'online' | 'offline' | 'away';
  created_at: string;
  updated_at: string;
}

export interface ContentInteraction {
  id: string;
  content_id: string;
  content_type: string;
  user_id: string;
  type: 'like' | 'bookmark' | 'share';
  created_at: string;
}

export interface ContentStats {
  likes: number;
  comments: number;
  views: number;
  bookmarks: number;
  shares: number;
}

export type DatabaseTable = 
  | 'quotes'
  | 'forum_posts'
  | 'media_posts'
  | 'wiki_articles'
  | 'knowledge_entries'
  | 'research_papers'
  | 'events'
  | 'profiles'
  | 'content_comments'
  | 'content_likes'
  | 'content_bookmarks';

export type ContentType = 
  | 'quote'
  | 'forum'
  | 'media'
  | 'wiki'
  | 'knowledge'
  | 'research'
  | 'event';

export interface BaseContent {
  id: string;
  title: string;
  content?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  likes: number;
  comments: number;
  views: number;
  bookmarks?: number;
}

export interface Quote extends BaseContent {
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[];
  featured_date?: string;
}

export interface ForumPost extends BaseContent {
  upvotes: number;
  tags: string[];
  is_pinned: boolean;
}

export interface MediaPost extends BaseContent {
  type: 'image' | 'video' | 'youtube' | 'document' | 'text';
  url?: string;
}

export interface WikiArticle extends BaseContent {
  description: string;
  category: string;
  tags: string[];
  image_url?: string;
  contributors: number;
  last_updated: string;
}
