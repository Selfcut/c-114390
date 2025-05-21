
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
const formatQuote = (quote: any, userProfileMap?: Record<string, any>): QuoteWithUser => {
  let userObj;
  
  if (userProfileMap && quote.user_id) {
    userObj = userProfileMap[quote.user_id] || {
      id: null,
      username: 'unknown',
      name: 'Unknown User',
      avatar_url: null,
      status: 'offline'
    };
  } else if (quote.user) {
    userObj = formatUserData(quote.user);
  } else {
    userObj = {
      id: null,
      username: 'unknown',
      name: 'Unknown User',
      avatar_url: null,
      status: 'offline'
    };
  }
        
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
    // First, fetch all quotes
    const { data: quotesData, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (quotesError) throw quotesError;
    if (!quotesData || quotesData.length === 0) return [];
    
    // Get unique user IDs
    const userIds = [...new Set(quotesData.map(quote => quote.user_id))].filter(Boolean);
    
    // Then fetch user profiles in a separate query
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, name, avatar_url, status')
      .in('id', userIds);
    
    if (profilesError) throw profilesError;
    
    // Create a map of profiles by user ID
    const profilesMap: Record<string, any> = {};
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap[profile.id] = profile;
      });
    }
    
    // Combine quotes with their user data
    const formattedQuotes = quotesData.map(quote => formatQuote(quote, profilesMap));
    
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
    // First, fetch filtered quotes
    let query = supabase.from('quotes').select('*');
    
    // Apply filters if provided
    if (options.searchTerm) {
      query = query.or(
        `text.ilike.%${options.searchTerm}%,author.ilike.%${options.searchTerm}%`
      );
    }
    
    if (options.tag) {
      query = query.contains('tags', [options.tag]);
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
    
    const { data: quotesData, error: quotesError } = await query;
    
    if (quotesError) throw quotesError;
    if (!quotesData || quotesData.length === 0) return [];
    
    // Get unique user IDs
    const userIds = [...new Set(quotesData.map(quote => quote.user_id))].filter(Boolean);
    
    // Then fetch user profiles in a separate query
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, name, avatar_url, status')
      .in('id', userIds);
    
    if (profilesError) throw profilesError;
    
    // Create a map of profiles by user ID
    const profilesMap: Record<string, any> = {};
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap[profile.id] = profile;
      });
    }
    
    // Combine quotes with their user data
    const formattedQuotes = quotesData.map(quote => formatQuote(quote, profilesMap));
    
    return formattedQuotes;
  } catch (error) {
    console.error('Error fetching filtered quotes:', error);
    return [];
  }
};

/**
 * Fetch a single quote by ID
 */
export const fetchQuoteById = async (id: string): Promise<QuoteWithUser | null> => {
  try {
    // Fetch the quote
    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (quoteError) throw quoteError;
    if (!quoteData) return null;
    
    // Fetch the user profile in a separate query
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, name, avatar_url, status')
      .eq('id', quoteData.user_id)
      .maybeSingle();
    
    // Even if there's an error with the profile, we still want to return the quote
    if (profileError) {
      console.error('Error fetching quote author profile:', profileError);
    }
    
    // Format the quote with the user data
    const formattedQuote = {
      ...quoteData,
      user: profileData || {
        id: null,
        username: 'unknown',
        name: 'Unknown User',
        avatar_url: null,
        status: 'offline'
      }
    };
    
    return formattedQuote;
  } catch (error) {
    console.error('Error fetching quote by ID:', error);
    return null;
  }
};

/**
 * Count total quotes with filters
 */
export const countQuotes = async (options?: Pick<QuoteFilterOptions, 'searchTerm' | 'tag'>): Promise<number> => {
  try {
    let query = supabase
      .from('quotes')
      .select('id', { count: 'exact', head: true });
    
    // Apply filters if provided
    if (options?.searchTerm) {
      query = query.or(
        `text.ilike.%${options.searchTerm}%,author.ilike.%${options.searchTerm}%`
      );
    }
    
    if (options?.tag) {
      query = query.contains('tags', [options.tag]);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error counting quotes:', error);
    return 0;
  }
};

/**
 * Create a new quote
 */
export const createQuote = async (quoteSubmission: QuoteSubmission): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('quotes')
      .insert({
        text: quoteSubmission.text,
        author: quoteSubmission.author,
        source: quoteSubmission.source || null,
        category: quoteSubmission.category || 'Other',
        tags: quoteSubmission.tags || [],
        user_id: user.user.id
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error creating quote:', error);
    return false;
  }
};

/**
 * Update an existing quote
 */
export const updateQuote = async (quoteId: string, quoteData: Partial<QuoteSubmission>): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Verify quote belongs to the user before update
    const { data: quoteToUpdate, error: fetchError } = await supabase
      .from('quotes')
      .select('user_id')
      .eq('id', quoteId)
      .single();
      
    if (fetchError) throw fetchError;
    if (quoteToUpdate.user_id !== user.user.id) {
      throw new Error('Not authorized to edit this quote');
    }
    
    const { error } = await supabase
      .from('quotes')
      .update({
        text: quoteData.text,
        author: quoteData.author,
        source: quoteData.source || null,
        category: quoteData.category || 'Other',
        tags: quoteData.tags || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', quoteId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating quote:', error);
    return false;
  }
};

/**
 * Delete a quote
 */
export const deleteQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Verify quote belongs to the user before deletion
    const { data: quoteToDelete, error: fetchError } = await supabase
      .from('quotes')
      .select('user_id')
      .eq('id', quoteId)
      .single();
    
    if (fetchError) throw fetchError;
    if (quoteToDelete.user_id !== user.user.id) {
      throw new Error('Not authorized to delete this quote');
    }
    
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting quote:', error);
    return false;
  }
};
