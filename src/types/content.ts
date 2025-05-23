
export interface Author {
  id?: string;
  name: string;
  username?: string;
  avatar_url?: string;
}

export interface ContentInteraction {
  id: string;
  user_id: string;
  content_id: string;
  content_type: string;
  created_at: string;
}

export interface ContentComment {
  id: string;
  user_id: string;
  content_id: string;
  content_type: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  author?: Author;
}

export interface ContentBase {
  id: string;
  title: string;
  likes: number;
  views?: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
  author?: Author;
}

export interface ForumPost extends ContentBase {
  content: string;
  tags: string[]; // Making tags required
  upvotes: number;
  is_pinned?: boolean;
}

export interface KnowledgeEntry extends ContentBase {
  summary: string;
  content?: string;
  categories: string[];
  cover_image?: string;
  is_ai_generated?: boolean;
}

export interface MediaPost extends ContentBase {
  content?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  url?: string;
}

// Make Quote consistent with QuoteWithUser in lib/quotes/types.ts
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[]; // Making tags required
  likes: number;
  views?: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
  bookmarks: number;
}

export interface WikiArticle extends ContentBase {
  content: string;
  description: string;
  category: string;
  tags: string[]; // Making tags required
  image_url?: string;
  author_name?: string;
  contributors?: number;
  last_updated?: string;
}

// Import UserProfile from user.ts instead of duplicating it here
import { UserProfile } from '@/types/user';
