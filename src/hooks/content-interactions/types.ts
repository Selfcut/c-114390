
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * Result of a content interaction (like, bookmark)
 */
export interface ContentInteractionResult {
  isLiked: boolean;
  id: string;
}

/**
 * Result of a bookmark interaction
 */
export interface ContentBookmarkResult {
  isBookmarked: boolean;
  id: string;
}

/**
 * Interactions data for content
 */
export interface ContentInteractions {
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * Props for useContentInteractions hook
 */
export interface UseContentInteractionsProps {
  userId?: string | null;
}

/**
 * Return value from useContentInteractions hook
 */
export interface UserInteractions {
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (contentId: string, contentType: ContentItemType) => Promise<ContentInteractionResult | null>;
  handleBookmark: (contentId: string, contentType: ContentItemType) => Promise<ContentBookmarkResult | null>;
  checkUserInteractions: (contentIds: string[]) => Promise<void>;
}

/**
 * Interface for interaction check results
 */
export interface InteractionCheckResult {
  id: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * Props for content interaction components
 */
export interface ContentInteractionProps {
  contentId: string;
  contentType: ContentItemType;
  isLiked?: boolean;
  isBookmarked?: boolean;
  likesCount?: number;
  bookmarksCount?: number;
  onLike?: (contentId: string, contentType: ContentItemType) => Promise<ContentInteractionResult | null>;
  onBookmark?: (contentId: string, contentType: ContentItemType) => Promise<ContentBookmarkResult | null>;
}
