
import { supabase } from '@/integrations/supabase/client';
import { getContentTable } from './contentTypeUtils';

/**
 * Check interactions for general content types
 */
export const checkGeneralContentInteractions = async (
  userId: string,
  contentId: string, 
  contentType: string
): Promise<{ isLiked: boolean, isBookmarked: boolean }> => {
  try {
    // Check for likes
    const { data: likeData, error: likeError } = await supabase
      .from('content_likes')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .maybeSingle();
    
    if (likeError) throw likeError;
    
    // Check for bookmarks
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('content_bookmarks')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .maybeSingle();
    
    if (bookmarkError) throw bookmarkError;
    
    return {
      isLiked: !!likeData,
      isBookmarked: !!bookmarkData
    };
  } catch (error) {
    console.error(`Error checking ${contentType} interactions:`, error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Add like to general content with consistent function name
 */
export const addGeneralContentLike = async (
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<boolean> => {
  try {
    // First, insert the like record
    const { error } = await supabase
      .from('content_likes')
      .insert({
        user_id: userId,
        content_id: contentId,
        content_type: contentType
      });
      
    if (error) throw error;
    
    // Get the table name for this content type
    const tableName = getContentTable(contentType);
    
    // Determine the column name (either 'likes' or 'upvotes')
    const columnName = contentType === 'forum' ? 'upvotes' : 'likes';
    
    // Update the likes/upvotes counter with consistent function name
    await supabase.rpc('increment_counter_fn', {
      row_id: contentId,
      column_name: columnName,
      table_name: tableName
    });
    
    return true;
  } catch (error) {
    console.error(`Error liking ${contentType}:`, error);
    return false;
  }
};

/**
 * Remove like from general content with consistent function name
 */
export const removeGeneralContentLike = async (
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<boolean> => {
  try {
    // Remove the like record
    const { error } = await supabase
      .from('content_likes')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentType);
      
    if (error) throw error;
    
    // Get the table name for this content type
    const tableName = getContentTable(contentType);
    
    // Determine the column name (either 'likes' or 'upvotes')
    const columnName = contentType === 'forum' ? 'upvotes' : 'likes';
    
    // Update the likes/upvotes counter with consistent function name
    await supabase.rpc('decrement_counter_fn', {
      row_id: contentId,
      column_name: columnName,
      table_name: tableName
    });
    
    return true;
  } catch (error) {
    console.error(`Error unliking ${contentType}:`, error);
    return false;
  }
};

/**
 * Add bookmark to general content with consistent function name
 */
export const addGeneralContentBookmark = async (
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<boolean> => {
  try {
    // Add the bookmark record
    const { error } = await supabase
      .from('content_bookmarks')
      .insert({
        user_id: userId,
        content_id: contentId,
        content_type: contentType
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error bookmarking ${contentType}:`, error);
    return false;
  }
};

/**
 * Remove bookmark from general content with consistent function name
 */
export const removeGeneralContentBookmark = async (
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<boolean> => {
  try {
    // Remove the bookmark record
    const { error } = await supabase
      .from('content_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentType);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error unbookmarking ${contentType}:`, error);
    return false;
  }
};
