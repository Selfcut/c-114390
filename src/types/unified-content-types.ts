
// Unified content type system to replace scattered type definitions
export type ContentViewMode = 'list' | 'grid' | 'feed';

export type ContentType = 
  | 'quote' 
  | 'knowledge' 
  | 'media' 
  | 'forum' 
  | 'wiki' 
  | 'ai' 
  | 'research'
  | 'all';

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
