
// Re-export simplified operations
export {
  checkUserInteractions as checkUserInteractions,
  toggleLike,
  toggleBookmark,
  normalizeContentType
} from './content-operations';

// Legacy compatibility exports
export const batchCheckInteractions = async (
  userId: string,
  contentIds: string[],
  contentType: string
) => {
  // Implementation would go here if needed
  return {};
};

export interface UserInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
}
