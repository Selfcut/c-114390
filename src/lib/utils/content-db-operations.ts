
import { supabase } from '@/integrations/supabase/client';
import { normalizeContentType, getContentTableInfo } from './content-type-utils';
import { ContentType } from '@/types/contentTypes';

/**
 * Error handler for database operations
 */
const handleDbError = (error: any, operation: string, fallbackValue: any = null): any => {
  console.error(`Database error during ${operation}:`, error);
  return fallbackValue;
};

/**
 * Interface for user interaction check results
 */
export interface UserInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * Check if a user has liked or bookmarked a content item
 */
export const checkUserInteractions = async (
  userId: string, 
  contentId: string, 
  contentType: string | ContentType
): Promise<UserInteractionStatus> => {
  if (!userId || !contentId) {
    return { isLiked: false, isBookmarked: false };
  }

  try {
    const normalizedType = normalizeContentType(contentType);
    const { likesTable, bookmarksTable, contentIdField } = getContentTableInfo(normalizedType);
    
    // Check if user has liked the content
    const { data: likeData, error: likeError } = await supabase
      .from(likesTable)
      .select('id')
      .eq(contentIdField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (likeError) throw likeError;
    
    // Check if user has bookmarked the content
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from(bookmarksTable)
      .select('id')
      .eq(contentIdField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (bookmarkError) throw bookmarkError;
    
    return {
      isLiked: !!likeData,
      isBookmarked: !!bookmarkData
    };
  } catch (error) {
    console.error('Error checking user interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Toggle a user's like status for content
 */
export const toggleLike = async (
  userId: string,
  contentId: string,
  contentType: string | ContentType
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const normalizedType = normalizeContentType(contentType);
    const { 
      contentTable, 
      likesTable, 
      contentIdField, 
      likesColumnName 
    } = getContentTableInfo(normalizedType);
    
    // Check if the user has already liked this content
    const { data: existingLike, error: checkError } = await supabase
      .from(likesTable)
      .select('id')
      .eq(contentIdField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If like exists, remove it
    if (existingLike && 'id' in existingLike) {
      const { error: deleteError } = await supabase
        .from(likesTable)
        .delete()
        .eq('id', existingLike.id);
        
      if (deleteError) throw deleteError;
      
      // Decrement the like counter
      await supabase.rpc('decrement_counter_fn', {
        row_id: contentId,
        column_name: likesColumnName,
        table_name: contentTable
      });
      
      return false; // No longer liked
    } else {
      // Insert new like
      const payload: Record<string, any> = {
        user_id: userId,
      };
      
      // Set the correct ID field based on content type
      payload[contentIdField] = contentId;
      
      // Add content_type for non-quote content
      if (normalizedType !== 'quote') {
        payload.content_type = normalizedType;
      }
      
      const { error: insertError } = await supabase
        .from(likesTable)
        .insert(payload);
        
      if (insertError) throw insertError;
      
      // Increment the like counter
      await supabase.rpc('increment_counter_fn', {
        row_id: contentId,
        column_name: likesColumnName,
        table_name: contentTable
      });
      
      return true; // Now liked
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
};

/**
 * Toggle a user's bookmark status for content
 */
export const toggleBookmark = async (
  userId: string,
  contentId: string,
  contentType: string | ContentType
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const normalizedType = normalizeContentType(contentType);
    const { 
      contentTable, 
      bookmarksTable, 
      contentIdField, 
      bookmarksColumnName 
    } = getContentTableInfo(normalizedType);
    
    // Check if the user has already bookmarked this content
    const { data: existingBookmark, error: checkError } = await supabase
      .from(bookmarksTable)
      .select('id')
      .eq(contentIdField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If bookmark exists, remove it
    if (existingBookmark && 'id' in existingBookmark) {
      const { error: deleteError } = await supabase
        .from(bookmarksTable)
        .delete()
        .eq('id', existingBookmark.id);
        
      if (deleteError) throw deleteError;
      
      // Only decrement counter if the column exists for this content type
      if (bookmarksColumnName) {
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: bookmarksColumnName,
          table_name: contentTable
        });
      }
      
      return false; // No longer bookmarked
    } else {
      // Insert new bookmark
      const payload: Record<string, any> = {
        user_id: userId,
      };
      
      // Set the correct ID field based on content type
      payload[contentIdField] = contentId;
      
      // Add content_type for non-quote content
      if (normalizedType !== 'quote') {
        payload.content_type = normalizedType;
      }
      
      const { error: insertError } = await supabase
        .from(bookmarksTable)
        .insert(payload);
        
      if (insertError) throw insertError;
      
      // Only increment counter if the column exists for this content type
      if (bookmarksColumnName) {
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: bookmarksColumnName,
          table_name: contentTable
        });
      }
      
      return true; // Now bookmarked
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};

/**
 * Batch check for user interactions on multiple content items
 */
export const batchCheckInteractions = async (
  userId: string,
  contentIds: string[],
  contentType: string | ContentType
): Promise<Record<string, UserInteractionStatus>> => {
  if (!userId || !contentIds.length) return {};
  
  try {
    const normalizedType = normalizeContentType(contentType);
    const { likesTable, bookmarksTable, contentIdField } = getContentTableInfo(normalizedType);
    const result: Record<string, UserInteractionStatus> = {};
    
    // Initialize default values
    contentIds.forEach(id => {
      result[id] = { isLiked: false, isBookmarked: false };
    });
    
    // Batch check likes
    const { data: likesData, error: likesError } = await supabase
      .from(likesTable)
      .select('id, ' + contentIdField)
      .eq('user_id', userId)
      .in(contentIdField, contentIds);
      
    if (!likesError && likesData) {
      likesData.forEach(like => {
        const contentId = like[contentIdField as keyof typeof like] as string;
        if (result[contentId]) {
          result[contentId].isLiked = true;
        }
      });
    }
    
    // Batch check bookmarks
    const { data: bookmarksData, error: bookmarksError } = await supabase
      .from(bookmarksTable)
      .select('id, ' + contentIdField)
      .eq('user_id', userId)
      .in(contentIdField, contentIds);
      
    if (!bookmarksError && bookmarksData) {
      bookmarksData.forEach(bookmark => {
        const contentId = bookmark[contentIdField as keyof typeof bookmark] as string;
        if (result[contentId]) {
          result[contentId].isBookmarked = true;
        }
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error batch checking interactions:', error);
    return {};
  }
};
