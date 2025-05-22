
import { supabase } from '@/integrations/supabase/client';
import { incrementCounter, decrementCounter } from '../counter-operations';
import { getContentTable, getContentColumnName } from './content-type-utils';

/**
 * Check if a user has liked or bookmarked a piece of content (not quotes)
 */
export const checkGeneralContentInteractions = async (
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<{ isLiked: boolean, isBookmarked: boolean }> => {
  try {
    // Check if the user has liked the content
    const { data: likeData, error: likeError } = await supabase
      .from('content_likes')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', contentType);
      
    if (likeError) throw likeError;
    
    // Check if the user has bookmarked the content
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('content_bookmarks')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', contentType);
    
    if (bookmarkError) throw bookmarkError;
    
    return {
      isLiked: likeData !== null && likeData.length > 0,
      isBookmarked: bookmarkData !== null && bookmarkData.length > 0
    };
  } catch (error) {
    console.error('Error checking content interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Add a like to general content (not quotes)
 */
export const addGeneralContentLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    // Add the like record
    const { error } = await supabase
      .from('content_likes')
      .insert({
        content_id: contentId,
        content_type: contentType,
        user_id: userId
      });
      
    if (error) throw error;
    
    // Update content counter
    const tableName = getContentTable(contentType);
    const columnName = getContentColumnName(contentType);
    
    await incrementCounter(contentId, columnName, tableName);
    return true;
  } catch (error) {
    console.error('Error adding content like:', error);
    return false;
  }
};

/**
 * Remove a like from general content (not quotes)
 */
export const removeGeneralContentLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    // Remove like record
    const { error } = await supabase
      .from('content_likes')
      .delete()
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', contentType);
      
    if (error) throw error;
    
    // Update content counter
    const tableName = getContentTable(contentType);
    const columnName = getContentColumnName(contentType);
    
    await decrementCounter(contentId, columnName, tableName);
    return true;
  } catch (error) {
    console.error('Error removing content like:', error);
    return false;
  }
};

/**
 * Add a bookmark to general content (not quotes)
 */
export const addGeneralContentBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    // Add bookmark record
    const { error } = await supabase
      .from('content_bookmarks')
      .insert({
        content_id: contentId,
        content_type: contentType,
        user_id: userId
      });
      
    if (error) throw error;
    
    // Note: Most content types don't track bookmark counts
    return true;
  } catch (error) {
    console.error('Error adding content bookmark:', error);
    return false;
  }
};

/**
 * Remove a bookmark from general content (not quotes)
 */
export const removeGeneralContentBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    // Remove bookmark record
    const { error } = await supabase
      .from('content_bookmarks')
      .delete()
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', contentType);
      
    if (error) throw error;
    
    // Note: Most content types don't track bookmark counts
    return true;
  } catch (error) {
    console.error('Error removing content bookmark:', error);
    return false;
  }
};
