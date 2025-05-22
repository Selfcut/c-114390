
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
    
    // Check likes
    const { data: likeData } = await supabase
      .from(isQuote ? 'quote_likes' : 'content_likes')
      .select('id')
      .eq(isQuote ? 'quote_id' : 'content_id', contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    // Check bookmarks
    const { data: bookmarkData } = await supabase
      .from(isQuote ? 'quote_bookmarks' : 'content_bookmarks')
      .select('id')
      .eq(isQuote ? 'quote_id' : 'content_id', contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    return {
      isLiked: !!likeData,
      isBookmarked: !!bookmarkData
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
    const { error } = await supabase
      .from(isQuote ? 'quote_likes' : 'content_likes')
      .delete()
      .eq(isQuote ? 'quote_id' : 'content_id', contentId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
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
    const { error } = await supabase
      .from(isQuote ? 'quote_bookmarks' : 'content_bookmarks')
      .delete()
      .eq(isQuote ? 'quote_id' : 'content_id', contentId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
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
