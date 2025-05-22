
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

// Simplified type for Supabase query results to avoid deep typing issues
type SimpleSupabaseResult = {
  data: any;
  error: any;
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
    
    // Avoid type inference by using raw queries without destructuring
    const likesQuery = supabase
      .from(likesTable)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    const likesResult = await likesQuery;
    const likesData = likesResult.data;
    const likesError = likesResult.error;
    
    // Handle bookmarks query similarly with direct assignment
    const bookmarksQuery = supabase
      .from(bookmarksTable)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    const bookmarksResult = await bookmarksQuery;
    const bookmarksData = bookmarksResult.data;
    const bookmarksError = bookmarksResult.error;
    
    // Check for errors
    if (likesError) {
      console.warn('[Supabase Utils] Error checking likes:', likesError);
    }
    
    if (bookmarksError) {
      console.warn('[Supabase Utils] Error checking bookmarks:', bookmarksError);
    }
    
    return {
      hasLiked: !!likesData,
      hasBookmarked: !!bookmarksData
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

    // Check if interaction exists using direct query without type generics
    const checkQuery = supabase
      .from(tableName)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    // Use await with direct assignment to avoid complex typing
    const checkResult = await checkQuery;
    const checkData = checkResult.data;
    const checkError = checkResult.error;
      
    if (checkError) throw checkError;

    if (checkData) {
      // Remove interaction - use direct query handling
      const deleteQuery = supabase
        .from(tableName)
        .delete()
        .eq('id', checkData.id);
        
      const deleteResult = await deleteQuery;
      if (deleteResult.error) throw deleteResult.error;
      
      // Only decrement count for supported counters
      const counterSupported = isLike || (contentType === 'quote');
      if (counterSupported) {
        await decrementCounter(contentId, counterName, contentTableName);
      }
      
      return false;
    } else {
      // Add interaction - handle each case separately to avoid complex type inference
      let insertResult;
      
      if (contentType === 'quote') {
        if (isLike) {
          // Quote like - use simple object for insert data
          const insertData: QuoteLikeInsert = {
            quote_id: contentId,
            user_id: userId
          };
          
          const insertQuery = supabase
            .from(tableName)
            .insert(insertData);
          
          insertResult = await insertQuery;
        } else {
          // Quote bookmark - use simple object for insert data
          const insertData: QuoteBookmarkInsert = {
            quote_id: contentId,
            user_id: userId
          };
          
          const insertQuery = supabase
            .from(tableName)
            .insert(insertData);
          
          insertResult = await insertQuery;
        }
      } else {
        if (isLike) {
          // Content like - use simple object for insert data
          const insertData: ContentLikeInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          
          const insertQuery = supabase
            .from(tableName)
            .insert(insertData);
          
          insertResult = await insertQuery;
        } else {
          // Content bookmark - use simple object for insert data
          const insertData: ContentBookmarkInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          
          const insertQuery = supabase
            .from(tableName)
            .insert(insertData);
          
          insertResult = await insertQuery;
        }
      }
      
      if (insertResult.error) throw insertResult.error;
      
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
