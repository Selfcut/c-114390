
import { supabase } from '@/integrations/supabase/client';

export interface QuoteWithUser {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  bookmarks?: number;
  created_at: string;
  user_id: string;
  user?: {
    id: string | null;
    username: string;
    name: string;
    avatar_url: string | null;
    status: string;
  } | null;
}

export const fetchQuotes = async (): Promise<QuoteWithUser[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        user:profiles(
          id, 
          username, 
          name, 
          avatar_url, 
          status
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match our expected type
    const formattedQuotes = (data || []).map(quote => ({
      ...quote,
      user: quote.user || {
        id: null,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      }
    }));
    
    return formattedQuotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
};

export const fetchQuotesWithFilters = async (
  options: {
    searchTerm?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }
): Promise<QuoteWithUser[]> => {
  try {
    let query = supabase
      .from('quotes')
      .select(`
        *,
        user:profiles(
          id, 
          username, 
          name, 
          avatar_url, 
          status
        )
      `);
    
    // Apply filters if provided
    if (options.searchTerm) {
      query = query.or(
        `text.ilike.%${options.searchTerm}%,author.ilike.%${options.searchTerm}%`
      );
    }
    
    if (options.tag) {
      query = query.contains('tags', [options.tag]);
    }
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(
        options.offset, 
        options.offset + (options.limit || 10) - 1
      );
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to match our expected type
    const formattedQuotes = (data || []).map(quote => ({
      ...quote,
      user: quote.user || {
        id: null,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      }
    }));
    
    return formattedQuotes;
  } catch (error) {
    console.error('Error fetching filtered quotes:', error);
    return [];
  }
};

// Add the missing createQuote function
export const createQuote = async (
  text: string,
  author: string,
  source?: string,
  category?: string,
  tags?: string[]
): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('quotes')
      .insert({
        text,
        author,
        source: source || null,
        category: category || 'Other',
        tags: tags || [],
        user_id: user.user.id
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating quote:', error);
    return false;
  }
};

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
