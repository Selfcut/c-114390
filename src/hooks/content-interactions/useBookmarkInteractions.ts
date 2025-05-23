
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { normalizeContentType } from '@/lib/utils/content-type-utils';

interface UseBookmarkInteractionsProps {
  contentId: string;
  contentType: string | ContentType | ContentItemType;
  userId: string | undefined;
  initialBookmarkState?: boolean;
}

// Define table types to avoid TypeScript recursion
type QuoteBookmarksTable = 'quote_bookmarks';
type ContentBookmarksTable = 'content_bookmarks';

// Define strongly typed interfaces for database operations
interface QuoteBookmarkPayload {
  quote_id: string;
  user_id: string;
}

interface ContentBookmarkPayload {
  content_id: string;
  user_id: string;
  content_type: string;
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
  const toggleBookmark = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      console.warn('User ID is required to toggle bookmark.');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const isQuote = normalizedContentType === 'quote';
      
      // Check if the content is already bookmarked
      if (isQuote) {
        const bookmarksTable = 'quote_bookmarks' as QuoteBookmarksTable;
        
        const { data, error: checkError } = await supabase
          .from(bookmarksTable)
          .select('id')
          .eq('user_id', userId)
          .eq('quote_id', contentId)
          .maybeSingle();
        
        if (checkError) {
          throw new Error(checkError.message);
        }
        
        // Check if data exists AND has an id property
        if (data && 'id' in data) {
          // Remove the bookmark
          const { error: deleteError } = await supabase
            .from(bookmarksTable)
            .delete()
            .eq('id', data.id);
          
          if (deleteError) {
            throw new Error(deleteError.message);
          }
          
          setIsBookmarked(false);
          return false;
        } else {
          // Add the bookmark with proper typing
          const bookmarkData: QuoteBookmarkPayload = {
            user_id: userId,
            quote_id: contentId
          };
          
          const { error: insertError } = await supabase
            .from(bookmarksTable)
            .insert(bookmarkData);
          
          if (insertError) {
            throw new Error(insertError.message);
          }
          
          setIsBookmarked(true);
          return true;
        }
      } else {
        // Handle content_bookmarks table
        const bookmarksTable = 'content_bookmarks' as ContentBookmarksTable;
        
        const { data, error: checkError } = await supabase
          .from(bookmarksTable)
          .select('id')
          .eq('user_id', userId)
          .eq('content_id', contentId)
          .eq('content_type', normalizedContentType)
          .maybeSingle();
        
        if (checkError) {
          throw new Error(checkError.message);
        }
        
        if (data && 'id' in data) {
          // Remove the bookmark
          const { error: deleteError } = await supabase
            .from(bookmarksTable)
            .delete()
            .eq('id', data.id);
          
          if (deleteError) {
            throw new Error(deleteError.message);
          }
          
          setIsBookmarked(false);
          return false;
        } else {
          // Add the bookmark with proper typing
          const bookmarkData: ContentBookmarkPayload = {
            user_id: userId,
            content_id: contentId,
            content_type: normalizedContentType
          };
          
          const { error: insertError } = await supabase
            .from(bookmarksTable)
            .insert(bookmarkData);
          
          if (insertError) {
            throw new Error(insertError.message);
          }
          
          setIsBookmarked(true);
          return true;
        }
      }
    } catch (error: any) {
      console.error('Error toggling bookmark:', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, contentId, normalizedContentType]);
  
  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  };
};
