
import { ContentFeedItem } from '@/hooks/useContentFeed';

/**
 * Content feed state interface
 */
export interface ContentFeedState {
  feedItems: ContentFeedItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

/**
 * Content interaction state interface
 */
export interface ContentInteractionState {
  likedItems: Record<string, boolean>;
  bookmarkedItems: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Content filter state interface
 */
export interface ContentFilterState {
  activeType: string;
  viewMode: string;
  searchTerm: string;
  tags: string[];
}
