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
    
    // Apply sorting
    const sortColumn = options.sortColumn || 'created_at';
    const sortAscending = options.sortAscending !== undefined ? options.sortAscending : false;
    
    query = query.order(sortColumn, { ascending: sortAscending });
    
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

/**
 * Fetch a single quote by ID
 */
export const fetchQuoteById = async (id: string): Promise<QuoteWithUser | null> => {
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
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return formatQuote(data);
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
