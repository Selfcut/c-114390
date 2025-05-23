
import { useState, useCallback } from 'react';
import { toggleBookmark } from '@/lib/utils/content-db-operations';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { normalizeContentType } from '@/lib/utils/content-type-utils';

interface UseBookmarkInteractionsProps {
  contentId: string;
  contentType: string | ContentType | ContentItemType;
  userId: string | undefined;
  initialBookmarkState?: boolean;
}

/**
 * Manages bookmark interactions for different content types.
 */
export const useBookmarkInteractions = ({
  contentId,
  contentType,
  userId,
  initialBookmarkState = false,
}: UseBookmarkInteractionsProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarkState);
  const [isLoading, setIsLoading] = useState(false);
  const normalizedContentType = normalizeContentType(contentType);
  
  /**
   * Toggles the bookmark status of the content.
   */
  const handleToggleBookmark = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      console.warn('User ID is required to toggle bookmark.');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Use the utility function for bookmark operations
      const newIsBookmarked = await toggleBookmark(
        userId,
        contentId,
        normalizedContentType
      );
      
      // Update the local state based on the result
      setIsBookmarked(newIsBookmarked);
      return newIsBookmarked;
    } catch (error: any) {
      console.error('Error toggling bookmark:', error.message);
      return isBookmarked; // Return current state on error
    } finally {
      setIsLoading(false);
    }
  }, [userId, contentId, normalizedContentType, isBookmarked]);
  
  return {
    isBookmarked,
    isLoading,
    toggleBookmark: handleToggleBookmark,
  };
};
