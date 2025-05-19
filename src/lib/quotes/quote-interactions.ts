import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user has liked a specific quote
 */
export const checkUserLikedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    const { data, error } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking if user liked quote:', error);
    return false;
  }
};

/**
 * Check if the current user has bookmarked a specific quote
 */
export const checkUserBookmarkedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    const { data, error } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking if user bookmarked quote:', error);
    return false;
  }
};

/**
 * Like or unlike a quote
 */
export const likeQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    const { data: existingLike } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (existingLike) {
      // Unlike
      await supabase
        .from('quote_likes')
        .delete()
        .eq('id', existingLike.id);
      
      await supabase.rpc('decrement_counter', {
        row_id: quoteId,
        column_name: 'likes',
        table_name: 'quotes'
      });
      
      return false;
    } else {
      // Like
      await supabase
        .from('quote_likes')
        .insert({
          quote_id: quoteId,
          user_id: user.user.id
        });
      
      await supabase.rpc('increment_counter', {
        row_id: quoteId,
        column_name: 'likes',
        table_name: 'quotes'
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error liking quote:', error);
    throw error;
  }
};

/**
 * Bookmark or unbookmark a quote
 */
export const bookmarkQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    const { data: existingBookmark } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    if (existingBookmark) {
      // Remove bookmark
      await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
      
      await supabase.rpc('decrement_counter', {
        row_id: quoteId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
      
      return false;
    } else {
      // Add bookmark
      await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: quoteId,
          user_id: user.user.id
        });
      
      await supabase.rpc('increment_counter', {
        row_id: quoteId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error bookmarking quote:', error);
    throw error;
  }
};
