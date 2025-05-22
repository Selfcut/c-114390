
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InteractionType } from './types';
import { addLike, removeLike } from './like-operations';
import { addBookmark, removeBookmark } from './bookmark-operations';

/**
 * Toggle a user interaction (like or bookmark) on content
 * @param type The interaction type ('like' or 'bookmark')
 * @param userId The user ID
 * @param contentId The content ID
 * @param contentType The content type (quote, forum, etc.)
 * @returns Promise<boolean> indicating new state
 */
export const toggleUserInteraction = async (
  type: InteractionType,
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    // Determine which table to use
    const isLike = type === 'like';
    
    // Use string literals directly without complex type assertions
    const tableName = contentType === 'quote' 
      ? (isLike ? 'quote_likes' : 'quote_bookmarks')
      : (isLike ? 'content_likes' : 'content_bookmarks');
    
    const idField = contentType === 'quote' ? 'quote_id' : 'content_id';

    // Use explicit table name in query to prevent type inference issues
    let checkData;
    let checkError;
    
    if (contentType === 'quote') {
      if (isLike) {
        // Quote likes
        const result = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle();
        checkData = result.data;
        checkError = result.error;
      } else {
        // Quote bookmarks
        const result = await supabase
          .from('quote_bookmarks')
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle();
        checkData = result.data;
        checkError = result.error;
      }
    } else {
      if (isLike) {
        // Content likes
        const result = await supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .maybeSingle();
        checkData = result.data;
        checkError = result.error;
      } else {
        // Content bookmarks
        const result = await supabase
          .from('content_bookmarks')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .maybeSingle();
        checkData = result.data;
        checkError = result.error;
      }
    }
    
    if (checkError) throw checkError;

    if (checkData) {
      // Remove interaction
      const recordId = checkData.id;
      if (!recordId) throw new Error('Could not find record ID');
      
      if (isLike) {
        // Pass the appropriate table name for likes
        await removeLike(recordId, contentId, contentType);
      } else {
        // Pass the appropriate table name for bookmarks
        await removeBookmark(recordId, contentId, contentType);
      }
      
      return false;
    } else {
      // Add interaction
      if (isLike) {
        await addLike(
          userId, 
          contentId, 
          contentType, 
          contentType === 'quote' ? 'quote_likes' : 'content_likes'
        );
      } else {
        await addBookmark(
          userId, 
          contentId, 
          contentType, 
          contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks'
        );
      }
      
      return true;
    }
  } catch (error) {
    console.error(`[Supabase Utils] Error toggling ${type}:`, error);
    toast.error(`Could not ${type} the content. Please try again.`);
    return false;
  }
};
