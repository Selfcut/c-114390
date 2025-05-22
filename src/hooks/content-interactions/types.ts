
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
