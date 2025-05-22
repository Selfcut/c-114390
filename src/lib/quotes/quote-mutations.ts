
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser, QuoteSubmission } from './types';

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

/**
 * Update an existing quote
 * 
 * @param quoteId - The ID of the quote to update
 * @param quoteData - The new data for the quote
 * @returns A promise that resolves to a boolean indicating success
 */
export const updateQuoteOptimized = async (
  quoteId: string,
  quoteData: Partial<QuoteSubmission>
): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Verify quote belongs to the user before update
    const { data: quoteToUpdate, error: fetchError } = await supabase
      .from('quotes')
      .select('user_id')
      .eq('id', quoteId)
      .single();
      
    if (fetchError) throw fetchError;
    if (quoteToUpdate.user_id !== userData.user.id) {
      throw new Error('Not authorized to edit this quote');
    }
    
    // Update the quote
    const { error } = await supabase
      .from('quotes')
      .update({
        ...(quoteData.text && { text: quoteData.text }),
        ...(quoteData.author && { author: quoteData.author }),
        ...(quoteData.source !== undefined && { source: quoteData.source }),
        ...(quoteData.category && { category: quoteData.category }),
        ...(quoteData.tags && { tags: quoteData.tags }),
        updated_at: new Date().toISOString()
      })
      .eq('id', quoteId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error in updateQuoteOptimized:', error);
    return false;
  }
};

/**
 * Delete a quote
 * 
 * @param quoteId - The ID of the quote to delete
 * @returns A promise that resolves to a boolean indicating success
 */
export const deleteQuoteOptimized = async (quoteId: string): Promise<boolean> => {
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
    console.error('Error in deleteQuoteOptimized:', error);
    return false;
  }
};
