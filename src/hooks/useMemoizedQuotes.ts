import { useCallback, useEffect, useMemo, useState } from 'react';
import { QuoteWithUser, QuoteFilterOptions, QuoteSortOption } from '@/lib/quotes/types';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useAuth } from '@/lib/auth';
import { incrementCounter, decrementCounter } from '@/lib/utils/counter-operations';

export function useMemoizedQuotes(initialOptions?: QuoteFilterOptions) {
  const { user, isAuthenticated } = useAuth();
  
  // Default values
  const defaultOptions: QuoteFilterOptions = useMemo(() => ({
    limit: 12,
    searchQuery: '',
    filterTag: null,
    sortColumn: 'created_at',
    sortAscending: false,
    ...initialOptions
  }), [initialOptions]);
  
  // State from defaults or initial options
  const [options, setOptions] = useState<QuoteFilterOptions>({
    ...defaultOptions
  });
  
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  // Create a stable query key based on all filter parameters
  const queryKey = useMemo(() => {
    const { limit, searchQuery, filterTag, sortColumn, sortAscending } = options;
    return [
      'quotes', 
      limit?.toString() || 'all',
      searchQuery || 'noSearch',
      filterTag || 'noTag',
      sortColumn || 'created_at',
      sortAscending ? 'asc' : 'desc',
      currentPage.toString()
    ];
  }, [options, currentPage]);
  
  // Create a stable query function
  const queryFn = useCallback(async () => {
    const { limit, searchQuery, filterTag, sortColumn, sortAscending } = options;
    const offset = limit ? (currentPage - 1) * limit : undefined;
    
    let query = supabase.from('quotes').select('*, user:user_id(id, username, name, avatar_url, status)', { count: 'exact' });
    
    if (searchQuery) {
      query = query.or(`text.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
    }
    
    if (filterTag) {
      query = query.contains('tags', [filterTag]);
    }
    
    query = query.order(sortColumn || 'created_at', { ascending: !!sortAscending });
    
    if (limit !== undefined) {
      if (offset !== undefined) {
        query = query.range(offset, offset + limit - 1);
      } else {
        query = query.limit(limit);
      }
    }
    
    const result = await query;
    return {
      data: result.data || [],
      error: result.error,
      count: result.count
    };
  }, [options, currentPage]);
  
  // Use the custom hook to fetch quotes
  const { data: quotesData, isLoading, error, refetch } = useSupabaseQuery<any[]>(queryKey, async () => {
    const result = await queryFn();
    return {
      data: result.data,
      error: result.error,
      count: result.count
    };
  });
  
  // Format quotes and handle user relationships
  const quotes = useMemo(() => {
    if (!quotesData) return [];
    
    return quotesData.map(quote => ({
      ...quote,
      user: quote.user || {
        id: null,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      }
    })) as QuoteWithUser[];
  }, [quotesData]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    const count = quotesData?.length || 0; // Fallback to length if count isn't available
    const pageSize = options.limit || 12;
    return Math.ceil(count / pageSize);
  }, [quotesData, options.limit]);
  
  // Fetch all distinct tags
  const { data: allTags = [] } = useSupabaseQuery<string[]>(
    ['quoteTags'],
    async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('tags');
      
      // Extract and flatten tags
      const tags = (data || [])
        .map(item => item.tags)
        .filter(tags => Array.isArray(tags))
        .reduce((acc: string[], tags: string[]) => acc.concat(tags), []);
      
      // Get distinct tags
      return {
        data: [...new Set(tags)],
        error
      };
    }
  );
  
  // Fetch user interactions if authenticated
  useEffect(() => {
    if (!isAuthenticated || !user || !quotes.length) return;
    
    const fetchUserInteractions = async () => {
      try {
        const quoteIds = quotes.map(quote => quote.id);
        
        // Fetch likes
        const { data: likesData } = await supabase
          .from('quote_likes')
          .select('quote_id')
          .in('quote_id', quoteIds)
          .eq('user_id', user.id);
        
        if (likesData) {
          const likedQuotes: Record<string, boolean> = {};
          likesData.forEach(like => {
            likedQuotes[like.quote_id] = true;
          });
          setUserLikes(likedQuotes);
        }
        
        // Fetch bookmarks
        const { data: bookmarksData } = await supabase
          .from('quote_bookmarks')
          .select('quote_id')
          .in('quote_id', quoteIds)
          .eq('user_id', user.id);
        
        if (bookmarksData) {
          const bookmarkedQuotes: Record<string, boolean> = {};
          bookmarksData.forEach(bookmark => {
            bookmarkedQuotes[bookmark.quote_id] = true;
          });
          setUserBookmarks(bookmarkedQuotes);
        }
      } catch (error) {
        console.error('Error fetching user interactions:', error);
      }
    };
    
    fetchUserInteractions();
  }, [isAuthenticated, user, quotes]);
  
  // Handler for liking a quote
  const handleLike = useCallback(async (quoteId: string): Promise<boolean | null> => {
    if (!isAuthenticated || !user) {
      return null;
    }
    
    try {
      // Optimistic UI update
      setUserLikes(prev => ({
        ...prev,
        [quoteId]: !prev[quoteId]
      }));
      
      if (userLikes[quoteId]) {
        // Unlike: Delete the like and decrement the counter
        await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', quoteId)
          .eq('user_id', user.id);
        
        await decrementCounter(quoteId, 'likes', 'quotes');
      } else {
        // Like: Insert new like and increment the counter
        await supabase
          .from('quote_likes')
          .insert({ quote_id: quoteId, user_id: user.id });
        
        await incrementCounter(quoteId, 'likes', 'quotes');
      }
      
      return !userLikes[quoteId];
    } catch (error) {
      // Revert optimistic update on error
      console.error('Error updating like:', error);
      setUserLikes(prev => ({
        ...prev,
        [quoteId]: !!prev[quoteId]
      }));
      return null;
    }
  }, [isAuthenticated, user, userLikes]);
  
  // Handler for bookmarking a quote
  const handleBookmark = useCallback(async (quoteId: string): Promise<boolean | null> => {
    if (!isAuthenticated || !user) {
      return null;
    }
    
    try {
      // Optimistic UI update
      setUserBookmarks(prev => ({
        ...prev,
        [quoteId]: !prev[quoteId]
      }));
      
      if (userBookmarks[quoteId]) {
        // Unbookmark: Delete the bookmark and decrement the counter
        await supabase
          .from('quote_bookmarks')
          .delete()
          .eq('quote_id', quoteId)
          .eq('user_id', user.id);
        
        await decrementCounter(quoteId, 'bookmarks', 'quotes');
      } else {
        // Bookmark: Insert new bookmark and increment the counter
        await supabase
          .from('quote_bookmarks')
          .insert({ quote_id: quoteId, user_id: user.id });
        
        await incrementCounter(quoteId, 'bookmarks', 'quotes');
      }
      
      return !userBookmarks[quoteId];
    } catch (error) {
      // Revert optimistic update on error
      console.error('Error updating bookmark:', error);
      setUserBookmarks(prev => ({
        ...prev,
        [quoteId]: !!prev[quoteId]
      }));
      return null;
    }
  }, [isAuthenticated, user, userBookmarks]);
  
  // Shorthand for setting search query
  const setSearchQuery = useCallback((query: string) => {
    setOptions(prev => ({ ...prev, searchQuery: query }));
    setCurrentPage(1); // Reset to first page on new search
  }, []);
  
  // Shorthand for setting filter tag
  const setFilterTag = useCallback((tag: string | null) => {
    setOptions(prev => ({ ...prev, filterTag: tag }));
    setCurrentPage(1); // Reset to first page on new filter
  }, []);
  
  // Shorthand for setting sort option
  const setSortOption = useCallback((option: QuoteSortOption) => {
    const sortMapping = {
      'newest': { column: 'created_at', ascending: false },
      'oldest': { column: 'created_at', ascending: true },
      'most_liked': { column: 'likes', ascending: false },
      'most_bookmarked': { column: 'bookmarks', ascending: false },
    };
    
    const { column, ascending } = sortMapping[option] || sortMapping.newest;
    setOptions(prev => ({ ...prev, sortColumn: column, sortAscending: ascending }));
    setCurrentPage(1); // Reset to first page on new sort
  }, []);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setOptions(defaultOptions);
    setCurrentPage(1);
  }, [defaultOptions]);
  
  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  return {
    quotes,
    allTags,
    isLoading,
    error,
    searchQuery: options.searchQuery,
    setSearchQuery,
    filterTag: options.filterTag,
    setFilterTag,
    sortOption: options.sortColumn === 'created_at' 
      ? (options.sortAscending ? 'oldest' : 'newest')
      : (options.sortColumn === 'likes' ? 'most_liked' : 'most_bookmarked'),
    setSortOption,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    refreshQuotes: refetch,
    resetFilters,
    currentPage,
    totalPages,
    handlePageChange
  };
}
