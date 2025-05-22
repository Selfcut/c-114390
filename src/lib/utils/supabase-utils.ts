
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

// Simplify return type to avoid excessive type instantiation
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
    
    // Use type assertion to simplify types and avoid excessive type instantiation
    type SimpleResponse = { data: any; error: any };
    
    // Execute separate queries to avoid deep type instantiation
    const likesQuery: SimpleResponse = await supabase
      .from(likesTable)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    const bookmarksQuery: SimpleResponse = await supabase
      .from(bookmarksTable)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    return {
      hasLiked: !!likesQuery.data,
      hasBookmarked: !!bookmarksQuery.data
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
    const result = await supabase.rpc('increment_counter_fn', {
      row_id: contentId,
      column_name: counterName,
      table_name: tableName
    });
    
    if (result.error) throw result.error;
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
    const result = await supabase.rpc('decrement_counter_fn', {
      row_id: contentId,
      column_name: counterName,
      table_name: tableName
    });
    
    if (result.error) throw result.error;
    return true;
  } catch (error) {
    if (!silent) {
      console.error(`[Supabase Utils] Error decrementing ${counterName} counter:`, error);
    }
    return false;
  }
};

// Define explicit separate interfaces for insert operations to avoid deep type instantiation
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

    // Use type assertion to simplify types
    type SimpleDbResponse = { data: any; error: any };

    // Check if interaction exists
    const checkQuery: SimpleDbResponse = await supabase
      .from(tableName)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    const existingData = checkQuery.data;
    const checkError = checkQuery.error;
      
    if (checkError) throw checkError;

    if (existingData) {
      // Remove interaction
      const deleteQuery: SimpleDbResponse = await supabase
        .from(tableName)
        .delete()
        .eq('id', existingData.id);
        
      if (deleteQuery.error) throw deleteQuery.error;
      
      // Only decrement count for supported counters
      const counterSupported = isLike || (contentType === 'quote');
      if (counterSupported) {
        await decrementCounter(contentId, counterName, contentTableName);
      }
      
      return false;
    } else {
      // Add interaction - handle each case separately to avoid complex typing
      let error = null;
      
      if (contentType === 'quote') {
        if (isLike) {
          // Quote like
          const insertData: QuoteLikeInsert = {
            quote_id: contentId,
            user_id: userId
          };
          
          const result: SimpleDbResponse = await supabase
            .from(tableName)
            .insert(insertData);
            
          error = result.error;
        } else {
          // Quote bookmark
          const insertData: QuoteBookmarkInsert = {
            quote_id: contentId,
            user_id: userId
          };
          
          const result: SimpleDbResponse = await supabase
            .from(tableName)
            .insert(insertData);
            
          error = result.error;
        }
      } else {
        if (isLike) {
          // Content like
          const insertData: ContentLikeInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          
          const result: SimpleDbResponse = await supabase
            .from(tableName)
            .insert(insertData);
            
          error = result.error;
        } else {
          // Content bookmark
          const insertData: ContentBookmarkInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          
          const result: SimpleDbResponse = await supabase
            .from(tableName)
            .insert(insertData);
            
          error = result.error;
        }
      }
      
      if (error) throw error;
      
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
