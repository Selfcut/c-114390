
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContentType, getContentTypeInfo } from '@/types/contentTypes';
import { normalizeContentType } from '@/hooks/content-interactions/contentTypeUtils';

// Export counter operations for backward compatibility
export { incrementCounter, decrementCounter } from './counter-operations';

/**
 * Type for user interaction with content
 */
export type InteractionType = 'like' | 'bookmark';

/**
 * Toggle a user interaction (like or bookmark) on content with improved type safety
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
  contentType: string | ContentType
): Promise<boolean> => {
  try {
    const normalizedType = normalizeContentType(contentType);
    const typeInfo = getContentTypeInfo(normalizedType);
    
    // Determine which table to use
    const isLike = type === 'like';
    const tableName = normalizedType === 'quote' 
      ? (isLike ? 'quote_likes' : 'quote_bookmarks')
      : (isLike ? 'content_likes' : 'content_bookmarks');
    
    const idField = normalizedType === 'quote' ? 'quote_id' : 'content_id';

    // Use type assertions to help TypeScript understand the table names
    let checkData;
    let checkError;
    
    if (normalizedType === 'quote') {
      if (isLike) {
        // Quote likes
        const result = await supabase
          .from('quote_likes' as any)
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle();
        checkData = result.data;
        checkError = result.error;
      } else {
        // Quote bookmarks
        const result = await supabase
          .from('quote_bookmarks' as any)
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle();
        checkData = result.data;
        checkError = result.error;
      }
    } else {
      // Use content_likes or content_bookmarks table with content_type field
      const tableToQuery = isLike ? 'content_likes' : 'content_bookmarks';
      const result = await supabase
        .from(tableToQuery as any)
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
      checkData = result.data;
      checkError = result.error;
    }
    
    if (checkError) throw checkError;

    if (checkData) {
      // Remove interaction if it exists
      let removeError;
      
      if (normalizedType === 'quote') {
        const removeResult = await supabase
          .from(tableName as any)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId);
        removeError = removeResult.error;
      } else {
        const removeResult = await supabase
          .from(tableName as any)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType);
        removeError = removeResult.error;
      }
      
      if (removeError) throw removeError;
      
      // Decrement counter in the appropriate table
      const columnName = isLike ? typeInfo.likesColumnName : typeInfo.bookmarksColumnName;
      
      // Only update counters if the column exists
      if (columnName) {
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: columnName,
          table_name: typeInfo.contentTable
        });
      }
      
      return false;
    } else {
      // Add interaction if it doesn't exist
      const insertPayload: any = {
        user_id: userId
      };
      
      // Set the proper ID field based on content type
      insertPayload[idField] = contentId;
      
      // Only add content_type for non-quote tables
      if (normalizedType !== 'quote') {
        insertPayload.content_type = normalizedType;
      }
      
      // Perform the insert operation - using type assertions to avoid TS errors
      const insertResult = await supabase
        .from(tableName as any)
        .insert(insertPayload);
      
      const insertError = insertResult.error;
      if (insertError) throw insertError;
      
      // Increment counter in the appropriate table
      const columnName = isLike ? typeInfo.likesColumnName : typeInfo.bookmarksColumnName;
      
      // Only update counters if the column exists
      if (columnName) {
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: columnName,
          table_name: typeInfo.contentTable
        });
      }
      
      return true;
    }
  } catch (error) {
    console.error(`[Supabase Utils] Error toggling ${type}:`, error);
    toast.error(`Could not ${type} the content. Please try again.`);
    return false;
  }
};

/**
 * Batch fetch operations for content interactions
 */
export const batchOperations = {
  // Implementation will go here
};
