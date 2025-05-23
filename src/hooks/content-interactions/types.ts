
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType } from '@/types/contentTypes';

/**
 * The type of interaction a user can have with content
 */
export type InteractionType = 'like' | 'bookmark';

/**
 * Status of an interaction operation
 */
export type InteractionStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Result of checking if a user has interacted with items
 */
export interface InteractionCheckResult {
  id: string;
  isLiked: boolean;
  isBookmarked: boolean;
  contentType?: string;
}

/**
 * Result of a like interaction
 */
export interface ContentInteractionResult {
  isLiked: boolean;
  id: string;
  contentType?: string;
}

/**
 * Result of a bookmark interaction
 */
export interface ContentBookmarkResult {
  isBookmarked: boolean;
  id: string;
  contentType?: string;
}

/**
 * Props for useContentInteractions hook
 */
export interface UseContentInteractionsProps {
  userId?: string | null;
  onInteractionChange?: (type: InteractionType, id: string, value: boolean) => void;
}

/**
 * Structure for tracking loading states by content item
 */
export interface ContentLoadingState {
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

/**
 * Return type for useContentInteractions hook
 */
export interface UserInteractions {
  // State
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  loadingStates: Record<string, ContentLoadingState>;
  
  // Methods
  handleLike: (id: string, itemType: string | ContentType | ContentItemType) => Promise<ContentInteractionResult>;
  handleBookmark: (id: string, itemType: string | ContentType | ContentItemType) => Promise<ContentBookmarkResult>;
  checkUserInteractions: (itemIds: string[], itemType?: string | ContentType | ContentItemType) => Promise<void>;
  getLoadingState: (id: string) => ContentLoadingState;
  isInteractionLoading: (id: string, type: InteractionType) => boolean;
  isItemLiked?: (id: string, itemType: string | ContentType | ContentItemType) => boolean;
  isItemBookmarked?: (id: string, itemType: string | ContentType | ContentItemType) => boolean;
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

/**
 * Database operation error
 */
export interface DatabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

/**
 * Batch processing options
 */
export interface BatchProcessingOptions {
  batchSize?: number;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Interface for all content-related database operations
 */
export interface ContentDatabaseOperations {
  checkUserInteraction: (userId: string, contentId: string, contentType: string) => Promise<InteractionCheckResult>;
  toggleLike: (userId: string, contentId: string, contentType: string) => Promise<boolean>;
  toggleBookmark: (userId: string, contentId: string, contentType: string) => Promise<boolean>;
  batchCheckInteractions: (userId: string, contentIds: string[], contentType: string) => Promise<Record<string, InteractionCheckResult>>;
}
