
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user has liked or bookmarked a quote
 */
export const checkQuoteInteractions = async (
  userId: string, 
  quoteId: string
): Promise<{ isLiked: boolean, isBookmarked: boolean }> => {
  try {
    // Check if the user has liked the quote
    const { data: likeData, error: likeError } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', userId);
      
    if (likeError) throw likeError;
    
    // Check if the user has bookmarked the quote
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', userId);
    
    if (bookmarkError) throw bookmarkError;
    
    return {
      isLiked: likeData !== null && likeData.length > 0,
      isBookmarked: bookmarkData !== null && bookmarkData.length > 0
    };
  } catch (error) {
    console.error('Error checking quote interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Add a like to a quote with consistent function name
 */
export const addQuoteLike = async (
  userId: string,
  quoteId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quote_likes')
      .insert({
        quote_id: quoteId,
        user_id: userId
      });
      
    if (error) throw error;
    
    // Update like counter with consistent function name
    await supabase.rpc('increment_counter_fn', {
      row_id: quoteId,
      column_name: 'likes',
      table_name: 'quotes'
    });
    return true;
  } catch (error) {
    console.error('Error adding quote like:', error);
    return false;
  }
};

/**
 * Remove a like from a quote with consistent function name
 */
export const removeQuoteLike = async (
  userId: string,
  quoteId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quote_likes')
      .delete()
      .eq('quote_id', quoteId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Update like counter with consistent function name
    await supabase.rpc('decrement_counter_fn', {
      row_id: quoteId,
      column_name: 'likes',
      table_name: 'quotes'
    });
    return true;
  } catch (error) {
    console.error('Error removing quote like:', error);
    return false;
  }
};

/**
 * Add a bookmark to a quote with consistent function name
 */
export const addQuoteBookmark = async (
  userId: string,
  quoteId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quote_bookmarks')
      .insert({
        quote_id: quoteId,
        user_id: userId
      });
      
    if (error) throw error;
    
    // Update bookmark counter for quotes with consistent function name
    await supabase.rpc('increment_counter_fn', {
      row_id: quoteId,
      column_name: 'bookmarks',
      table_name: 'quotes'
    });
    return true;
  } catch (error) {
    console.error('Error adding quote bookmark:', error);
    return false;
  }
};

/**
 * Remove a bookmark from a quote with consistent function name
 */
export const removeQuoteBookmark = async (
  userId: string,
  quoteId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quote_bookmarks')
      .delete()
      .eq('quote_id', quoteId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Update bookmark counter with consistent function name
    await supabase.rpc('decrement_counter_fn', {
      row_id: quoteId,
      column_name: 'bookmarks',
      table_name: 'quotes'
    });
    return true;
  } catch (error) {
    console.error('Error removing quote bookmark:', error);
    return false;
  }
};
