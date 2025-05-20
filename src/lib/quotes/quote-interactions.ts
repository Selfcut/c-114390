
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { incrementCounter, decrementCounter } from '@/lib/utils/supabase-utils';

// Check if a user has liked a quote
export const checkUserLikedQuote = async (quoteId: string, userId?: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('quote_likes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking if quote is liked:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkUserLikedQuote:', error);
    return false;
  }
};

// Check if a user has bookmarked a quote
export const checkUserBookmarkedQuote = async (quoteId: string, userId?: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('quote_bookmarks')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking if quote is bookmarked:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkUserBookmarkedQuote:', error);
    return false;
  }
};

export const likeQuote = async (quoteId: string, userId?: string): Promise<boolean> => {
  if (!userId) {
    toast.error('You must be logged in to like quotes');
    return false;
  }

  try {
    // Check if user already liked this quote
    const { data: existingLike, error: checkError } = await supabase
      .from('quote_likes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    // If already liked, remove the like
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('quote_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (deleteError) throw deleteError;
      
      // Decrement the likes counter
      await decrementCounter(quoteId, 'likes', 'quotes');
      
      return false;
    }
    
    // If not liked, add a like
    const { error: insertError } = await supabase
      .from('quote_likes')
      .insert({
        quote_id: quoteId,
        user_id: userId
      });
    
    if (insertError) throw insertError;
    
    // Increment the likes counter
    await incrementCounter(quoteId, 'likes', 'quotes');
    
    return true;
  } catch (error) {
    console.error('Error liking quote:', error);
    toast.error('Failed to like quote');
    return false;
  }
};

export const bookmarkQuote = async (quoteId: string, userId?: string): Promise<boolean> => {
  if (!userId) {
    toast.error('You must be logged in to bookmark quotes');
    return false;
  }

  try {
    // Check if user already bookmarked this quote
    const { data: existingBookmark, error: checkError } = await supabase
      .from('quote_bookmarks')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    // If already bookmarked, remove the bookmark
    if (existingBookmark) {
      const { error: deleteError } = await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
      
      if (deleteError) throw deleteError;
      
      // Decrement the bookmarks counter
      await decrementCounter(quoteId, 'bookmarks', 'quotes');
      
      return false;
    }
    
    // If not bookmarked, add a bookmark
    const { error: insertError } = await supabase
      .from('quote_bookmarks')
      .insert({
        quote_id: quoteId,
        user_id: userId
      });
    
    if (insertError) throw insertError;
    
    // Increment the bookmarks counter
    await incrementCounter(quoteId, 'bookmarks', 'quotes');
    
    return true;
  } catch (error) {
    console.error('Error bookmarking quote:', error);
    toast.error('Failed to bookmark quote');
    return false;
  }
};

// Fetch comments for a quote
export const fetchComments = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from('quote_comments')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar_url,
          username
        )
      `)
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    toast.error('Failed to load comments');
    return [];
  }
};

// Create a new comment
export const createComment = async (quoteId: string, userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('quote_comments')
      .insert({
        quote_id: quoteId,
        user_id: userId,
        content
      })
      .select();
    
    if (error) throw error;
    
    // Increment comment count on the quote
    await incrementCounter(quoteId, 'comments', 'quotes');
    
    return data?.[0];
  } catch (error) {
    console.error('Error creating comment:', error);
    toast.error('Failed to post comment');
    return null;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string, quoteId: string) => {
  try {
    const { error } = await supabase
      .from('quote_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
    
    // Decrement comment count on the quote
    await decrementCounter(quoteId, 'comments', 'quotes');
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    toast.error('Failed to delete comment');
    return false;
  }
};

// Subscribe to real-time updates for a quote
export const subscribeToQuoteUpdates = (quoteId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(`quote:${quoteId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'quotes',
      filter: `id=eq.${quoteId}`
    }, callback)
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

// Subscribe to real-time updates for quote interactions
export const subscribeToQuoteInteractions = (quoteId: string, callback: (payload: any) => void) => {
  const likesChannel = supabase
    .channel(`quote_likes:${quoteId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'quote_likes',
      filter: `quote_id=eq.${quoteId}`
    }, callback)
    .subscribe();
  
  const bookmarksChannel = supabase
    .channel(`quote_bookmarks:${quoteId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'quote_bookmarks',
      filter: `quote_id=eq.${quoteId}`
    }, callback)
    .subscribe();
  
  return () => {
    supabase.removeChannel(likesChannel);
    supabase.removeChannel(bookmarksChannel);
  };
};
