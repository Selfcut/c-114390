
import { supabase } from '@/integrations/supabase/client';
import { QuoteComment } from './types';
import { incrementCounter, decrementCounter } from '@/lib/utils/supabase-utils';

/**
 * Check if a user has liked a specific quote
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
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking if user liked quote:', error);
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking if user liked quote:', error);
    return false;
  }
};

/**
 * Check if a user has bookmarked a specific quote
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
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking if user bookmarked quote:', error);
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking if user bookmarked quote:', error);
    return false;
  }
};

/**
 * Toggle like for a quote
 * @returns boolean - true if liked, false if unliked
 */
export const likeQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Check if user already liked this quote
    const isLiked = await checkUserLikedQuote(quoteId);
    
    if (isLiked) {
      // Unlike the quote
      const { error: deleteError } = await supabase
        .from('quote_likes')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', user.user.id);
      
      if (deleteError) throw deleteError;
      
      // Decrement likes count using utility function
      await decrementCounter(quoteId, 'likes', 'quotes');
      
      return false;
    } else {
      // Like the quote
      const { error: insertError } = await supabase
        .from('quote_likes')
        .insert({
          quote_id: quoteId,
          user_id: user.user.id
        });
      
      if (insertError) throw insertError;
      
      // Increment likes count using utility function
      await incrementCounter(quoteId, 'likes', 'quotes');
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling quote like:', error);
    throw error;
  }
};

/**
 * Toggle bookmark for a quote
 * @returns boolean - true if bookmarked, false if unbookmarked
 */
export const bookmarkQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Check if user already bookmarked this quote
    const isBookmarked = await checkUserBookmarkedQuote(quoteId);
    
    if (isBookmarked) {
      // Remove the bookmark
      const { error: deleteError } = await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', user.user.id);
      
      if (deleteError) throw deleteError;
      
      // Decrement bookmarks count using utility function
      await decrementCounter(quoteId, 'bookmarks', 'quotes');
      
      return false;
    } else {
      // Add the bookmark
      const { error: insertError } = await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: quoteId,
          user_id: user.user.id
        });
      
      if (insertError) throw insertError;
      
      // Increment bookmarks count using utility function
      await incrementCounter(quoteId, 'bookmarks', 'quotes');
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling quote bookmark:', error);
    throw error;
  }
};

/**
 * Fetch comments for a specific quote
 */
export const fetchComments = async (quoteId: string): Promise<QuoteComment[]> => {
  try {
    // First fetch all comments for the quote
    const { data: commentData, error: commentError } = await supabase
      .from('quote_comments')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false });
    
    if (commentError) throw commentError;
    
    if (!commentData || commentData.length === 0) {
      return [];
    }
    
    // Then fetch user data for each comment
    const comments: QuoteComment[] = [];
    
    for (const comment of commentData) {
      // Get the user data for this comment
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url, status')
        .eq('id', comment.user_id)
        .single();
      
      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user data for comment:', userError);
      }
      
      // Add the comment with user data to the array
      comments.push({
        ...comment,
        user: userData || {
          id: comment.user_id,
          username: 'unknown',
          name: 'Unknown User',
          avatar_url: null,
          status: 'offline'
        }
      });
    }
    
    return comments;
  } catch (error) {
    console.error('Error fetching quote comments:', error);
    return [];
  }
};

/**
 * Create a new comment for a quote
 */
export const createComment = async (quoteId: string, content: string): Promise<QuoteComment | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Insert the new comment
    const { data: commentData, error: commentError } = await supabase
      .from('quote_comments')
      .insert({
        quote_id: quoteId,
        user_id: user.user.id,
        content
      })
      .select()
      .single();
    
    if (commentError) throw commentError;
    
    // Increment comments count using utility function
    await incrementCounter(quoteId, 'comments', 'quotes');
    
    // Fetch the user data to return with the comment
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, username, name, avatar_url, status')
      .eq('id', user.user.id)
      .single();
    
    if (userError) throw userError;
    
    // Return the complete comment with user data
    return {
      ...commentData,
      user: userData
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Get the comment to check ownership and get the quote_id
    const { data: comment, error: fetchError } = await supabase
      .from('quote_comments')
      .select('quote_id, user_id')
      .eq('id', commentId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Check if user owns the comment or is an admin
    if (comment.user_id !== user.user.id) {
      // For admin checks, we could add additional logic here
      throw new Error('Not authorized to delete this comment');
    }
    
    // Delete the comment
    const { error: deleteError } = await supabase
      .from('quote_comments')
      .delete()
      .eq('id', commentId);
    
    if (deleteError) throw deleteError;
    
    // Decrement comments count using utility function
    await decrementCounter(comment.quote_id, 'comments', 'quotes');
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};

/**
 * Subscribe to real-time quote updates
 */
export const subscribeToQuoteUpdates = (
  quoteId: string | null, 
  callback: (payload: any) => void
): (() => void) => {
  // Create a channel for listening to quote updates
  const channel = supabase
    .channel(`quotes:${quoteId || 'all'}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quotes',
        ...(quoteId ? { filter: `id=eq.${quoteId}` } : {})
      },
      (payload) => {
        callback({
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old
        });
      }
    )
    .subscribe();
  
  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to quote interactions (likes and bookmarks)
 */
export const subscribeToQuoteInteractions = (
  userId: string,
  likesCallback: (payload: any) => void,
  bookmarksCallback: (payload: any) => void
): (() => void) => {
  // Create a channel for likes
  const likesChannel = supabase
    .channel(`quote_likes:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quote_likes',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        likesCallback({
          eventType: payload.eventType,
          new: payload.new || {},
          old: payload.old || {}
        });
      }
    )
    .subscribe();
  
  // Create a channel for bookmarks
  const bookmarksChannel = supabase
    .channel(`quote_bookmarks:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quote_bookmarks',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        bookmarksCallback({
          eventType: payload.eventType,
          new: payload.new || {},
          old: payload.old || {}
        });
      }
    )
    .subscribe();
  
  // Return cleanup function
  return () => {
    supabase.removeChannel(likesChannel);
    supabase.removeChannel(bookmarksChannel);
  };
};

// Create quote (local version used for testing/mocking)
export const createQuote = async (quoteData: any): Promise<any> => {
  // This is just for completeness as the real one is exported as createQuoteSubmission
  // from quotes-service.ts - see re-exports in index.ts
  console.warn('Using test version of createQuote - use createQuoteSubmission instead');
  return null;
};
