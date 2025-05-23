
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * The type of interaction a user can have with content
 */
export type InteractionType = 'like' | 'bookmark';

/**
 * Result of checking if a user has interacted with items
 */
export interface InteractionCheckResult {
  id: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * Result of a like interaction
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
 * Props for useContentInteractions hook
 */
export interface UseContentInteractionsProps {
  userId?: string | null;
}

/**
 * Return type for useContentInteractions hook
 */
export interface UserInteractions {
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (id: string, itemType: ContentItemType) => Promise<ContentInteractionResult | null>;
  handleBookmark: (id: string, itemType: ContentItemType) => Promise<ContentBookmarkResult | null>;
  checkUserInteractions: (itemIds: string[]) => Promise<void>;
}

/**
 * Database table mappings for different content types
 */
export interface ContentTypeTables {
  contentTable: string;
  likesTable: string;
  bookmarksTable: string;
  idFieldName: string;
  likesColumnName: string;
  bookmarksColumnName?: string;
}
