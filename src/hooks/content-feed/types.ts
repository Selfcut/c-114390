
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { MediaType } from '@/components/library/content-items/ContentItemTypes';

export interface ContentFeedItem {
  id: string;
  type: ContentItemType;
  title: string;
  summary?: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: string;
  metrics: {
    likes?: number;
    comments?: number;
    views?: number;
    bookmarks?: number;
  };
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

export interface ContentFeedFilters {
  contentType?: ContentItemType | 'all';
  sortBy?: 'latest' | 'popular' | 'trending';
  searchTerm?: string;
}

export interface ContentFeedState {
  feedItems: ContentFeedItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export interface ContentFeedHookResult {
  feedItems: ContentFeedItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (contentId: string, contentType: ContentItemType) => Promise<any>;
  handleBookmark: (contentId: string, contentType: ContentItemType) => Promise<any>;
  handleContentClick: (contentId: string, contentType: ContentItemType) => void;
}
