
// Unified content type system to replace scattered type definitions
export type ContentViewMode = 'list' | 'grid' | 'feed';

// Unified ContentType enum - replace all string literal usage
export enum ContentType {
  Quote = 'quote',
  Knowledge = 'knowledge', 
  Media = 'media',
  Forum = 'forum',
  Wiki = 'wiki',
  AI = 'ai',
  Research = 'research',
  All = 'all'
}

// Legacy values object for backward compatibility
export const ContentTypeValues = {
  Quote: ContentType.Quote,
  Knowledge: ContentType.Knowledge,
  Media: ContentType.Media,
  Forum: ContentType.Forum,
  Wiki: ContentType.Wiki,
  AI: ContentType.AI,
  Research: ContentType.Research,
  All: ContentType.All,
} as const;

export interface UnifiedContentItem {
  id: string;
  type: ContentType;
  title: string;
  content?: string;
  summary?: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: Date;
  metrics: {
    likes?: number;
    comments?: number;
    bookmarks?: number;
    views?: number;
    upvotes?: number;
  };
  tags?: string[];
  viewMode: ContentViewMode;
  mediaUrl?: string;
  mediaType?: string;
  coverImage?: string;
  categories?: string[];
}

export interface ContentFilters {
  searchQuery?: string;
  contentType?: ContentType;
  tags?: string[];
  category?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'most_liked' | 'most_bookmarked';
}

export interface ContentFeedState {
  items: UnifiedContentItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  totalCount: number;
}

export interface UserInteractionState {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  loadingStates: Record<string, {
    isLikeLoading: boolean;
    isBookmarkLoading: boolean;
  }>;
}
