
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

export type InteractionType = 'like' | 'bookmark';

export interface InteractionCheckResult {
  id: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface ContentInteractionResult {
  isLiked: boolean;
  id: string;
}

export interface ContentBookmarkResult {
  isBookmarked: boolean;
  id: string;
}

export interface UseContentInteractionsProps {
  userId?: string | null;
}

export interface UserInteractions {
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (id: string, itemType: ContentItemType) => Promise<ContentInteractionResult | null>;
  handleBookmark: (id: string, itemType: ContentItemType) => Promise<ContentBookmarkResult | null>;
  checkUserInteractions: (itemIds: string[]) => Promise<void>;
}
