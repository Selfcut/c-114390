
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser, QuoteFilterOptions, PaginationResult, QuoteSortOption } from '@/lib/quotes/types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UseQuotesResult {
  quotes: QuoteWithUser[];
  allTags: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterTag: string | null;
  setFilterTag: (tag: string | null) => void;
  sortOption: QuoteSortOption;
  setSortOption: (option: QuoteSortOption) => void;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (quoteId: string) => Promise<boolean>;
  handleBookmark: (quoteId: string) => Promise<boolean>;
  fetchQuotes: (options?: QuoteFilterOptions) => Promise<void>;
  refreshQuotes: () => Promise<void>;
  resetFilters: () => void;
  createQuote: (quote: Omit<QuoteWithUser, 'id' | 'created_at' | 'user' | 'user_id'>) => Promise<QuoteWithUser | null>;
  updateQuote: (id: string, updates: Partial<Omit<QuoteWithUser, 'id' | 'created_at' | 'user' | 'user_id'>>) => Promise<QuoteWithUser | null>;
  deleteQuote: (id: string) => Promise<boolean>;
  checkUserLikedQuote: (id: string) => Promise<boolean>;
  checkUserBookmarkedQuote: (id: string) => Promise<boolean>;
  fetchQuotesWithFilters: (options: QuoteFilterOptions) => Promise<PaginationResult<QuoteWithUser>>;
  trackQuoteView: () => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const useQuotes = (): UseQuotesResult => {
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<QuoteSortOption>('newest');
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch all available tags
  const fetchAllTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('tags');
      
      if (error) {
        console.error('Error fetching tags:', error);
        return;
      }
      
      // Extract unique tags
      const uniqueTags = new Set<string>();
      data.forEach(quote => {
        if (quote.tags && Array.isArray(quote.tags)) {
          quote.tags.forEach(tag => uniqueTags.add(tag));
        }
      });
      
      setAllTags(Array.from(uniqueTags));
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }, []);

  // Handle user interaction states
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserInteractions();
    }
  }, [isAuthenticated, user]);

  // Fetch quotes
  const fetchQuotes = useCallback(async (options: QuoteFilterOptions = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          user:profiles(id, name, username, avatar_url, status)
        `);

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit ? options.limit - 1 : 9));
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const formattedQuotes: QuoteWithUser[] = (data || []).map(quote => {
        // Handle potentially missing user data with null safety
        const user = quote.user && typeof quote.user === 'object' 
          ? {
              id: quote.user?.id ?? 'unknown',
              username: quote.user?.username ?? 'unknown',
              name: quote.user?.name ?? 'Unknown User',
              avatar_url: quote.user?.avatar_url ?? null,
              status: quote.user?.status ?? 'offline'
            }
          : null;

        return {
          id: quote.id,
          text: quote.text,
          author: quote.author,
          source: quote.source || null,
          tags: quote.tags || [],
          likes: quote.likes || 0,
          comments: quote.comments || 0,
          bookmarks: quote.bookmarks || 0,
          created_at: quote.created_at,
          updated_at: quote.updated_at,
          user_id: quote.user_id,
          category: quote.category || 'Other',
          featured_date: quote.featured_date || null,
          user
        };
      });

      setQuotes(formattedQuotes);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load quotes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch quotes with filters and pagination
  const fetchQuotesWithFilters = useCallback(async (options: QuoteFilterOptions): Promise<PaginationResult<QuoteWithUser>> => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          profiles:profiles(id, name, username, avatar_url, status)
        `, { count: 'exact' });

      if (options.searchTerm) {
        query = query.ilike('text', `%${options.searchTerm}%`);
      }

      if (options.tag) {
        query = query.contains('tags', [options.tag]);
      }

      if (options.sortColumn) {
        query = query.order(options.sortColumn, { ascending: options.sortAscending });
      }

      const limit = options.limit || 10;
      const offset = options.offset || 0;

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const formattedQuotes: QuoteWithUser[] = (data || []).map(quote => {
        // Handle potentially missing user data with null safety
        const profiles = quote.profiles && typeof quote.profiles === 'object' 
          ? {
              id: quote.profiles?.id ?? 'unknown',
              username: quote.profiles?.username ?? 'unknown',
              name: quote.profiles?.name ?? 'Unknown User',
              avatar_url: quote.profiles?.avatar_url ?? null,
              status: quote.profiles?.status ?? 'offline'
            }
          : null;

        return {
          id: quote.id,
          text: quote.text,
          author: quote.author,
          source: quote.source || null,
          tags: quote.tags || [],
          likes: quote.likes || 0,
          comments: quote.comments || 0,
          bookmarks: quote.bookmarks || 0,
          created_at: quote.created_at,
          updated_at: quote.updated_at,
          user_id: quote.user_id,
          category: quote.category || 'Other',
          featured_date: quote.featured_date || null,
          user: profiles
        };
      });

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / (options.limit || 10));
      const page = Math.floor((options.offset || 0) / (options.limit || 10)) + 1;

      setCurrentPage(page);
      setTotalPages(totalPages);

      return {
        data: formattedQuotes,
        totalCount,
        page,
        limit,
        totalPages
      };
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load quotes',
        variant: 'destructive'
      });
      return {
        data: [],
        totalCount: 0,
        page: 1,
        limit: options.limit || 10,
        totalPages: 1
      };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Refresh quotes with current filters
  const refreshQuotes = useCallback(async () => {
    const options: QuoteFilterOptions = {
      searchTerm: searchQuery,
      tag: filterTag || undefined,
      limit: 10,
      offset: (currentPage - 1) * 10
    };
    
    // Map sort option to proper column and direction
    switch (sortOption) {
      case 'newest':
        options.sortColumn = 'created_at';
        options.sortAscending = false;
        break;
      case 'oldest':
        options.sortColumn = 'created_at';
        options.sortAscending = true;
        break;
      case 'most_liked':
        options.sortColumn = 'likes';
        options.sortAscending = false;
        break;
      case 'most_bookmarked':
        options.sortColumn = 'bookmarks';
        options.sortAscending = false;
        break;
    }

    const result = await fetchQuotesWithFilters(options);
    setQuotes(result.data);
    
    // Also refresh all tags for filters
    fetchAllTags();
    
    // Refresh user interactions
    if (isAuthenticated && user) {
      fetchUserInteractions();
    }
  }, [
    fetchQuotesWithFilters, 
    searchQuery, 
    filterTag, 
    currentPage, 
    sortOption, 
    fetchAllTags, 
    isAuthenticated, 
    user
  ]);

  useEffect(() => {
    refreshQuotes();
  }, [refreshQuotes]);

  // Create quote
  const createQuote = useCallback(async (quote: Omit<QuoteWithUser, 'id' | 'created_at' | 'user' | 'user_id'>): Promise<QuoteWithUser | null> => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to create a quote.',
        variant: 'destructive',
      });
      navigate('/login');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure category is not undefined
      const quoteWithCategory = {
        ...quote,
        category: quote.category || 'Other',
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteWithCategory)
        .select(`
          *,
          profiles:profiles(id, name, username, avatar_url, status)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Handle potentially missing user data with null safety
      const profiles = data.profiles && typeof data.profiles === 'object'
        ? {
            id: data.profiles?.id ?? 'unknown',
            username: data.profiles?.username ?? 'unknown',
            name: data.profiles?.name ?? 'Unknown User',
            avatar_url: data.profiles?.avatar_url ?? null,
            status: data.profiles?.status ?? 'offline'
          }
        : null;

      const formattedQuote: QuoteWithUser = {
        id: data.id,
        text: data.text,
        author: data.author,
        source: data.source || null,
        tags: data.tags || [],
        likes: data.likes || 0,
        comments: data.comments || 0,
        bookmarks: data.bookmarks || 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id,
        category: data.category || 'Other',
        featured_date: data.featured_date || null,
        user: profiles
      };

      toast({
        title: 'Success',
        description: 'Quote created successfully!',
      });

      return formattedQuote;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to create quote',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate, toast, user]);

  // Update quote
  const updateQuote = useCallback(async (id: string, updates: Partial<Omit<QuoteWithUser, 'id' | 'created_at' | 'user' | 'user_id'>>): Promise<QuoteWithUser | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('quotes')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles:profiles(id, name, username, avatar_url, status)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Handle potentially missing user data with null safety
      const profiles = data.profiles && typeof data.profiles === 'object' 
        ? {
            id: data.profiles?.id ?? 'unknown',
            username: data.profiles?.username ?? 'unknown',
            name: data.profiles?.name ?? 'Unknown User',
            avatar_url: data.profiles?.avatar_url ?? null,
            status: data.profiles?.status ?? 'offline'
          }
        : null;

      const formattedQuote: QuoteWithUser = {
        id: data.id,
        text: data.text,
        author: data.author,
        source: data.source || null,
        tags: data.tags || [],
        likes: data.likes || 0,
        comments: data.comments || 0,
        bookmarks: data.bookmarks || 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id,
        category: data.category || 'Other',
        featured_date: data.featured_date || null,
        user: profiles
      };

      toast({
        title: 'Success',
        description: 'Quote updated successfully!',
      });

      return formattedQuote;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to update quote',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Delete quote
  const deleteQuote = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== id));

      toast({
        title: 'Success',
        description: 'Quote deleted successfully!',
      });

      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete quote',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch user likes and bookmarks
  const fetchUserInteractions = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch likes
      const { data: likesData } = await supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', user.id);
        
      // Fetch bookmarks
      const { data: bookmarksData } = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', user.id);
        
      // Create maps for quick lookup
      const likes: Record<string, boolean> = {};
      const bookmarks: Record<string, boolean> = {};
      
      likesData?.forEach(like => {
        likes[like.quote_id] = true;
      });
      
      bookmarksData?.forEach(bookmark => {
        bookmarks[bookmark.quote_id] = true;
      });
      
      setUserLikes(likes);
      setUserBookmarks(bookmarks);
    } catch (err) {
      console.error('Error fetching user interactions:', err);
    }
  }, [user]);

  // Like quote
  const handleLike = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to like a quote.',
        variant: 'destructive',
      });
      navigate('/login');
      return false;
    }

    try {
      // Use direct tables instead of RPC function
      const isLiked = userLikes[id];
      
      if (isLiked) {
        // Unlike: remove from the likes table
        await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', id)
          .eq('user_id', user.id);
          
        // Decrement the counter
        await supabase.rpc('decrement_counter', {
          row_id: id,
          column_name: 'likes',
          table_name: 'quotes'
        });
        
        // Update local state
        setUserLikes(prev => ({
          ...prev,
          [id]: false
        }));
        
        // Update quote counter in local state
        setQuotes(prevQuotes =>
          prevQuotes.map(quote =>
            quote.id === id
              ? { ...quote, likes: Math.max(0, (quote.likes || 0) - 1) }
              : quote
          )
        );
        
        return false;
      } else {
        // Like: add to the likes table
        await supabase
          .from('quote_likes')
          .insert({
            quote_id: id,
            user_id: user.id
          });
          
        // Increment the counter
        await supabase.rpc('increment_counter', {
          row_id: id,
          column_name: 'likes',
          table_name: 'quotes'
        });
        
        // Update local state
        setUserLikes(prev => ({
          ...prev,
          [id]: true
        }));
        
        // Update quote counter in local state
        setQuotes(prevQuotes =>
          prevQuotes.map(quote =>
            quote.id === id
              ? { ...quote, likes: (quote.likes || 0) + 1 }
              : quote
          )
        );
        
        return true;
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to process like',
        variant: 'destructive',
      });
      return false;
    }
  }, [isAuthenticated, navigate, toast, user, userLikes]);

  // Bookmark quote
  const handleBookmark = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to bookmark a quote.',
        variant: 'destructive',
      });
      navigate('/login');
      return false;
    }

    try {
      // Use direct tables instead of RPC function
      const isBookmarked = userBookmarks[id];
      
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('quote_bookmarks')
          .delete()
          .eq('quote_id', id)
          .eq('user_id', user.id);
          
        // Decrement the counter
        await supabase.rpc('decrement_counter', {
          row_id: id,
          column_name: 'bookmarks',
          table_name: 'quotes'
        });
        
        // Update local state
        setUserBookmarks(prev => ({
          ...prev,
          [id]: false
        }));
        
        // Update quote counter in local state
        setQuotes(prevQuotes =>
          prevQuotes.map(quote =>
            quote.id === id
              ? { ...quote, bookmarks: Math.max(0, (quote.bookmarks || 0) - 1) }
              : quote
          )
        );
        
        return false;
      } else {
        // Add bookmark
        await supabase
          .from('quote_bookmarks')
          .insert({
            quote_id: id,
            user_id: user.id
          });
          
        // Increment the counter
        await supabase.rpc('increment_counter', {
          row_id: id,
          column_name: 'bookmarks',
          table_name: 'quotes'
        });
        
        // Update local state
        setUserBookmarks(prev => ({
          ...prev,
          [id]: true
        }));
        
        // Update quote counter in local state
        setQuotes(prevQuotes =>
          prevQuotes.map(quote =>
            quote.id === id
              ? { ...quote, bookmarks: (quote.bookmarks || 0) + 1 }
              : quote
          )
        );
        
        return true;
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to process bookmark',
        variant: 'destructive',
      });
      return false;
    }
  }, [isAuthenticated, navigate, toast, user, userBookmarks]);

  // Check if user liked quote
  const checkUserLikedQuote = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('quote_likes')
        .select('*')
        .eq('quote_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        return false;
      }

      return !!data;
    } catch (err: any) {
      console.error('Error checking if user liked quote:', err);
      return false;
    }
  }, [isAuthenticated, user]);

  // Check if user bookmarked quote
  const checkUserBookmarkedQuote = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('quote_bookmarks')
        .select('*')
        .eq('quote_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        return false;
      }

      return !!data;
    } catch (err: any) {
      console.error('Error checking if user bookmarked quote:', err);
      return false;
    }
  }, [isAuthenticated, user]);

  const trackQuoteView = useCallback(() => {
    try {
      // Track view logic here
    } catch (error) {
      console.error('Error tracking quote view:', error);
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterTag(null);
    setSortOption('newest');
    setCurrentPage(1);
  }, []);

  return {
    quotes,
    allTags,
    isLoading,
    error,
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
    fetchQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
    checkUserLikedQuote,
    checkUserBookmarkedQuote,
    fetchQuotesWithFilters,
    trackQuoteView,
    refreshQuotes,
    resetFilters,
    currentPage,
    totalPages,
    handlePageChange
  };
};
