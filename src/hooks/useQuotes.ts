
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchQuotes, 
  checkUserLikedQuote, 
  checkUserBookmarkedQuote,
  likeQuote,
  bookmarkQuote,
  QuoteWithUser
} from '@/lib/quotes';

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
  const fetchQuotesData = async () => {
    setIsLoading(true);
    try {
      const fetchedQuotes = await fetchQuotes();
      setQuotes(fetchedQuotes);
      setFilteredQuotes(fetchedQuotes);
      
      // Check user interactions if authenticated
      if (isAuthenticated) {
        const likesObj: Record<string, boolean> = {};
        const bookmarksObj: Record<string, boolean> = {};
        
        await Promise.all(fetchedQuotes.map(async (quote) => {
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
    fetchQuotesData();
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
      const result = await likeQuote(quoteId);
      
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
      const result = await bookmarkQuote(quoteId);
      
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
    refreshQuotes: fetchQuotesData,
    resetFilters
  };
};
