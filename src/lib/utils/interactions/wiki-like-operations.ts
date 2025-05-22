
import { supabase } from '@/integrations/supabase/client';
import { incrementCounter, decrementCounter } from '../counter-operations';

/**
 * Add a wiki like
 * @param userId The user ID
 * @param contentId The wiki article ID
 * @returns Promise<boolean> indicating success
 */
export const addWikiLike = async (
  userId: string,
  contentId: string
): Promise<boolean> => {
  try {
    // Insert like record
    const { error } = await supabase
      .from('content_likes')
      .insert({
        content_id: contentId,
        user_id: userId,
        content_type: 'wiki'
      });
      
    if (error) throw error;
    
    // Increment the likes counter
    await incrementCounter(contentId, 'likes', 'wiki_articles');
    return true;
  } catch (error) {
    console.error('[Wiki] Error adding like:', error);
    return false;
  }
};

/**
 * Remove a wiki like
 * @param userId The user ID
 * @param contentId The wiki article ID
 * @returns Promise<boolean> indicating success
 */
export const removeWikiLike = async (
  userId: string,
  contentId: string
): Promise<boolean> => {
  try {
    // Delete like record
    const { error } = await supabase
      .from('content_likes')
      .delete()
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', 'wiki');
      
    if (error) throw error;
    
    // Decrement the likes counter
    await decrementCounter(contentId, 'likes', 'wiki_articles');
    return true;
  } catch (error) {
    console.error('[Wiki] Error removing like:', error);
    return false;
  }
};

/**
 * Add a wiki bookmark
 * @param userId The user ID
 * @param contentId The wiki article ID
 * @returns Promise<boolean> indicating success
 */
export const addWikiBookmark = async (
  userId: string,
  contentId: string
): Promise<boolean> => {
  try {
    // Insert bookmark record
    const { error } = await supabase
      .from('content_bookmarks')
      .insert({
        content_id: contentId,
        user_id: userId,
        content_type: 'wiki'
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('[Wiki] Error adding bookmark:', error);
    return false;
  }
};

/**
 * Remove a wiki bookmark
 * @param userId The user ID
 * @param contentId The wiki article ID
 * @returns Promise<boolean> indicating success
 */
export const removeWikiBookmark = async (
  userId: string,
  contentId: string
): Promise<boolean> => {
  try {
    // Delete bookmark record
    const { error } = await supabase
      .from('content_bookmarks')
      .delete()
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', 'wiki');
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('[Wiki] Error removing bookmark:', error);
    return false;
  }
};

/**
 * Check user interactions with wiki content
 * @param userId The user ID
 * @param contentId The wiki article ID
 * @returns Promise<{isLiked: boolean, isBookmarked: boolean}>
 */
export const checkWikiInteractions = async (
  userId: string,
  contentId: string
): Promise<{isLiked: boolean, isBookmarked: boolean}> => {
  try {
    // Default values
    let isLiked = false;
    let isBookmarked = false;
    
    // Check for like
    const { data: likeData } = await supabase
      .from('content_likes')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', 'wiki')
      .maybeSingle();
      
    if (likeData) {
      isLiked = true;
    }
    
    // Check for bookmark
    const { data: bookmarkData } = await supabase
      .from('content_bookmarks')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('content_type', 'wiki')
      .maybeSingle();
      
    if (bookmarkData) {
      isBookmarked = true;
    }
    
    return { isLiked, isBookmarked };
  } catch (error) {
    console.error('[Wiki] Error checking interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};
