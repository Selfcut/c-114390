import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser, QuoteFilterOptions, PaginationResult, QuoteSortOption, QuoteSubmission } from '@/lib/quotes/types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface UseQuotesResult {
  quotes: QuoteWithUser[];
  allTags: string[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterTag: string | null;
  setFilterTag: (tag: string | null) => void;
  sortOption: QuoteSortOption;
  setSortOption: (option: QuoteSortOption) => void;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (quoteId: string) => Promise<boolean | null>;
  handleBookmark: (quoteId: string) => Promise<boolean | null>;
  refreshQuotes: () => Promise<void>;
  resetFilters: () => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
}

export function useQuotes(initialOptions?: QuoteFilterOptions): UseQuotesResult {
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<QuoteSortOption>('newest');
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // You can adjust the page size as needed
  const [totalCount, setTotalCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const totalPages = Math.ceil(totalCount / pageSize);

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Fetch quotes from Supabase with filters and pagination
  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Apply filters and sorting
      let query = supabase
        .from('quotes')
        .select(`
          *,
          user:profiles (id, username, name, avatar_url, status)
        `, { count: 'exact' })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (searchQuery) {
        query = query.ilike('text', `%${searchQuery}%`);
      }

      if (filterTag) {
        query = query.contains('tags', [filterTag]);
      }

      const sortColumn = getSortColumn(sortOption);
      query = query.order(sortColumn.column, { ascending: sortColumn.ascending });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }
      
      // Format the user object
      const formattedQuotes: QuoteWithUser[] = (data || []).map(quote => {
        const userData = quote.user;
        const userObj = userData && typeof userData === 'object'
          ? {
              id: (userData as any).id || 'unknown',
              username: (userData as any).username || 'unknown',
              name: (userData as any).name || 'Unknown User',
              avatar_url: (userData as any).avatar_url || null,
              status: (userData as any).status || 'offline'
            }
          : null;
        
        return {
          ...quote,
          user: userObj
        };
      });

      setQuotes(formattedQuotes);
      setTotalCount(count || 0);
      
      // Fetch user likes and bookmarks
      if (isAuthenticated && user) {
        await fetchUserInteractions(formattedQuotes);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quotes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterTag, sortOption, currentPage, pageSize, isAuthenticated, user, toast]);

  // Fetch all distinct tags
  const fetchAllTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('tags');

      if (error) {
        throw error;
      }

      // Extract and flatten tags
      const tags = data
        .map(item => item.tags)
        .filter(tags => Array.isArray(tags))
        .reduce((acc, tags) => acc.concat(tags), []);

      // Get distinct tags
      const distinctTags = [...new Set(tags)];
      setAllTags(distinctTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tags',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Fetch user likes and bookmarks
  const fetchUserInteractions = async (quotes: QuoteWithUser[]) => {
    if (!isAuthenticated || !user) return;

    try {
      const quoteIds = quotes.map(quote => quote.id);

      // Fetch likes
      const { data: likesData, error: likesError } = await supabase
        .from('quote_likes')
        .select('quote_id')
        .in('quote_id', quoteIds)
        .eq('user_id', user.id);

      if (likesError) throw likesError;

      const likedQuotes = likesData ? likesData.map(like => like.quote_id) : [];
      const initialLikes: Record<string, boolean> = {};
      quotes.forEach(quote => {
        initialLikes[quote.id] = likedQuotes.includes(quote.id);
      });
      setUserLikes(initialLikes);

      // Fetch bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .in('quote_id', quoteIds)
        .eq('user_id', user.id);

      if (bookmarksError) throw bookmarksError;

      const bookmarkedQuotes = bookmarksData ? bookmarksData.map(bookmark => bookmark.quote_id) : [];
      const initialBookmarks: Record<string, boolean> = {};
      quotes.forEach(quote => {
        initialBookmarks[quote.id] = bookmarkedQuotes.includes(quote.id);
      });
      setUserBookmarks(initialBookmarks);
    } catch (error) {
      console.error('Error fetching user interactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user interactions',
        variant: 'destructive',
      });
    }
  };

  // Handle sort options mapping
  const getSortColumn = useCallback((sortOption?: string) => {
    switch (sortOption) {
      case 'newest':
        return { column: 'created_at', ascending: false };
      case 'oldest':
        return { column: 'created_at', ascending: true };
      case 'most_liked':
      case 'popular': // Support both naming conventions
        return { column: 'likes', ascending: false };
      case 'most_bookmarked':
        return { column: 'bookmarks', ascending: false };
      default:
        return { column: 'created_at', ascending: false };
    }
  }, []);

  // Handle like a quote
  const handleLike = async (quoteId: string): Promise<boolean | null> => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to like quotes',
        variant: 'destructive',
      });
      return null;
    }

    try {
      // Optimistically update the local state
      setUserLikes(prevLikes => ({
        ...prevLikes,
        [quoteId]: !prevLikes[quoteId],
      }));

      // Update the like in the database
      // Fix: Instead of using RPC, we'll implement the like functionality directly
      if (userLikes[quoteId]) {
        // Unlike: Delete the like and decrement the likes count
        const { error: deleteLikeError } = await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', quoteId)
          .eq('user_id', user.id);
          
        if (deleteLikeError) throw deleteLikeError;
          
        const { error: updateQuoteError } = await supabase
          .from('quotes')
          .update({ likes: supabase.raw('GREATEST(likes - 1, 0)') })
          .eq('id', quoteId);
          
        if (updateQuoteError) throw updateQuoteError;
      } else {
        // Like: Add a new like and increment the likes count
        const { error: insertLikeError } = await supabase
          .from('quote_likes')
          .insert({ quote_id: quoteId, user_id: user.id });
          
        if (insertLikeError) throw insertLikeError;
          
        const { error: updateQuoteError } = await supabase
          .from('quotes')
          .update({ likes: supabase.raw('COALESCE(likes, 0) + 1') })
          .eq('id', quoteId);
          
        if (updateQuoteError) throw updateQuoteError;
      }

      return !userLikes[quoteId]; // Return the new like status
    } catch (error) {
      console.error('Error liking quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      });

      // Revert the local state on error
      setUserLikes(prevLikes => ({
        ...prevLikes,
        [quoteId]: !prevLikes[quoteId],
      }));

      return null; // Indicate failure
    }
  };

  // Handle bookmark a quote
  const handleBookmark = async (quoteId: string): Promise<boolean | null> => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to bookmark quotes',
        variant: 'destructive',
      });
      return null;
    }

    try {
      // Optimistically update the local state
      setUserBookmarks(prevBookmarks => ({
        ...prevBookmarks,
        [quoteId]: !prevBookmarks[quoteId],
      }));

      // Update the bookmark in the database
      // Fix: Instead of using RPC, we'll implement the bookmark functionality directly
      if (userBookmarks[quoteId]) {
        // Unbookmark: Delete the bookmark and decrement the bookmarks count
        const { error: deleteBookmarkError } = await supabase
          .from('quote_bookmarks')
          .delete()
          .eq('quote_id', quoteId)
          .eq('user_id', user.id);
          
        if (deleteBookmarkError) throw deleteBookmarkError;
          
        const { error: updateQuoteError } = await supabase
          .from('quotes')
          .update({ bookmarks: supabase.raw('GREATEST(bookmarks - 1, 0)') })
          .eq('id', quoteId);
          
        if (updateQuoteError) throw updateQuoteError;
      } else {
        // Bookmark: Add a new bookmark and increment the bookmarks count
        const { error: insertBookmarkError } = await supabase
          .from('quote_bookmarks')
          .insert({ quote_id: quoteId, user_id: user.id });
          
        if (insertBookmarkError) throw insertBookmarkError;
          
        const { error: updateQuoteError } = await supabase
          .from('quotes')
          .update({ bookmarks: supabase.raw('COALESCE(bookmarks, 0) + 1') })
          .eq('id', quoteId);
          
        if (updateQuoteError) throw updateQuoteError;
      }

      return !userBookmarks[quoteId]; // Return the new bookmark status
    } catch (error) {
      console.error('Error bookmarking quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bookmark status',
        variant: 'destructive',
      });

      // Revert the local state on error
      setUserBookmarks(prevBookmarks => ({
        ...prevBookmarks,
        [quoteId]: !prevBookmarks[quoteId],
      }));

      return null; // Indicate failure
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterTag(null);
    setSortOption('newest');
    setCurrentPage(1);
  };

  // Refresh quotes
  const refreshQuotes = async () => {
    await fetchQuotes();
    await fetchAllTags();
  };
  
  // Fix the createQuote function to include all required fields
  const createQuote = async (quoteData: QuoteSubmission) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create quotes',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      // Make sure we include all required fields for the Quote type
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          text: quoteData.text,
          author: quoteData.author,
          source: quoteData.source,
          category: quoteData.category,
          tags: quoteData.tags,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        toast({
          title: 'Quote created',
          description: 'Your quote has been added successfully',
        });
        await refreshQuotes(); // Refresh quotes after creating a new one
        return true;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create quote',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to create quote',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchQuotes();
    fetchAllTags();
  }, [fetchQuotes, fetchAllTags]);

  return {
    quotes,
    allTags,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterTag,
    setFilterTag,
    sortOption,
    setSortOption,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    refreshQuotes,
    resetFilters,
    currentPage,
    totalPages,
    handlePageChange
  };
}
