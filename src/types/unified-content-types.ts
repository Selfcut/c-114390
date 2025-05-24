
export enum ContentType {
  All = 'all',
  Quote = 'quote',
  Forum = 'forum',
  Media = 'media',
  Wiki = 'wiki',
  Knowledge = 'knowledge',
  Research = 'research',
  AI = 'ai'
}

export const ContentTypeValues = ContentType;

export type ContentViewMode = 'list' | 'grid' | 'feed';

export interface UnifiedContentAuthor {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
}

export interface UnifiedContentMetrics {
  likes: number;
  comments: number;
  views: number;
  bookmarks?: number;
  upvotes?: number;
}

export interface UnifiedContent {
  id: string;
  type: ContentType;
  title: string;
  content?: string;
  summary?: string;
  author: UnifiedContentAuthor;
  createdAt: Date;
  updatedAt?: Date;
  metrics: UnifiedContentMetrics;
  tags?: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface UnifiedContentItem extends UnifiedContent {
  viewMode?: ContentViewMode;
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'youtube' | 'document' | 'text';
  categories?: string[];
}
