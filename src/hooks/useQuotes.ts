
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchQuotesWithFilters, 
  countQuotes,
  checkUserLikedQuote, 
  checkUserBookmarkedQuote,
  likeQuote,
  bookmarkQuote,
  QuoteWithUser,
  QuoteFilterOptions
} from '@/lib/quotes';

interface UseQuotesOptions {
  initialLimit?: number;
}

export const useQuotes = (options: UseQuotesOptions = {}) => {
  const { initialLimit = 10 } = options;
  
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(initialLimit);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalQuotes / limit));

  // Extract all unique tags from quotes
  const allTags = Array.from(
    new Set(quotes.flatMap(quote => quote.tags || []))
  );

  // Fetch quotes with filters and pagination
  const fetchQuotesData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Prepare filter options
      const filterOptions: QuoteFilterOptions = {
        searchTerm: searchQuery || undefined,
        tag: filterTag || undefined,
        limit,
        offset: (currentPage - 1) * limit
      };
      
      // Fetch quotes and count
      const [fetchedQuotes, count] = await Promise.all([
        fetchQuotesWithFilters(filterOptions),
        countQuotes({
          searchTerm: searchQuery || undefined,
          tag: filterTag || undefined
        })
      ]);
      
      setQuotes(fetchedQuotes);
      setTotalQuotes(count);
      
      // Check user interactions if authenticated
      if (isAuthenticated && user) {
        const likesObj: Record<string, boolean> = {};
        const bookmarksObj: Record<string, boolean> = {};
        
        await Promise.all(fetchedQuotes.map(async (quote) => {
          likesObj[quote.id] = await checkUserLikedQuote(quote.id);
          bookmarksObj[quote.id] = await checkUserBookmarkedQuote(quote.id);
        }));
        
        setUserLikes(prev => ({ ...prev, ...likesObj }));
        setUserBookmarks(prev => ({ ...prev, ...bookmarksObj }));
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
  }, [searchQuery, filterTag, currentPage, limit, isAuthenticated, user, toast]);

  // Initial fetch and refetch when filters or pagination changes
  useEffect(() => {
    fetchQuotesData();
  }, [fetchQuotesData]);

  // Handle like button click
  const handleLike = async (quoteId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return null;
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
      return null;
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
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    quotes,
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
    resetFilters,
    // Pagination
    currentPage,
    totalPages,
    handlePageChange,
    totalQuotes
  };
};
