
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  checkUserLikedQuote, 
  checkUserBookmarkedQuote,
  QuoteWithUser
} from '@/lib/quotes-service';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Extract all unique tags
  const allTags = Array.from(
    new Set(quotes.flatMap(quote => quote.tags || []))
  );

  // Fetch quotes from Supabase
  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          user_id (
            id,
            username,
            name,
            avatar_url,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format quotes to include user data
      const formattedQuotes: QuoteWithUser[] = (data || []).map(quote => ({
        ...quote,
        user: {
          id: quote.user_id?.id || null,
          username: quote.user_id?.username || 'unknown',
          name: quote.user_id?.name || 'Unknown User',
          avatar_url: quote.user_id?.avatar_url || null,
          status: quote.user_id?.status || 'offline'
        }
      }));

      setQuotes(formattedQuotes);
      setFilteredQuotes(formattedQuotes);
      
      // Check user interactions if authenticated
      if (isAuthenticated) {
        const likesObj: Record<string, boolean> = {};
        const bookmarksObj: Record<string, boolean> = {};
        
        await Promise.all(formattedQuotes.map(async (quote) => {
          likesObj[quote.id] = await checkUserLikedQuote(quote.id);
          bookmarksObj[quote.id] = await checkUserBookmarkedQuote(quote.id);
        }));
        
        setUserLikes(likesObj);
        setUserBookmarks(bookmarksObj);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchQuotes();
  }, [isAuthenticated]);

  // Filter quotes based on search and tag filter
  useEffect(() => {
    if (searchQuery || filterTag) {
      const filtered = quotes.filter(quote => {
        const matchesSearch = searchQuery ? 
          quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quote.tags && quote.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
          : true;
            
        const matchesTag = filterTag ? 
          quote.tags && quote.tags.includes(filterTag)
          : true;
            
        return matchesSearch && matchesTag;
      });
      setFilteredQuotes(filtered);
    } else {
      setFilteredQuotes(quotes);
    }
  }, [searchQuery, filterTag, quotes]);

  // Handle like button click
  const handleLike = async (quoteId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: existingLike } = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', quoteId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();
      
      let result: boolean;
      
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
        
        result = false;
      } else {
        // Like
        await supabase
          .from('quote_likes')
          .insert({
            quote_id: quoteId,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
        
        await supabase.rpc('increment_counter', {
          row_id: quoteId,
          column_name: 'likes',
          table_name: 'quotes'
        });
        
        result = true;
      }
      
      // Update local state
      setUserLikes(prev => ({
        ...prev,
        [quoteId]: result
      }));
      
      // Update quote likes count
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === quoteId 
            ? { 
                ...quote, 
                likes: result ? (quote.likes || 0) + 1 : Math.max((quote.likes || 0) - 1, 0)
              }
            : quote
        )
      );
      
      return result;
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
      return null;
    }
  };

  // Handle bookmark button click
  const handleBookmark = async (quoteId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark quotes",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: existingBookmark } = await supabase
        .from('quote_bookmarks')
        .select('id')
        .eq('quote_id', quoteId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();
      
      let result: boolean;
      
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
        
        result = false;
      } else {
        // Add bookmark
        await supabase
          .from('quote_bookmarks')
          .insert({
            quote_id: quoteId,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
        
        await supabase.rpc('increment_counter', {
          row_id: quoteId,
          column_name: 'bookmarks',
          table_name: 'quotes'
        });
        
        result = true;
      }
      
      // Update local state
      setUserBookmarks(prev => ({
        ...prev,
        [quoteId]: result
      }));
      
      // Update quote bookmarks count
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === quoteId 
            ? { 
                ...quote, 
                bookmarks: result ? (quote.bookmarks || 0) + 1 : Math.max((quote.bookmarks || 0) - 1, 0)
              }
            : quote
        )
      );
      
      return result;
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
      return null;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterTag(null);
  };

  return {
    quotes: filteredQuotes,
    allQuotes: quotes,
    allTags,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterTag,
    setFilterTag,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    refreshQuotes: fetchQuotes,
    resetFilters
  };
};
