
import { supabase } from '@/integrations/supabase/client';

// Export missing functions for backward compatibility
export const checkUserLikedQuote = async (quoteId: string, userId: string) => checkQuoteLike(quoteId, userId);
export const checkUserBookmarkedQuote = async (quoteId: string, userId: string) => checkQuoteBookmark(quoteId, userId);
export const likeQuote = async (quoteId: string, userId: string) => toggleQuoteLike(quoteId, userId);
export const bookmarkQuote = async (quoteId: string, userId: string) => toggleQuoteBookmark(quoteId, userId);

export const fetchComments = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from('quote_comments')
      .select(`
        id,
        content,
        user_id,
        created_at,
        updated_at,
        profiles:user_id (id, username, name, avatar_url)
      `)
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching quote comments:', error);
    return [];
  }
};

export const createComment = async (quoteId: string, userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('quote_comments')
      .insert({
        quote_id: quoteId,
        user_id: userId,
        content
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Increment comment count
    await supabase.rpc('increment_counter_fn', {
      row_id: quoteId,
      column_name: 'comments',
      table_name: 'quotes'
    });
    
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
};

export const deleteComment = async (commentId: string, quoteId: string) => {
  try {
    const { error } = await supabase
      .from('quote_comments')
      .delete()
      .eq('id', commentId);
      
    if (error) throw error;
    
    // Decrement comment count
    await supabase.rpc('decrement_counter_fn', {
      row_id: quoteId,
      column_name: 'comments',
      table_name: 'quotes'
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

export const subscribeToQuoteUpdates = (quoteId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`quote-updates-${quoteId}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'quotes', filter: `id=eq.${quoteId}` },
      payload => callback(payload)
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToQuoteInteractions = (quoteId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`quote-interactions-${quoteId}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'quote_comments', filter: `quote_id=eq.${quoteId}` },
      payload => callback(payload)
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

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
