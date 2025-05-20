// This is a partial update focusing only on fixing the error
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser, QuoteFilterOptions, PaginationResult } from '@/lib/quotes/types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UseQuotesResult {
  quotes: QuoteWithUser[];
  isLoading: boolean;
  error: string | null;
  fetchQuotes: (options?: QuoteFilterOptions) => Promise<void>;
  createQuote: (quote: Omit<QuoteWithUser, 'id' | 'created_at' | 'user' | 'user_id'>) => Promise<QuoteWithUser | null>;
  updateQuote: (id: string, updates: Partial<Omit<QuoteWithUser, 'id' | 'created_at' | 'user' | 'user_id'>>) => Promise<QuoteWithUser | null>;
  deleteQuote: (id: string) => Promise<boolean>;
  likeQuote: (id: string) => Promise<boolean>;
  bookmarkQuote: (id: string) => Promise<boolean>;
  checkUserLikedQuote: (id: string) => Promise<boolean>;
  checkUserBookmarkedQuote: (id: string) => Promise<boolean>;
  fetchQuotesWithFilters: (options: QuoteFilterOptions) => Promise<PaginationResult<QuoteWithUser>>;
  trackQuoteView: () => void;
}

export const useQuotes = (): UseQuotesResult => {
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch quotes
  const fetchQuotes = useCallback(async (options: QuoteFilterOptions = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          user:user_id (id, name, username, avatar_url, status)
        `)
        .order('created_at', { ascending: false });

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

      const formattedQuotes: QuoteWithUser[] = (data || []).map(quote => ({
        id: quote.id,
        text: quote.text,
        author: quote.author,
        source: quote.source || null,
        tags: quote.tags || [],
        likes: quote.likes || 0,
        comments: quote.comments || 0,
        bookmarks: quote.bookmarks || 0,
        created_at: quote.created_at,
        user_id: quote.user_id,
        category: quote.category || 'Other',
        featured_date: quote.featured_date || null,
        user: quote.user || {
          id: 'unknown',
          username: 'unknown',
          name: 'Unknown User',
          avatar_url: '',
          status: 'offline'
        }
      }));

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
          user:user_id (id, name, username, avatar_url, status)
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

      const formattedQuotes: QuoteWithUser[] = (data || []).map(quote => ({
        id: quote.id,
        text: quote.text,
        author: quote.author,
        source: quote.source || null,
        tags: quote.tags || [],
        likes: quote.likes || 0,
        comments: quote.comments || 0,
        bookmarks: quote.bookmarks || 0,
        created_at: quote.created_at,
        user_id: quote.user_id,
        category: quote.category || 'Other',
        featured_date: quote.featured_date || null,
        user: quote.user || {
          id: 'unknown',
          username: 'unknown',
          name: 'Unknown User',
          avatar_url: '',
          status: 'offline'
        }
      }));

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const page = Math.floor(offset / limit) + 1;

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
      const { data, error } = await supabase
        .from('quotes')
        .insert([
          {
            ...quote,
            user_id: user.id,
          },
        ])
        .select(`
          *,
          user:user_id (id, name, username, avatar_url, status)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

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
        user_id: data.user_id,
        category: data.category || 'Other',
        featured_date: data.featured_date || null,
        user: data.user || {
          id: 'unknown',
          username: 'unknown',
          name: 'Unknown User',
          avatar_url: '',
          status: 'offline'
        }
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
          user:user_id (id, name, username, avatar_url, status)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

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
        user_id: data.user_id,
        category: data.category || 'Other',
        featured_date: data.featured_date || null,
        user: data.user || {
          id: 'unknown',
          username: 'unknown',
          name: 'Unknown User',
          avatar_url: '',
          status: 'offline'
        }
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

  // Like quote
  const likeQuote = useCallback(async (id: string): Promise<boolean> => {
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
      const { data, error } = await supabase.rpc('like_quote', {
        quote_id: id,
        user_id: user.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to like quote',
        variant: 'destructive',
      });
      return false;
    }
  }, [isAuthenticated, navigate, toast, user]);

  // Bookmark quote
  const bookmarkQuote = useCallback(async (id: string): Promise<boolean> => {
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
      const { data, error } = await supabase.rpc('bookmark_quote', {
        quote_id: id,
        user_id: user.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to bookmark quote',
        variant: 'destructive',
      });
      return false;
    }
  }, [isAuthenticated, navigate, toast, user]);

  // Check if user liked quote
  const checkUserLikedQuote = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('quote_id', id)
        .eq('user_id', user.id)
        .single();

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
        .from('bookmarks')
        .select('*')
        .eq('quote_id', id)
        .eq('user_id', user.id)
        .single();

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

  return {
    quotes,
    isLoading,
    error,
    fetchQuotes,
    createQuote,
    updateQuote,
    deleteQuote,
    likeQuote,
    bookmarkQuote,
    checkUserLikedQuote,
    checkUserBookmarkedQuote,
    fetchQuotesWithFilters,
    trackQuoteView
  };
};
