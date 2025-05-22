
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser, QuoteFilterOptions, QuoteSubmission } from './types';
import { batchOperations, executeQuery } from '@/lib/utils/supabase-utils';

/**
 * Optimized function to fetch quotes with caching and batching support
 * 
 * @param options - Optional filtering and pagination options
 * @returns A promise that resolves to an array of quotes with user data
 */
export const fetchQuotesOptimized = async (
  options: QuoteFilterOptions = {}
): Promise<{ quotes: QuoteWithUser[], count: number }> => {
  try {
    // First, build the query with filters
    let query = supabase
      .from('quotes')
      .select('*', { count: 'exact' });
    
    if (options.searchQuery || options.searchTerm) {
      const searchValue = options.searchQuery || options.searchTerm;
      query = query.or(`text.ilike.%${searchValue}%,author.ilike.%${searchValue}%`);
    }
    
    if (options.filterTag || options.tag) {
      const tagValue = options.filterTag || options.tag;
      query = query.contains('tags', [tagValue]);
    }
    
    // Apply sorting
    const sortColumn = options.sortColumn || 'created_at';
    const sortAscending = options.sortAscending !== undefined ? options.sortAscending : false;
    query = query.order(sortColumn, { ascending: sortAscending });
    
    // Apply pagination
    if (options.limit) {
      if (options.offset !== undefined) {
        query = query.range(options.offset, options.offset + options.limit - 1);
      } else {
        query = query.limit(options.limit);
      }
    }
    
    // Execute query - properly await the Promise
    const { data: quotesData, error: quotesError, count } = await query;
    
    if (quotesError) throw quotesError;
    if (!quotesData || quotesData.length === 0) return { quotes: [], count: 0 };
    
    // Get unique user IDs
    const userIds = [...new Set(quotesData.map(quote => quote.user_id).filter(Boolean))];
    
    // Batch fetch user profiles and format quotes in parallel
    const [profilesResult] = await batchOperations([
      async () => {
        if (userIds.length === 0) return [];
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, name, avatar_url, status')
          .in('id', userIds);
        
        if (error) throw error;
        return data || [];
      }
    ]);
    
    // Create a map of profiles by user ID
    const profilesMap: Record<string, any> = {};
    profilesResult.forEach(profile => {
      profilesMap[profile.id] = profile;
    });
    
    // Format quotes with user data
    const formattedQuotes = quotesData.map(quote => {
      const userProfile = profilesMap[quote.user_id] || {
        id: null,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      };
      
      return {
        ...quote,
        user: userProfile
      };
    });
    
    return {
      quotes: formattedQuotes as QuoteWithUser[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error in fetchQuotesOptimized:', error);
    return { quotes: [], count: 0 };
  }
};

/**
 * Fetch a quote by ID with optimized error handling
 * 
 * @param id - The ID of the quote to fetch
 * @returns A promise that resolves to the quote or null if not found
 */
export const fetchQuoteByIdOptimized = async (id: string): Promise<QuoteWithUser | null> => {
  try {
    // Execute both queries in parallel using batch operations
    const [quoteResult, profileResult] = await batchOperations([
      () => executeQuery(() => supabase.from('quotes').select('*').eq('id', id).single()),
      async () => {
        const quoteData = await supabase.from('quotes').select('user_id').eq('id', id).single();
        if (quoteData.error || !quoteData.data?.user_id) return null;
        
        const profileData = await supabase
          .from('profiles')
          .select('id, username, name, avatar_url, status')
          .eq('id', quoteData.data.user_id)
          .single();
          
        return profileData.error ? null : profileData.data;
      }
    ]);
    
    if (!quoteResult) return null;
    
    // Combine quote with user data
    return {
      ...quoteResult,
      user: profileResult || {
        id: null,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      }
    } as QuoteWithUser;
  } catch (error) {
    console.error('Error in fetchQuoteByIdOptimized:', error);
    return null;
  }
};

/**
 * Create a quote with optimized validation and error handling
 * 
 * @param quoteData - The data for the new quote
 * @returns A promise that resolves to the created quote or null if creation failed
 */
export const createQuoteOptimized = async (
  quoteData: QuoteSubmission
): Promise<QuoteWithUser | null> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Validate required fields
    const { text, author, category } = quoteData;
    if (!text || !author || !category) {
      throw new Error('Missing required fields: text, author, and category are required');
    }
    
    // Insert the quote - Fix issue with awaiting the Promise
    const { data: newQuote, error: insertError } = await supabase
      .from('quotes')
      .insert({
        text,
        author,
        source: quoteData.source || null,
        category,
        tags: quoteData.tags || [],
        user_id: userData.user.id
      })
      .select();
      
    if (insertError) throw insertError;
    if (!newQuote || newQuote.length === 0) throw new Error('Failed to create quote');
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, name, avatar_url, status')
      .eq('id', userData.user.id)
      .single();
    
    // Return the quote with user data
    return {
      ...newQuote[0],
      user: profileError || !profile ? {
        id: userData.user.id,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      } : profile
    } as QuoteWithUser;
  } catch (error) {
    console.error('Error in createQuoteOptimized:', error);
    return null;
  }
};
