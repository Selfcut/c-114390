
/**
 * Unified content type system for the entire application
 */
export enum ContentType {
  All = 'all',
  Knowledge = 'knowledge',
  Media = 'media',
  Quote = 'quote',
  Forum = 'forum',
  Wiki = 'wiki',
  AI = 'ai',
  Research = 'research'
}

export type MediaType = 'image' | 'video' | 'youtube' | 'document' | 'text';
export type ContentViewMode = 'grid' | 'list' | 'feed';

export interface ContentAuthor {
  name: string;
  avatar?: string;
  username?: string;
}

export interface ContentMetrics {
  likes?: number;
  comments?: number;
  views?: number;
  bookmarks?: number;
}

export interface UnifiedContentItem {
  id: string;
  type: ContentType;
  title: string;
  summary?: string;
  content?: string;
  author: ContentAuthor;
  createdAt: string;
  metrics?: ContentMetrics;
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

export interface ContentInteractionState {
  isLiked: boolean;
  isBookmarked: boolean;
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

export interface ContentFeedState {
  items: UnifiedContentItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}
