
import { supabase } from '@/integrations/supabase/client';
import { QuoteComment } from './types';

/**
 * Toggle like status for a quote
 */
export const likeQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    // Check if user already liked the quote
    const { data: existingLike } = await supabase
      .from('quote_likes')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    // If liked, unlike by deleting the record
    if (existingLike) {
      await supabase
        .from('quote_likes')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', userId);
      
      // Update like count on the quote
      await supabase.rpc('decrement_counter', {
        row_id: quoteId,
        column_name: 'likes',
        table_name: 'quotes'
      });
      
      return false;
    }
    // If not liked, add a like record
    else {
      await supabase
        .from('quote_likes')
        .insert({
          quote_id: quoteId,
          user_id: userId
        });
      
      // Update like count on the quote
      await supabase.rpc('increment_counter', {
        row_id: quoteId,
        column_name: 'likes',
        table_name: 'quotes'
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling quote like:', error);
    throw error;
  }
};

/**
 * Toggle bookmark status for a quote
 */
export const bookmarkQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const userId = userData.user.id;
    
    // Check if user already bookmarked the quote
    const { data: existingBookmark } = await supabase
      .from('quote_bookmarks')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    // If bookmarked, remove bookmark by deleting the record
    if (existingBookmark) {
      await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', userId);
      
      // Update bookmark count on the quote
      await supabase.rpc('decrement_counter', {
        row_id: quoteId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
      
      return false;
    }
    // If not bookmarked, add a bookmark record
    else {
      await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: quoteId,
          user_id: userId
        });
      
      // Update bookmark count on the quote
      await supabase.rpc('increment_counter', {
        row_id: quoteId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling quote bookmark:', error);
    throw error;
  }
};

/**
 * Check if a user has liked a quote
 */
export const checkUserLikedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    
    const { data, error } = await supabase
      .from('quote_likes')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', userData.user.id)
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking if user liked quote:', error);
    return false;
  }
};

/**
 * Check if a user has bookmarked a quote
 */
export const checkUserBookmarkedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    
    const { data, error } = await supabase
      .from('quote_bookmarks')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', userData.user.id)
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking if user bookmarked quote:', error);
    return false;
  }
};

/**
 * Subscribe to quote updates
 */
export const subscribeToQuoteUpdates = (
  quoteId: string | null,
  callback: (payload: any) => void
): (() => void) => {
  let channel: any;
  
  if (quoteId) {
    // Subscribe to updates for a specific quote
    channel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes',
          filter: `id=eq.${quoteId}`
        },
        callback
      )
      .subscribe();
  } else {
    // Subscribe to all quote updates
    channel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        callback
      )
      .subscribe();
  }
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to quote interactions (likes, bookmarks)
 */
export const subscribeToQuoteInteractions = (
  userId: string,
  likesCallback: (payload: any) => void,
  bookmarksCallback: (payload: any) => void
): (() => void) => {
  // Subscribe to likes changes
  const likesChannel = supabase
    .channel('quote-likes-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quote_likes',
        filter: `user_id=eq.${userId}`
      },
      likesCallback
    )
    .subscribe();
  
  // Subscribe to bookmarks changes
  const bookmarksChannel = supabase
    .channel('quote-bookmarks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quote_bookmarks',
        filter: `user_id=eq.${userId}`
      },
      bookmarksCallback
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(likesChannel);
    supabase.removeChannel(bookmarksChannel);
  };
};

/**
 * Create quote comment
 */
export const createComment = async (quoteId: string, content: string): Promise<QuoteComment | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('quote_comments')
      .insert({
        quote_id: quoteId,
        user_id: userData.user.id,
        content
      })
      .select(`
        *,
        user:profiles(id, name, username, avatar_url, status)
      `)
      .single();
    
    if (error) throw error;
    
    // Update comment count on the quote
    await supabase.rpc('increment_counter', {
      row_id: quoteId,
      column_name: 'comments',
      table_name: 'quotes'
    });
    
    return data as unknown as QuoteComment;
  } catch (error) {
    console.error('Error creating quote comment:', error);
    return null;
  }
};

/**
 * Fetch comments for a quote
 */
export const fetchComments = async (quoteId: string): Promise<QuoteComment[]> => {
  try {
    const { data, error } = await supabase
      .from('quote_comments')
      .select(`
        *,
        user:profiles(id, name, username, avatar_url, status)
      `)
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as unknown as QuoteComment[];
  } catch (error) {
    console.error('Error fetching quote comments:', error);
    return [];
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string, quoteId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');
    
    // Check if user is the author of the comment
    const { data: comment } = await supabase
      .from('quote_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();
    
    if (comment.user_id !== userData.user.id) {
      throw new Error('Not authorized to delete this comment');
    }
    
    const { error } = await supabase
      .from('quote_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
    
    // Update comment count on the quote
    await supabase.rpc('decrement_counter', {
      row_id: quoteId,
      column_name: 'comments',
      table_name: 'quotes'
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting quote comment:', error);
    return false;
  }
};

/**
 * Create a new quote
 */
export const createQuote = async (quoteData: any): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('quotes')
      .insert({
        ...quoteData,
        user_id: user.user.id
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating quote:', error);
    return false;
  }
};
