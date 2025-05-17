
// Content item types definition
export type ContentItemType = 'knowledge' | 'quote' | 'media' | 'ai' | 'wiki';

// Content item status
export type ContentItemStatus = 'published' | 'draft' | 'archived' | 'pending';

// Author information
export interface ContentItemAuthor {
  name: string;
  username?: string;
  avatar?: string;
}

// Metrics for content items
export interface ContentItemMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  bookmarks?: number;
}

// Media types
export type MediaType = 'image' | 'video' | 'document' | 'youtube' | 'text';

// View modes
export type ContentViewMode = 'grid' | 'list' | 'feed';

// Format for base content item data
export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentItemType;
  status?: ContentItemStatus;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  author?: string;
  image?: string;
  tags?: string[];
  likes?: number;
  views?: number;
  comments?: number;
  category?: string;
  sources?: string[];
  content?: string;
}

// Props for content item components
export interface ContentItemProps {
  id: string;
  type: ContentItemType;
  title: string;
  summary?: string;
  content?: string;
  author: ContentItemAuthor;
  createdAt: Date | string;
  tags?: string[];
  metrics?: ContentItemMetrics;
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  isLiked?: boolean;
  isBookmarked?: boolean;
  viewMode: ContentViewMode;
  onClick?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onLike?: (id: string, type?: ContentItemType) => void;
  onBookmark?: (id: string, type?: ContentItemType) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

// Wiki specific content item
export interface WikiContentItem extends ContentItem {
  category: string;
  contributors: number;
}
