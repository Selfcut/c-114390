
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
    
    // Use explicit literal string types to avoid deep type instantiation
    const tableName = contentType === 'quote' 
      ? (isLike ? 'quote_likes' : 'quote_bookmarks') as const
      : (isLike ? 'content_likes' : 'content_bookmarks') as const;
    
    const idField = contentType === 'quote' ? 'quote_id' : 'content_id';

    // Check if interaction exists with explicit table name
    // Use type assertion to prevent deep type instantiation
    const { data: checkData, error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
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
          contentType === 'quote' ? 'quote_likes' as const : 'content_likes' as const
        );
      } else {
        await addBookmark(
          userId, 
          contentId, 
          contentType, 
          contentType === 'quote' ? 'quote_bookmarks' as const : 'content_bookmarks' as const
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
