
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser, QuoteFilterOptions, QuoteSubmission } from './types';

/**
 * Safely formats the user data from a quote record
 */
const formatUserData = (quoteUser: any) => {
  // Handle potential error or missing user data
  return typeof quoteUser === 'object' && 
    (quoteUser !== null && !Object.prototype.hasOwnProperty.call(quoteUser, 'error'))
    ? quoteUser
    : {
        id: null,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      };
};

/**
 * Formats a quote with user data
 */
const formatQuote = (quote: any): QuoteWithUser => {
  const userObj = formatUserData(quote.user);
        
  return {
    ...quote,
    user: userObj
  };
};

/**
 * Fetch all quotes with their associated user data
 */
export const fetchQuotes = async (): Promise<QuoteWithUser[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        user:profiles(
          id, 
          username, 
          name, 
          avatar_url, 
          status
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match our expected type
    const formattedQuotes = (data || []).map(quote => formatQuote(quote));
    
    return formattedQuotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
};

/**
 * Fetch quotes with optional filtering and pagination
 */
export const fetchQuotesWithFilters = async (
  options: QuoteFilterOptions
): Promise<QuoteWithUser[]> => {
  try {
    let query = supabase
      .from('quotes')
      .select(`
        *,
        user:profiles(
          id, 
          username, 
          name, 
          avatar_url, 
          status
        )
      `);
    
    // Apply filters if provided
    if (options.searchTerm) {
      query = query.or(
        `text.ilike.%${options.searchTerm}%,author.ilike.%${options.searchTerm}%`
      );
    }
    
    if (options.tag) {
      query = query.contains('tags', [options.tag]);
    }
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(
        options.offset, 
        options.offset + (options.limit || 10) - 1
      );
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to match our expected type
    const formattedQuotes = (data || []).map(quote => formatQuote(quote));
    
    return formattedQuotes;
  } catch (error) {
    console.error('Error fetching filtered quotes:', error);
    return [];
  }
};
