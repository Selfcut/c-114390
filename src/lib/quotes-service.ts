
import { supabase } from "@/integrations/supabase/client";

// Function to like a quote
export const likeQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Check if user already liked this quote
    const { data: existingLike } = await supabase
      .from('quote_likes')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .single();
    
    // If already liked, unlike it
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('quote_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (deleteError) throw deleteError;
      
      // Update quote likes count
      await supabase.rpc('decrement_quote_likes', { quote_id: quoteId }).single();
      
      return false;
    }
    
    // If not liked, add like
    const { error } = await supabase
      .from('quote_likes')
      .insert({
        quote_id: quoteId,
        user_id: user.id
      });
    
    if (error) throw error;
    
    // Update quote likes count
    await supabase.rpc('increment_quote_likes', { quote_id: quoteId }).single();
    
    return true;
  } catch (error) {
    console.error("Error liking quote:", error);
    throw error;
  }
};

// Function to bookmark a quote
export const bookmarkQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Check if user already bookmarked this quote
    const { data: existingBookmark } = await supabase
      .from('quote_bookmarks')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .single();
    
    // If already bookmarked, remove bookmark
    if (existingBookmark) {
      const { error: deleteError } = await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
      
      if (deleteError) throw deleteError;
      
      // Update quote bookmarks count
      await supabase.rpc('decrement_quote_bookmarks', { quote_id: quoteId }).single();
      
      return false;
    }
    
    // If not bookmarked, add bookmark
    const { error } = await supabase
      .from('quote_bookmarks')
      .insert({
        quote_id: quoteId,
        user_id: user.id
      });
    
    if (error) throw error;
    
    // Update quote bookmarks count
    await supabase.rpc('increment_quote_bookmarks', { quote_id: quoteId }).single();
    
    return true;
  } catch (error) {
    console.error("Error bookmarking quote:", error);
    throw error;
  }
};

// Function to check if user has liked a quote
export const checkUserLikedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check if user liked this quote
    const { data } = await supabase
      .from('quote_likes')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .single();
    
    return !!data;
  } catch (error) {
    console.error("Error checking if user liked quote:", error);
    return false;
  }
};

// Function to check if user has bookmarked a quote
export const checkUserBookmarkedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check if user bookmarked this quote
    const { data } = await supabase
      .from('quote_bookmarks')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .single();
    
    return !!data;
  } catch (error) {
    console.error("Error checking if user bookmarked quote:", error);
    return false;
  }
};

// Function to add a comment to a quote
export const addCommentToQuote = async (quoteId: string, content: string): Promise<any> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Insert new comment
    const { data, error } = await supabase
      .from('quote_comments')
      .insert({
        quote_id: quoteId,
        user_id: user.id,
        content
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update quote comments count
    try {
      await supabase.rpc('increment_quote_comments', { quote_id: quoteId });
    } catch (error) {
      console.error("Error incrementing comments count:", error);
    }
    
    return data;
  } catch (error) {
    console.error("Error adding comment to quote:", error);
    throw error;
  }
};

// Get quote comments
export const getQuoteComments = async (quoteId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('quote_comments')
      .select(`
        *,
        profiles:user_id (
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
    console.error("Error fetching quote comments:", error);
    return [];
  }
};

// Get quotes by category or tag
export const getQuotesByFilter = async (filterType: 'category' | 'tag', filterValue: string): Promise<any[]> => {
  try {
    let query = supabase
      .from('quotes')
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url,
          username,
          status
        )
      `);
    
    if (filterType === 'category') {
      query = query.eq('category', filterValue);
    } else if (filterType === 'tag') {
      query = query.contains('tags', [filterValue]);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching quotes by ${filterType}:`, error);
    return [];
  }
};

// Utility function to handle incrementing a counter with RPC
const incrementCounter = async (rpcName: string, params: Record<string, any>) => {
  try {
    await supabase.rpc(rpcName, params);
    return true;
  } catch (error) {
    console.error(`Error calling RPC ${rpcName}:`, error);
    return false;
  }
};

// Utility function to handle decrementing a counter with RPC
const decrementCounter = async (rpcName: string, params: Record<string, any>) => {
  try {
    await supabase.rpc(rpcName, params);
    return true;
  } catch (error) {
    console.error(`Error calling RPC ${rpcName}:`, error);
    return false;
  }
};
