
/**
 * Enum for content item types
 */
export enum ContentItemType {
  Quote = 'quote',
  Forum = 'forum',
  Media = 'media',
  Wiki = 'wiki',
  Knowledge = 'knowledge',
  AI = 'ai'
}

/**
 * Media types for content items
 */
export type MediaType = 'image' | 'video' | 'youtube' | 'document' | 'text';

/**
 * Content view modes
 */
export type ContentViewMode = 'grid' | 'list' | 'feed';

/**
 * Author information
 */
export interface ContentItemAuthor {
  name: string;
  avatar?: string;
  username?: string;
}

/**
 * Content metrics
 */
export interface ContentItemMetrics {
  likes?: number;
  comments?: number;
  views?: number;
  bookmarks?: number;
}

/**
 * Props for content item components
 */
export interface ContentItemProps {
  id: string;
  type: ContentItemType;
  title: string;
  summary?: string;
  content?: string;
  author: ContentItemAuthor;
  createdAt: Date | string;
  metrics?: ContentItemMetrics;
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  isLiked?: boolean;
  isBookmarked?: boolean;
  viewMode: ContentViewMode;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}
