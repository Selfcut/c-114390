import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface QuoteWithUser {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags?: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: {
    name?: string;
    username?: string;
    avatar_url?: string;
    status?: string;
  };
}

// Function to fetch quotes with optional search, tag filter, and sort
export const fetchQuotesWithFilters = async (
  searchTerm: string = '',
  tagFilter: string | null = null,
  sortOption: 'popular' | 'new' | 'comments' = 'popular'
): Promise<QuoteWithUser[]> => {
  try {
    // Start building query
    let query = supabase
      .from('quotes')
      .select(`
        *,
        user_id,
        profiles:profiles(name, username, avatar_url, status)
      `);

    // Apply search filter if provided
    if (searchTerm) {
      query = query.or(`text.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
    }

    // Apply tag filter if provided
    if (tagFilter) {
      // Using ?& operator to find array containing the tag
      // This requires tagsArray to be a valid JSONB array
      query = query.contains('tags', [tagFilter]);
    }

    // Apply sorting
    switch (sortOption) {
      case 'popular':
        query = query.order('likes', { ascending: false });
        break;
      case 'new':
        query = query.order('created_at', { ascending: false });
        break;
      case 'comments':
        query = query.order('comments', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }

    // Transform data to match QuoteWithUser interface
    return data.map(item => ({
      ...item,
      user: item.profiles
    })) as QuoteWithUser[];
  } catch (error) {
    console.error("Error in fetchQuotesWithFilters:", error);
    return [];
  }
};

export const fetchQuoteById = async (quoteId: string): Promise<QuoteWithUser | null> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        user_id,
        profiles:profiles(name, username, avatar_url, status)
      `)
      .eq('id', quoteId)
      .single();

    if (error) {
      console.error("Error fetching quote:", error);
      return null;
    }

    return {
      ...data,
      user: data.profiles
    } as QuoteWithUser;
  } catch (error) {
    console.error("Error in fetchQuoteById:", error);
    return null;
  }
};

export const fetchQuotes = async (): Promise<QuoteWithUser[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        user_id,
        profiles:profiles(name, username, avatar_url, status)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }

    // Transform data to match QuoteWithUser interface
    return data.map(item => ({
      ...item,
      user: item.profiles
    })) as QuoteWithUser[];
  } catch (error) {
    console.error("Error in fetchQuotes:", error);
    return [];
  }
};

export const fetchUserBookmarkedQuotes = async (): Promise<QuoteWithUser[]> => {
  try {
    // Get user's bookmarked quote IDs
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('quote_bookmarks')
      .select('quote_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (bookmarkError || !bookmarkData || bookmarkData.length === 0) {
      if (bookmarkError) console.error("Error fetching bookmarks:", bookmarkError);
      return [];
    }

    // Get the actual quotes
    const quoteIds = bookmarkData.map(b => b.quote_id);
    const { data: quotesData, error: quotesError } = await supabase
      .from('quotes')
      .select(`
        *,
        user_id,
        profiles:profiles(name, username, avatar_url, status)
      `)
      .in('id', quoteIds);

    if (quotesError) {
      console.error("Error fetching bookmarked quotes:", quotesError);
      return [];
    }

    // Transform data to match QuoteWithUser interface
    return (quotesData || []).map(item => ({
      ...item,
      user: item.profiles
    })) as QuoteWithUser[];
  } catch (error) {
    console.error("Error in fetchUserBookmarkedQuotes:", error);
    return [];
  }
};

export const createQuote = async (
  text: string,
  author: string,
  source: string,
  category: string,
  tags: string[]
): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create quotes",
        variant: "destructive"
      });
      return false;
    }

    // Create the quote
    const { error } = await supabase
      .from('quotes')
      .insert({
        text,
        author,
        source,
        category,
        tags,
        user_id: user.id,
      });

    if (error) {
      console.error("Error creating quote:", error);
      toast({
        title: "Failed to create quote",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    // Record activity
    await supabase
      .from('user_activities')
      .insert({
        user_id: user.id,
        event_type: 'quote_created',
        metadata: { text, author }
      });

    return true;
  } catch (error) {
    console.error("Error in createQuote:", error);
    return false;
  }
};

export const checkUserLikedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return false;

    const { data, error } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking if quote is liked:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in checkUserLikedQuote:", error);
    return false;
  }
};

// Toggle like on a quote (like/unlike)
export const likeQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return false;
    }

    // Check if the user already liked the quote
    const { data: existingLike, error: checkError } = await supabase
      .from('quote_likes')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing like:", checkError);
      return false;
    }

    // If like exists, remove it
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('quote_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return false;
      }

      // Update using RPC function with proper type casting
      await supabase
        .from('quotes')
        .update({ 
          likes: (supabase.rpc as any)('decrement_counter', { 
            row_id: quoteId, 
            column_name: 'likes' 
          }) as unknown as number
        })
        .eq('id', quoteId);

      return false; // Return false to indicate quote is now unliked
    } 
    // Otherwise add a new like
    else {
      const { error: insertError } = await supabase
        .from('quote_likes')
        .insert({
          quote_id: quoteId,
          user_id: user.id
        });

      if (insertError) {
        console.error("Error adding like:", insertError);
        return false;
      }

      // Update using RPC function with proper type casting
      await supabase
        .from('quotes')
        .update({ 
          likes: (supabase.rpc as any)('increment_counter', { 
            row_id: quoteId, 
            column_name: 'likes' 
          }) as unknown as number
        })
        .eq('id', quoteId);

      // Record activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          event_type: 'quote_liked',
          metadata: { quote_id: quoteId }
        });

      return true; // Return true to indicate quote is now liked
    }
  } catch (error) {
    console.error("Error in likeQuote:", error);
    return false;
  }
};

// Check if a user has bookmarked a quote
export const checkUserBookmarkedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return false;

    const { data, error } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking if quote is bookmarked:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in checkUserBookmarkedQuote:", error);
    return false;
  }
};

// Toggle bookmark on a quote (bookmark/unbookmark)
export const bookmarkQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark quotes",
        variant: "destructive"
      });
      return false;
    }

    // Check if the user already bookmarked the quote
    const { data: existingBookmark, error: checkError } = await supabase
      .from('quote_bookmarks')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing bookmark:", checkError);
      return false;
    }

    // If bookmark exists, remove it
    if (existingBookmark) {
      const { error: deleteError } = await supabase
        .from('quote_bookmarks')
        .delete()
        .eq('id', existingBookmark.id);

      if (deleteError) {
        console.error("Error removing bookmark:", deleteError);
        return false;
      }

      // Update bookmark count with proper type casting
      await supabase
        .from('quotes')
        .update({ 
          bookmarks: (supabase.rpc as any)('decrement_counter', { 
            row_id: quoteId, 
            column_name: 'bookmarks' 
          }) as unknown as number
        })
        .eq('id', quoteId);

      return false; // Return false to indicate quote is now unbookmarked
    } 
    // Otherwise add a new bookmark
    else {
      const { error: insertError } = await supabase
        .from('quote_bookmarks')
        .insert({
          quote_id: quoteId,
          user_id: user.id
        });

      if (insertError) {
        console.error("Error adding bookmark:", insertError);
        return false;
      }

      // Update bookmark count with proper type casting
      await supabase
        .from('quotes')
        .update({ 
          bookmarks: (supabase.rpc as any)('increment_counter', { 
            row_id: quoteId, 
            column_name: 'bookmarks' 
          }) as unknown as number
        })
        .eq('id', quoteId);

      // Record activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          event_type: 'bookmark',
          metadata: { quote_id: quoteId }
        });

      return true; // Return true to indicate quote is now bookmarked
    }
  } catch (error) {
    console.error("Error in bookmarkQuote:", error);
    return false;
  }
};
