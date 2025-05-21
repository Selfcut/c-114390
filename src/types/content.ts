
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

// Don't extend ContentBase for Quote to avoid the author type mismatch
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[];
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

// To fix the ContentBase extension error with Quote, create a special base interface for quotes
export interface QuoteBase {
  id: string;
  title: string;
  likes: number;
  views?: number;
  comments: number;
  user_id: string;
  created_at: string;
  updated_at?: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[];
  bookmarks: number;
}

// Use this UserProfile definition here to avoid circular imports
export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  email?: string;
  avatar?: string;
  avatar_url?: string;
  status?: string;
  isGhostMode?: boolean;
  role?: string;
  isAdmin?: boolean;
}
