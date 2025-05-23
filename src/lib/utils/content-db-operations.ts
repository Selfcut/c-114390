
// Re-export simplified operations
export {
  checkUserInteractions,
  toggleLike,
  toggleBookmark,
  normalizeContentType
} from './content-operations';

// Explicitly define the user interaction status interface for better type safety
export interface UserInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
}

// Implement proper batch check for interactions
export const batchCheckInteractions = async (
  userId: string,
  contentIds: string[],
  contentType: string
): Promise<Record<string, UserInteractionStatus>> => {
  if (!userId || !contentIds.length) {
    return {};
  }
  
  try {
    // Import the function we need to use
    const { checkUserInteractions } = await import('./content-operations');
    
    // Create a result object to store all interaction statuses
    const results: Record<string, UserInteractionStatus> = {};
    
    // Process in smaller batches for better performance
    const batchSize = 20;
    const batches = [];
    
    // Split content IDs into batches
    for (let i = 0; i < contentIds.length; i += batchSize) {
      batches.push(contentIds.slice(i, i + batchSize));
    }
    
    // Process each batch
    for (const batch of batches) {
      const batchPromises = batch.map(contentId => 
        checkUserInteractions(userId, contentId, contentType)
      );
      
      const batchResults = await Promise.all(batchPromises);
      
      // Store results with content ID as key
      batch.forEach((contentId, index) => {
        results[contentId] = batchResults[index];
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error in batch checking interactions:', error);
    return {};
  }
};
