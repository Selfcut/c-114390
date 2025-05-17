
export interface UseContentInteractionsProps {
  userId?: string | null;
}

export interface ContentInteractionResult {
  isLiked: boolean;
  id: string;
}

export interface ContentBookmarkResult {
  isBookmarked: boolean;
  id: string;
}

export interface UserInteractions {
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (id: string, itemType: string) => Promise<ContentInteractionResult | null>;
  handleBookmark: (id: string, itemType: string) => Promise<ContentBookmarkResult | null>;
  checkUserInteractions: (itemIds: string[]) => Promise<void>;
}
