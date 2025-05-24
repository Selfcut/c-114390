
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

export interface UnifiedContent {
  id: string;
  type: ContentType;
  title: string;
  content?: string;
  summary?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  metrics: {
    likes: number;
    comments: number;
    views: number;
    bookmarks?: number;
    upvotes?: number;
  };
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
