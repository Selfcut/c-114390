
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { incrementCounter, decrementCounter } from '../counter-operations';
import { ContentBookmarkInsert, QuoteBookmarkInsert } from './types';

/**
 * Add a bookmark to content
 * @param userId The user ID
 * @param contentId The content ID
 * @param contentType The content type
 * @param tableName The table name for the bookmark
 * @returns boolean indicating success
 */
export const addBookmark = async (
  userId: string,
  contentId: string,
  contentType: string,
  tableName: 'quote_bookmarks' | 'content_bookmarks'
): Promise<boolean> => {
  try {
    if (contentType === 'quote') {
      // Quote bookmark
      const insertData: QuoteBookmarkInsert = {
        quote_id: contentId,
        user_id: userId
      };
      
      const { error } = await supabase
        .from('quote_bookmarks')
        .insert(insertData);
        
      if (error) throw error;
    } else {
      // Content bookmark
      const insertData: ContentBookmarkInsert = {
        content_id: contentId,
        user_id: userId,
        content_type: contentType
      };
      
      const { error } = await supabase
        .from('content_bookmarks')
        .insert(insertData);
        
      if (error) throw error;
    }

    // Only increment bookmarks count for quotes
    if (contentType === 'quote') {
      await incrementCounter(contentId, 'bookmarks', 'quotes');
    }
      
    return true;
  } catch (error) {
    console.error(`[Supabase Utils] Error adding bookmark:`, error);
    return false;
  }
};

/**
 * Remove a bookmark from content
 * @param bookmarkId The bookmark record ID
 * @param contentId The content ID
 * @param contentType The content type
 * @returns boolean indicating success
 */
export const removeBookmark = async (
  bookmarkId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    const tableName = contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
    
    const { error } = await supabase
      .from(tableName as 'quote_bookmarks' | 'content_bookmarks')
      .delete()
      .eq('id', bookmarkId);
      
    if (error) throw error;
    
    // Only decrement bookmarks count for quotes
    if (contentType === 'quote') {
      await decrementCounter(contentId, 'bookmarks', 'quotes');
    }
    
    return true;
  } catch (error) {
    console.error(`[Supabase Utils] Error removing bookmark:`, error);
    return false;
  }
};
