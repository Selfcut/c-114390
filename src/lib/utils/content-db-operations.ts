
// Re-export simplified operations
export {
  checkUserInteractions as checkUserInteractions,
  toggleLike,
  toggleBookmark,
  normalizeContentType
} from './content-operations';

// Explicitly define the user interaction status interface for better type safety
export interface UserInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
}

// Legacy compatibility exports
export const batchCheckInteractions = async (
  userId: string,
  contentIds: string[],
  contentType: string
): Promise<Record<string, UserInteractionStatus>> => {
  // Implementation would go here if needed
  return {};
};
