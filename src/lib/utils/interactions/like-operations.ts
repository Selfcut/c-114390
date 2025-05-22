
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { incrementCounter, decrementCounter } from '../counter-operations';
import { ContentLikeInsert, QuoteLikeInsert } from './types';

/**
 * Add a like to content
 * @param userId The user ID
 * @param contentId The content ID
 * @param contentType The content type
 * @param tableName The table name for the like
 * @returns boolean indicating success
 */
export const addLike = async (
  userId: string,
  contentId: string,
  contentType: string,
  tableName: 'quote_likes' | 'content_likes'
): Promise<boolean> => {
  try {
    if (contentType === 'quote') {
      // Quote like
      const insertData: QuoteLikeInsert = {
        quote_id: contentId,
        user_id: userId
      };
      
      const { error } = await supabase
        .from('quote_likes')
        .insert(insertData);
        
      if (error) throw error;
    } else {
      // Content like
      const insertData: ContentLikeInsert = {
        content_id: contentId,
        user_id: userId,
        content_type: contentType
      };
      
      const { error } = await supabase
        .from('content_likes')
        .insert(insertData);
        
      if (error) throw error;
    }

    // Increment like counter
    const contentTableName = contentType === 'quote' ? 'quotes' : `${contentType}_posts`;
    await incrementCounter(contentId, 'likes', contentTableName);
      
    return true;
  } catch (error) {
    console.error(`[Supabase Utils] Error adding like:`, error);
    return false;
  }
};

/**
 * Remove a like from content
 * @param likeId The like record ID
 * @param contentId The content ID
 * @param contentType The content type
 * @returns boolean indicating success
 */
export const removeLike = async (
  likeId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    // Use concrete table name
    const tableName = contentType === 'quote' ? 'quote_likes' : 'content_likes';
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', likeId);
      
    if (error) throw error;
    
    // Decrement like counter
    const contentTableName = contentType === 'quote' ? 'quotes' : `${contentType}_posts`;
    await decrementCounter(contentId, 'likes', contentTableName);
    
    return true;
  } catch (error) {
    console.error(`[Supabase Utils] Error removing like:`, error);
    return false;
  }
};
