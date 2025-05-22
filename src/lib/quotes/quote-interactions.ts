
import { supabase } from '@/integrations/supabase/client';

/**
 * Toggle a like on a quote
 * 
 * @param quoteId - The ID of the quote to like/unlike
 * @param userId - The ID of the user performing the action
 * @returns A promise that resolves to a boolean indicating the new like state
 */
export const toggleQuoteLike = async (
  quoteId: string,
  userId: string
): Promise<boolean> => {
  if (!quoteId || !userId) return false;
  
  try {
    // Check if the user already liked this quote
    const { data: existingLike, error: checkError } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingLike) {
      // Unlike - remove the like
      const { error: unlikeError } = await supabase
        .from('quote_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (unlikeError) throw unlikeError;
      
      // Decrement likes count on quotes table
      await supabase.rpc('decrement_counter_fn', {
        row_id: quoteId,
        column_name: 'likes',
        table_name: 'quotes'
      });
      
      return false;
    } else {
      // Like - add a new like
      const { error: likeError } = await supabase
        .from('quote_likes')
        .insert({
          quote_id: quoteId,
          user_id: userId
        });
        
      if (likeError) throw likeError;
      
      // Increment likes count on quotes table
      await supabase.rpc('increment_counter_fn', {
        row_id: quoteId,
        column_name: 'likes',
        table_name: 'quotes'
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling quote like:', error);
    return false;
  }
};

/**
 * Toggle a bookmark on a quote
 * 
 * @param quoteId - The ID of the quote to bookmark/unbookmark
 * @param userId - The ID of the user performing the action
 * @returns A promise that resolves to a boolean indicating the new bookmark state
 */
export const toggleQuoteBookmark = async (
  quoteId: string,
  userId: string
): Promise<boolean> => {
  if (!quoteId || !userId) return false;
  
  try {
    // Check if the user already bookmarked this quote
    const { data: existingBookmark, error: checkError } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingBookmark) {
      // Unbookmark - remove the bookmark
      const { error: unbookmarkError } = await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
        
      if (unbookmarkError) throw unbookmarkError;
      
      // Decrement bookmarks count on quotes table
      await supabase.rpc('decrement_counter_fn', {
        row_id: quoteId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
      
      return false;
    } else {
      // Bookmark - add a new bookmark
      const { error: bookmarkError } = await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: quoteId,
          user_id: userId
        });
        
      if (bookmarkError) throw bookmarkError;
      
      // Increment bookmarks count on quotes table
      await supabase.rpc('increment_counter_fn', {
        row_id: quoteId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling quote bookmark:', error);
    return false;
  }
};

/**
 * Check if a user has liked a quote
 * 
 * @param quoteId - The ID of the quote
 * @param userId - The ID of the user
 * @returns A promise that resolves to a boolean indicating if the user liked the quote
 */
export const checkQuoteLike = async (
  quoteId: string,
  userId: string
): Promise<boolean> => {
  if (!quoteId || !userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking quote like:', error);
    return false;
  }
};

/**
 * Check if a user has bookmarked a quote
 * 
 * @param quoteId - The ID of the quote
 * @param userId - The ID of the user
 * @returns A promise that resolves to a boolean indicating if the user bookmarked the quote
 */
export const checkQuoteBookmark = async (
  quoteId: string,
  userId: string
): Promise<boolean> => {
  if (!quoteId || !userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking quote bookmark:', error);
    return false;
  }
};
