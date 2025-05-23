
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { normalizeContentType, getContentTypeString } from './contentTypeUtils';

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
  const normalizedContentType = normalizeContentType(contentType);
  
  /**
   * Toggles the bookmark status of the content.
   */
  const toggleBookmark = async (): Promise<boolean> => {
    if (!userId) {
      console.warn('User ID is required to toggle bookmark.');
      return false;
    }
    
    try {
      const isQuote = normalizedContentType === 'quote';
      const table = isQuote ? 'quote_bookmarks' : 'content_bookmarks';
      const contentIdField = isQuote ? 'quote_id' : 'content_id';
      
      // Check if the content is already bookmarked
      const { data: existingBookmark, error: checkError } = await supabase
        .from(table as any) // Type assertion to bypass TypeScript restriction
        .select('id')
        .eq('user_id', userId)
        .eq(contentIdField, contentId)
        .maybeSingle();
      
      if (checkError) {
        throw new Error(checkError.message);
      }
      
      // Fix: Check if existingBookmark exists AND has an id property
      if (existingBookmark && 'id' in existingBookmark) {
        // Remove the bookmark
        const { error: deleteError } = await supabase
          .from(table as any) // Type assertion to bypass TypeScript restriction
          .delete()
          .eq('id', existingBookmark.id);
        
        if (deleteError) {
          throw new Error(deleteError.message);
        }
        
        setIsBookmarked(false);
        return false;
      } else {
        // Add the bookmark
        const insertPayload: any = {
          user_id: userId,
        };
        
        // Add the proper ID field based on content type
        insertPayload[contentIdField] = contentId;
        
        if (!isQuote) {
          insertPayload.content_type = normalizedContentType;
        }
        
        const { error: insertError } = await supabase
          .from(table as any) // Type assertion to bypass TypeScript restriction
          .insert(insertPayload); // Use typed payload
        
        if (insertError) {
          throw new Error(insertError.message);
        }
        
        setIsBookmarked(true);
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling bookmark:', error.message);
      return false;
    }
  };
  
  return {
    isBookmarked,
    toggleBookmark,
  };
};
