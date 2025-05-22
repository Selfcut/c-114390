
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

export interface BatchOperation<T> {
  (): Promise<T>;
}

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
export const batchOperations = async <T>(operations: Array<BatchOperation<T>>): Promise<T[]> => {
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
    
    // Execute batch operations to check likes and bookmarks
    const [likesResult, bookmarksResult] = await Promise.all([
      // Check if user has liked the content
      (async () => {
        const { data, error } = await supabase
          .from(likesTable)
          .select('id')
          .eq(idField, contentId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        return !!data;
      })(),
      // Check if user has bookmarked the content
      (async () => {
        const { data, error } = await supabase
          .from(bookmarksTable)
          .select('id')
          .eq(idField, contentId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        return !!data;
      })()
    ]);
    
    return {
      hasLiked: likesResult,
      hasBookmarked: bookmarksResult
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
 * Unified counter operation function (increment or decrement)
 * @param operation 'increment' or 'decrement' 
 * @param options The counter options
 * @returns Promise<boolean> indicating success
 */
const counterOperation = async (
  operation: 'increment' | 'decrement',
  { contentId, counterName, tableName, silent = false }: CounterOptions
): Promise<boolean> => {
  try {
    const functionName = `${operation}_counter_fn`;
    const { error } = await supabase.rpc(functionName, {
      row_id: contentId,
      column_name: counterName,
      table_name: tableName
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    if (!silent) {
      console.error(`[Supabase Utils] Error ${operation}ing ${counterName} counter:`, error);
    }
    return false;
  }
};

/**
 * Increment a counter on a content item
 * @param options The counter options
 * @returns Promise<boolean> indicating success
 */
export const incrementCounter = async (
  contentId: string,
  counterName: string,
  tableName: string,
  silent = false
): Promise<boolean> => {
  return counterOperation('increment', { contentId, counterName, tableName, silent });
};

/**
 * Decrement a counter on a content item
 * @param options The counter options
 * @returns Promise<boolean> indicating success
 */
export const decrementCounter = async (
  contentId: string,
  counterName: string,
  tableName: string,
  silent = false
): Promise<boolean> => {
  return counterOperation('decrement', { contentId, counterName, tableName, silent });
};

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
    const contentTableName = contentType === 'quote' ? 'quotes' : contentType;

    // Check if interaction exists
    const { data, error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;

    if (data) {
      // Remove interaction
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', data.id);
        
      if (deleteError) throw deleteError;
      
      // Only decrement count for supported counters
      const counterSupported = isLike || (contentType === 'quote');
      if (counterSupported) {
        await decrementCounter(contentId, counterName, contentTableName);
      }
      
      return false;
    } else {
      // Add interaction
      const insertData: Record<string, any> = { user_id: userId };
      
      // Set the correct content id field
      insertData[idField] = contentId;
      
      // Add content_type field for non-quote tables
      if (contentType !== 'quote' && tableName.startsWith('content_')) {
        insertData.content_type = contentType;
      }
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(insertData);
        
      if (insertError) throw insertError;
      
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
