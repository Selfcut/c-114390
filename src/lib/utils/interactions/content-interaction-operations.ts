
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { incrementCounter, decrementCounter } from '../counter-operations';
import { getContentTable, getContentColumnName } from './content-type-utils';

/**
 * Check if a user has liked or bookmarked a piece of content
 */
export const checkContentInteractions = async (
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<{ isLiked: boolean, isBookmarked: boolean }> => {
  try {
    // Use separate queries for clarity
    const isQuote = contentType === 'quote';
    
    // Check likes - Using explicit type annotations to avoid deep type instantiation
    const likesTable = isQuote ? 'quote_likes' : 'content_likes';
    const likeIdColumn = isQuote ? 'quote_id' : 'content_id';
    
    // Use explicit type annotation for query result
    const likesQuery = await supabase
      .from(likesTable)
      .select('id')
      .eq(likeIdColumn, contentId)
      .eq('user_id', userId);
      
    if (likesQuery.error) throw likesQuery.error;
    
    // Check bookmarks - Using explicit type annotations to avoid deep type instantiation
    const bookmarksTable = isQuote ? 'quote_bookmarks' : 'content_bookmarks';
    const bookmarkIdColumn = isQuote ? 'quote_id' : 'content_id';
    
    // Use explicit type annotation for query result
    const bookmarksQuery = await supabase
      .from(bookmarksTable)
      .select('id')
      .eq(bookmarkIdColumn, contentId)
      .eq('user_id', userId);
    
    if (bookmarksQuery.error) throw bookmarksQuery.error;
    
    return {
      isLiked: likesQuery.data !== null && likesQuery.data.length > 0,
      isBookmarked: bookmarksQuery.data !== null && bookmarksQuery.data.length > 0
    };
  } catch (error) {
    console.error('Error checking content interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Add a like to content
 */
export const addContentLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    const isQuote = contentType === 'quote';
    
    if (isQuote) {
      // For quotes
      const { error } = await supabase
        .from('quote_likes')
        .insert({
          quote_id: contentId,
          user_id: userId
        });
        
      if (error) throw error;
    } else {
      // For other content
      const { error } = await supabase
        .from('content_likes')
        .insert({
          content_id: contentId,
          content_type: contentType,
          user_id: userId
        });
        
      if (error) throw error;
    }
    
    // Update content counter
    const tableName = getContentTable(contentType);
    const columnName = getContentColumnName(contentType);
    
    await incrementCounter(contentId, columnName, tableName);
    return true;
  } catch (error) {
    console.error('Error adding like:', error);
    return false;
  }
};

/**
 * Remove a like from content
 */
export const removeContentLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    const isQuote = contentType === 'quote';
    
    // Remove like record
    const likesTable = isQuote ? 'quote_likes' : 'content_likes';
    const likeIdColumn = isQuote ? 'quote_id' : 'content_id';
    
    const result = await supabase
      .from(likesTable)
      .delete()
      .eq(likeIdColumn, contentId)
      .eq('user_id', userId);
      
    if (result.error) throw result.error;
    
    // Update content counter
    const tableName = getContentTable(contentType);
    const columnName = getContentColumnName(contentType);
    
    await decrementCounter(contentId, columnName, tableName);
    return true;
  } catch (error) {
    console.error('Error removing like:', error);
    return false;
  }
};

/**
 * Add a bookmark to content
 */
export const addContentBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    const isQuote = contentType === 'quote';
    
    if (isQuote) {
      // For quotes
      const { error } = await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: contentId,
          user_id: userId
        });
        
      if (error) throw error;
      
      // Update bookmark counter for quotes
      await incrementCounter(contentId, 'bookmarks', 'quotes');
    } else {
      // For other content
      const { error } = await supabase
        .from('content_bookmarks')
        .insert({
          content_id: contentId,
          content_type: contentType,
          user_id: userId
        });
        
      if (error) throw error;
      
      // Note: Other content types might not track bookmark counts
    }
    
    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
};

/**
 * Remove a bookmark from content
 */
export const removeContentBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    const isQuote = contentType === 'quote';
    
    // Remove bookmark record
    const bookmarksTable = isQuote ? 'quote_bookmarks' : 'content_bookmarks';
    const bookmarkIdColumn = isQuote ? 'quote_id' : 'content_id';
    
    const result = await supabase
      .from(bookmarksTable)
      .delete()
      .eq(bookmarkIdColumn, contentId)
      .eq('user_id', userId);
      
    if (result.error) throw result.error;
    
    // Update bookmark counter for quotes
    if (isQuote) {
      await decrementCounter(contentId, 'bookmarks', 'quotes');
    }
    
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};
