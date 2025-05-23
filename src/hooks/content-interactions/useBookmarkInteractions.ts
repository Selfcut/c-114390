
import { useState, useCallback } from 'react';
import { toggleBookmark, normalizeContentType } from '@/lib/utils/content-operations';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

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
      const newIsBookmarked = await toggleBookmark(
        userId,
        contentId,
        normalizedContentType
      );
      
      setIsBookmarked(newIsBookmarked);
      return newIsBookmarked;
    } catch (error: any) {
      console.error('Error toggling bookmark:', error.message);
      return isBookmarked;
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
