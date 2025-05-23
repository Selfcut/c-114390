import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser, QuoteFilterOptions } from './types';

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
    
    // Execute query - properly await the PostgrestBuilder to get the Promise result
    const { data: quotesData, error: quotesError, count } = await query;
    
    if (quotesError) throw quotesError;
    if (!quotesData || quotesData.length === 0) return { quotes: [], count: 0 };
    
    // Get unique user IDs
    const userIds = [...new Set(quotesData.map(quote => quote.user_id).filter(Boolean))];
    
    // Batch fetch user profiles - fixed by using a properly typed operation
    const profilesResult = await supabase
      .from('profiles')
      .select('id, username, name, avatar_url, status')
      .in('id', userIds.length > 0 ? userIds : ['no-user-ids']);  // Avoid empty IN clause
    
    const profiles = profilesResult.data || [];
    
    // Create a map of profiles by user ID
    const profilesMap: Record<string, any> = {};
    profiles.forEach(profile => {
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
    // Execute quote and profile queries separately to avoid type issues
    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (quoteError || !quoteData) return null;
    
    // Fetch user profile if quote has a user_id
    let profileData = null;
    if (quoteData.user_id) {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url, status')
        .eq('id', quoteData.user_id)
        .single();
        
      if (!profileError) {
        profileData = data;
      }
    }
    
    // Combine quote with user data
    return {
      ...quoteData,
      user: profileData || {
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
