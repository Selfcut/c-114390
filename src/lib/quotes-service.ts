
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[];
  user_id: string;
  likes: number;
  comments: number;
  bookmarks: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteWithUser extends Quote {
  user: {
    name: string;
    username: string;
    avatar_url?: string;
    status: string;
  }
}

// Fetch all quotes with their submitters
export const fetchQuotes = async (): Promise<QuoteWithUser[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        user:user_id (
          username,
          name,
          avatar_url,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Ensure proper type conversion
    const typedData = data?.map(item => {
      const quote = item as unknown as QuoteWithUser;
      if (quote.user && typeof quote.user === 'object') {
        return quote;
      }
      
      // If user data is missing, provide defaults
      return {
        ...item,
        user: {
          name: 'Unknown User',
          username: 'unknown',
          status: 'offline'
        }
      } as QuoteWithUser;
    }) || [];

    return typedData;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
};

// Fetch quotes with filtering and sorting
export const fetchQuotesWithFilters = async (
  searchQuery: string = '',
  tagFilter: string | null = null,
  sortBy: 'popular' | 'new' | 'comments' = 'popular'
): Promise<QuoteWithUser[]> => {
  try {
    let query = supabase
      .from('quotes')
      .select(`
        *,
        user:user_id (
          username,
          name,
          avatar_url,
          status
        )
      `);

    // Add tag filter if provided
    if (tagFilter) {
      query = query.contains('tags', [tagFilter]);
    }

    // Add search query filter if provided
    if (searchQuery) {
      query = query.or(`text.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
    }

    // Add sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('likes', { ascending: false });
        break;
      case 'new':
        query = query.order('created_at', { ascending: false });
        break;
      case 'comments':
        query = query.order('comments', { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) throw error;

    // Ensure proper type conversion
    const typedData = data?.map(item => {
      const quote = item as unknown as QuoteWithUser;
      if (quote.user && typeof quote.user === 'object') {
        return quote;
      }
      
      return {
        ...item,
        user: {
          name: 'Unknown User',
          username: 'unknown',
          status: 'offline'
        }
      } as QuoteWithUser;
    }) || [];

    return typedData;
  } catch (error) {
    console.error("Error fetching quotes with filters:", error);
    return [];
  }
};

// Fetch a single quote by ID
export const fetchQuoteById = async (id: string): Promise<QuoteWithUser | null> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        user:user_id (
          username,
          name,
          avatar_url,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Ensure proper type conversion
    const quote = data as unknown as QuoteWithUser;
    if (quote?.user && typeof quote.user === 'object') {
      return quote;
    }
    
    return {
      ...data,
      user: {
        name: 'Unknown User',
        username: 'unknown',
        status: 'offline'
      }
    } as QuoteWithUser;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
};

// Create a new quote
export const createQuote = async (quote: Omit<Quote, 'id' | 'user_id' | 'likes' | 'comments' | 'bookmarks' | 'created_at' | 'updated_at'>): Promise<Quote | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('quotes')
      .insert({
        ...quote,
        user_id: userData.user.id
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Quote created successfully",
      description: "Your quote has been saved.",
    });

    return data;
  } catch (error) {
    console.error("Error creating quote:", error);
    
    toast({
      title: "Failed to create quote",
      description: error.message,
      variant: "destructive",
    });
    
    return null;
  }
};

// Update an existing quote
export const updateQuote = async (id: string, updates: Partial<Quote>): Promise<Quote | null> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Quote updated successfully",
    });

    return data;
  } catch (error) {
    console.error("Error updating quote:", error);
    
    toast({
      title: "Failed to update quote",
      description: error.message,
      variant: "destructive",
    });
    
    return null;
  }
};

// Delete a quote
export const deleteQuote = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Quote deleted successfully",
    });

    return true;
  } catch (error) {
    console.error("Error deleting quote:", error);
    
    toast({
      title: "Failed to delete quote",
      description: error.message,
      variant: "destructive",
    });
    
    return false;
  }
};

// Like a quote
export const likeQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!userData.user) throw new Error("User not authenticated");

    // Check if user already liked this quote
    const { data: existingLike, error: checkError } = await supabase
      .from('quote_likes')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLike) {
      // User already liked, so unlike
      const { error: unlikeError } = await supabase
        .from('quote_likes')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', userData.user.id);

      if (unlikeError) throw unlikeError;

      // Decrement like count - Fixed function call
      const { error: decrementError } = await supabase
        .rpc('decrement_quote_likes', { quote_id: quoteId });

      if (decrementError) throw decrementError;

      return false; // Returned false means user unliked
    } else {
      // User hasn't liked, so add like
      const { error: likeError } = await supabase
        .from('quote_likes')
        .insert({
          quote_id: quoteId,
          user_id: userData.user.id
        });

      if (likeError) throw likeError;

      // Increment like count - Fixed function call
      const { error: incrementError } = await supabase
        .rpc('increment_quote_likes', { quote_id: quoteId });

      if (incrementError) throw incrementError;

      return true; // Returned true means user liked
    }
  } catch (error) {
    console.error("Error liking quote:", error);
    return false;
  }
};

// Bookmark a quote
export const bookmarkQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!userData.user) throw new Error("User not authenticated");

    // Check if user already bookmarked this quote
    const { data: existingBookmark, error: checkError } = await supabase
      .from('quote_bookmarks')
      .select()
      .eq('quote_id', quoteId)
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingBookmark) {
      // User already bookmarked, so remove bookmark
      const { error: removeError } = await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', userData.user.id);

      if (removeError) throw removeError;

      // Decrement bookmark count - Fixed function call
      const { error: decrementError } = await supabase
        .rpc('decrement_quote_bookmarks', { quote_id: quoteId });

      if (decrementError) throw decrementError;

      return false; // Returned false means user removed bookmark
    } else {
      // User hasn't bookmarked, so add bookmark
      const { error: bookmarkError } = await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: quoteId,
          user_id: userData.user.id
        });

      if (bookmarkError) throw bookmarkError;

      // Increment bookmark count - Fixed function call
      const { error: incrementError } = await supabase
        .rpc('increment_quote_bookmarks', { quote_id: quoteId });

      if (incrementError) throw incrementError;

      return true; // Returned true means user bookmarked
    }
  } catch (error) {
    console.error("Error bookmarking quote:", error);
    return false;
  }
};

// Check if user has liked a specific quote
export const checkUserLikedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
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
    console.error("Error checking if user liked quote:", error);
    return false;
  }
};

// Check if user has bookmarked a specific quote
export const checkUserBookmarkedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
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
    console.error("Error checking if user bookmarked quote:", error);
    return false;
  }
};

// Get all bookmarked quotes for the current user
export const fetchUserBookmarkedQuotes = async (): Promise<QuoteWithUser[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!userData.user) return [];

    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('quote_bookmarks')
      .select('quote_id')
      .eq('user_id', userData.user.id);

    if (bookmarkError) throw bookmarkError;
    if (!bookmarkData || bookmarkData.length === 0) return [];

    const quoteIds = bookmarkData.map(item => item.quote_id);

    const { data: quotesData, error: quotesError } = await supabase
      .from('quotes')
      .select(`
        *,
        user:user_id (
          username,
          name,
          avatar_url,
          status
        )
      `)
      .in('id', quoteIds);

    if (quotesError) throw quotesError;

    // Ensure proper type conversion
    const typedData = quotesData?.map(item => {
      const quote = item as unknown as QuoteWithUser;
      if (quote.user && typeof quote.user === 'object') {
        return quote;
      }
      
      return {
        ...item,
        user: {
          name: 'Unknown User',
          username: 'unknown',
          status: 'offline'
        }
      } as QuoteWithUser;
    }) || [];

    return typedData;
  } catch (error) {
    console.error("Error fetching user's bookmarked quotes:", error);
    return [];
  }
};
