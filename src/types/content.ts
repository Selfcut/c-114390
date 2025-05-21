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
  tags?: string[];
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

// Modified to not extend ContentBase
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[]; // Make tags required to match QuoteWithUser interface
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
  tags?: string[];
  image_url?: string;
  author_name?: string;
  contributors?: number;
  last_updated?: string;
}

// Remove this unnecessary interface since we've fixed the Quote interface
// export interface QuoteBase {
//   id: string;
//   title: string;
//   likes: number;
//   views?: number;
//   comments: number;
//   user_id: string;
//   created_at: string;
//   updated_at?: string;
//   text: string;
//   author: string;
//   source?: string;
//   category: string;
//   tags: string[];
//   bookmarks: number;
// }

// Import UserProfile from user.ts instead of duplicating it here
import { UserProfile } from '@/types/user';
