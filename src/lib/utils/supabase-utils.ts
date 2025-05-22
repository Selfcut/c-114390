
// Import supabase client
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type definitions for better type safety
export interface CounterOptions {
  contentId: string;
  counterName: string;
  tableName: string;
  silent?: boolean;
}

export interface ContentInteractions {
  hasLiked: boolean;
  hasBookmarked: boolean;
}

// Use a simple type definition without generics to avoid excessive type instantiation
export type BatchOperation = () => Promise<unknown>;

/**
 * Initialize necessary Supabase utilities
 * @returns Promise<boolean> indicating success
 */
export const initializeSupabaseUtils = async (): Promise<boolean> => {
  try {
    console.log('[Supabase Utils] Initialized');
    return true;
  } catch (error) {
    console.error('[Supabase Utils] Initialization error:', error);
    return false;
  }
};

/**
 * Execute multiple operations in parallel with optimized error handling
 * @param operations Array of functions that return promises
 * @returns Promise with array of results
 */
export const batchOperations = async (operations: BatchOperation[]): Promise<unknown[]> => {
  return Promise.all(operations.map(operation => operation()));
};

/**
 * Check if a user has liked or bookmarked a piece of content
 * @param userId The user ID
 * @param contentId The content ID
 * @param contentType The content type (quote, forum, etc.)
 * @returns Object with hasLiked and hasBookmarked booleans
 */
export const checkUserContentInteractions = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<ContentInteractions> => {
  try {
    // Determine table names based on content type
    const likesTable = contentType === 'quote' ? 'quote_likes' : 'content_likes';
    const bookmarksTable = contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
    const idField = contentType === 'quote' ? 'quote_id' : 'content_id';
    
    // Execute queries in parallel for better performance
    const [likesResult, bookmarksResult] = await Promise.all([
      // Check if user has liked the content
      supabase
        .from(likesTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .maybeSingle(),
      // Check if user has bookmarked the content
      supabase
        .from(bookmarksTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .maybeSingle()
    ]);
    
    return {
      hasLiked: !!likesResult.data,
      hasBookmarked: !!bookmarksResult.data
    };
  } catch (error) {
    console.error('[Supabase Utils] Error checking user content interactions:', error);
    return {
      hasLiked: false,
      hasBookmarked: false
    };
  }
};

/**
 * Increment a counter on a content item
 * @param contentId The content ID
 * @param counterName The counter column name
 * @param tableName The table name
 * @param silent Optional flag to suppress error logging
 * @returns Promise<boolean> indicating success
 */
export const incrementCounter = async (
  contentId: string,
  counterName: string,
  tableName: string,
  silent = false
): Promise<boolean> => {
  try {
    await supabase.rpc('increment_counter_fn', {
      row_id: contentId,
      column_name: counterName,
      table_name: tableName
    });
    
    return true;
  } catch (error) {
    if (!silent) {
      console.error(`[Supabase Utils] Error incrementing ${counterName} counter:`, error);
    }
    return false;
  }
};

/**
 * Decrement a counter on a content item
 * @param contentId The content ID
 * @param counterName The counter column name
 * @param tableName The table name
 * @param silent Optional flag to suppress error logging
 * @returns Promise<boolean> indicating success
 */
export const decrementCounter = async (
  contentId: string,
  counterName: string,
  tableName: string,
  silent = false
): Promise<boolean> => {
  try {
    await supabase.rpc('decrement_counter_fn', {
      row_id: contentId,
      column_name: counterName,
      table_name: tableName
    });
    
    return true;
  } catch (error) {
    if (!silent) {
      console.error(`[Supabase Utils] Error decrementing ${counterName} counter:`, error);
    }
    return false;
  }
};

// Define explicit separate interfaces for different insert operations
interface QuoteLikeInsert {
  quote_id: string;
  user_id: string;
}

interface QuoteBookmarkInsert {
  quote_id: string;
  user_id: string;
}

interface ContentLikeInsert {
  content_id: string;
  user_id: string;
  content_type: string;
}

interface ContentBookmarkInsert {
  content_id: string;
  user_id: string;
  content_type: string;
}

/**
 * Toggle a user interaction (like or bookmark) on content
 * @param type The interaction type ('like' or 'bookmark')
 * @param userId The user ID
 * @param contentId The content ID
 * @param contentType The content type (quote, forum, etc.)
 * @returns Promise<boolean> indicating new state
 */
export const toggleUserInteraction = async (
  type: 'like' | 'bookmark',
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  try {
    // Determine table and field names
    const isLike = type === 'like';
    const tableName = contentType === 'quote' 
      ? (isLike ? 'quote_likes' : 'quote_bookmarks')
      : (isLike ? 'content_likes' : 'content_bookmarks');
    
    const counterName = isLike ? 'likes' : 'bookmarks';
    const idField = contentType === 'quote' ? 'quote_id' : 'content_id';
    const contentTableName = contentType === 'quote' ? 'quotes' : `${contentType}_posts`;

    // Check if interaction exists
    const { data: existingData, error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;

    if (existingData) {
      // Remove interaction
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', existingData.id);
        
      if (deleteError) throw deleteError;
      
      // Only decrement count for supported counters
      const counterSupported = isLike || (contentType === 'quote');
      if (counterSupported) {
        await decrementCounter(contentId, counterName, contentTableName);
      }
      
      return false;
    } else {
      // Add interaction - use specialized types for each combination
      if (contentType === 'quote') {
        if (isLike) {
          // Use specific interface for quote likes
          const quoteData: QuoteLikeInsert = {
            quote_id: contentId,
            user_id: userId
          };
          // Create separate insert call
          const { error } = await supabase
            .from(tableName)
            .insert(quoteData);
            
          if (error) throw error;
        } else {
          // Use specific interface for quote bookmarks
          const quoteData: QuoteBookmarkInsert = {
            quote_id: contentId,
            user_id: userId
          };
          // Create separate insert call
          const { error } = await supabase
            .from(tableName)
            .insert(quoteData);
            
          if (error) throw error;
        }
      } else {
        if (isLike) {
          // Use specific interface for content likes
          const contentData: ContentLikeInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          // Create separate insert call
          const { error } = await supabase
            .from(tableName)
            .insert(contentData);
            
          if (error) throw error;
        } else {
          // Use specific interface for content bookmarks
          const contentData: ContentBookmarkInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          // Create separate insert call
          const { error } = await supabase
            .from(tableName)
            .insert(contentData);
            
          if (error) throw error;
        }
      }
      
      // Only increment count for supported counters
      const counterSupported = isLike || (contentType === 'quote');
      if (counterSupported) {
        await incrementCounter(contentId, counterName, contentTableName);
      }
      
      return true;
    }
  } catch (error) {
    console.error(`[Supabase Utils] Error toggling ${type}:`, error);
    toast.error(`Could not ${type} the content. Please try again.`);
    return false;
  }
};
