
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./auth/types";

export interface QuoteWithUser {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags: string[];
  likes: number;
  bookmarks: number;
  comments: number;
  user?: {
    id: string;
    name: string;
    username?: string;
    avatar_url?: string;
    status?: string;
  };
  created_at: string;
}

// Fetch all quotes with user data
export const fetchQuotes = async (): Promise<QuoteWithUser[]> => {
  try {
    // We can't directly join with profiles because of the error in the console
    // So first fetch all quotes
    const { data: quotesData, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (quotesError) throw quotesError;
    
    // Then fetch user profiles for each quote if needed
    const quotes: QuoteWithUser[] = await Promise.all(
      quotesData.map(async (quote) => {
        let userData = null;
        
        if (quote.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, name, username, avatar_url, status')
            .eq('id', quote.user_id)
            .single();
            
          userData = profileData;
        }
        
        return {
          id: quote.id,
          text: quote.text,
          author: quote.author,
          source: quote.source || undefined,
          tags: quote.tags || [],
          likes: quote.likes || 0,
          bookmarks: quote.bookmarks || 0,
          comments: quote.comments || 0,
          created_at: quote.created_at,
          user: userData ? {
            id: userData.id,
            name: userData.name,
            username: userData.username,
            avatar_url: userData.avatar_url,
            status: userData.status
          } : undefined
        };
      })
    );
    
    return quotes;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
};

// Fetch quotes with filters
export const fetchQuotesWithFilters = async (
  category?: string,
  tags?: string[],
  search?: string
): Promise<QuoteWithUser[]> => {
  try {
    let query = supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (category) {
      query = query.eq('category', category);
    }
    
    if (tags && tags.length > 0) {
      // For each tag, we want to check if it's in the tags array
      // This uses the Postgres array contains operator
      tags.forEach(tag => {
        query = query.contains('tags', [tag]);
      });
    }
    
    if (search) {
      query = query.or(`text.ilike.%${search}%,author.ilike.%${search}%`);
    }
    
    const { data: quotesData, error: quotesError } = await query;
    
    if (quotesError) throw quotesError;
    
    // Then fetch user profiles for each quote
    const quotes: QuoteWithUser[] = await Promise.all(
      quotesData.map(async (quote) => {
        let userData = null;
        
        if (quote.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, name, username, avatar_url, status')
            .eq('id', quote.user_id)
            .single();
            
          userData = profileData;
        }
        
        return {
          id: quote.id,
          text: quote.text,
          author: quote.author,
          source: quote.source || undefined,
          tags: quote.tags || [],
          likes: quote.likes || 0,
          bookmarks: quote.bookmarks || 0,
          comments: quote.comments || 0,
          created_at: quote.created_at,
          user: userData ? {
            id: userData.id,
            name: userData.name,
            username: userData.username,
            avatar_url: userData.avatar_url,
            status: userData.status
          } : undefined
        };
      })
    );
    
    return quotes;
  } catch (error) {
    console.error("Error fetching quotes with filters:", error);
    throw error;
  }
};

// Create a new quote
export const createQuote = async (
  text: string,
  author: string,
  source: string = "",
  category: string,
  tags: string[] = []
): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('quotes')
      .insert({
        text,
        author,
        source,
        category,
        tags,
        user_id: session.user.id,
        likes: 0,
        bookmarks: 0,
        comments: 0
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error creating quote:", error);
    return false;
  }
};

// Like a quote
export const likeQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("User not authenticated");
    }
    
    // Check if the user has already liked this quote
    const { data: existingLike } = await supabase
      .from('quote_likes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', session.user.id)
      .single();
      
    if (existingLike) {
      // User has already liked the quote, so unlike it
      await supabase
        .from('quote_likes')
        .delete()
        .eq('id', existingLike.id);
        
      // Decrement the likes count
      await supabase
        .from('quotes')
        .update({ likes: supabase.rpc('decrement_counter', { row_id: quoteId, column_name: 'likes', table_name: 'quotes' }) })
        .eq('id', quoteId);
        
      return false;
    } else {
      // User hasn't liked the quote yet, so like it
      await supabase
        .from('quote_likes')
        .insert({
          quote_id: quoteId,
          user_id: session.user.id
        });
        
      // Increment the likes count
      await supabase
        .from('quotes')
        .update({ likes: supabase.rpc('increment_counter', { row_id: quoteId, column_name: 'likes', table_name: 'quotes' }) })
        .eq('id', quoteId);
        
      return true;
    }
  } catch (error) {
    console.error("Error liking/unliking quote:", error);
    throw error;
  }
};

// Bookmark a quote
export const bookmarkQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("User not authenticated");
    }
    
    // Check if the user has already bookmarked this quote
    const { data: existingBookmark } = await supabase
      .from('quote_bookmarks')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', session.user.id)
      .single();
      
    if (existingBookmark) {
      // User has already bookmarked the quote, so unbookmark it
      await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);
        
      // Decrement the bookmarks count
      await supabase
        .from('quotes')
        .update({ bookmarks: supabase.rpc('decrement_counter', { row_id: quoteId, column_name: 'bookmarks', table_name: 'quotes' }) })
        .eq('id', quoteId);
        
      return false;
    } else {
      // User hasn't bookmarked the quote yet, so bookmark it
      await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: quoteId,
          user_id: session.user.id
        });
        
      // Increment the bookmarks count
      await supabase
        .from('quotes')
        .update({ bookmarks: supabase.rpc('increment_counter', { row_id: quoteId, column_name: 'bookmarks', table_name: 'quotes' }) })
        .eq('id', quoteId);
        
      return true;
    }
  } catch (error) {
    console.error("Error bookmarking/unbookmarking quote:", error);
    throw error;
  }
};

// Check if the user has liked a quote
export const checkUserLikedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return false;
    }
    
    const { data } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', session.user.id)
      .single();
      
    return !!data;
  } catch (error) {
    return false;
  }
};

// Check if the user has bookmarked a quote
export const checkUserBookmarkedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return false;
    }
    
    const { data } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', session.user.id)
      .single();
      
    return !!data;
  } catch (error) {
    return false;
  }
};
