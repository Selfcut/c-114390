// Import supabase client
import { supabase } from '@/integrations/supabase/client';

// Batch operations for optimized data fetching
export const batchOperations = async (operations: Array<() => Promise<any>>) => {
  return Promise.all(operations.map(operation => operation()));
};

// Check if a user has liked or bookmarked a piece of content
export const checkUserContentInteractions = async (
  userId: string,
  contentId: string,
  contentType: string
) => {
  try {
    // Determine table names based on content type
    const likesTable = contentType === 'quote' ? 'quote_likes' : 'content_likes';
    const bookmarksTable = contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
    const idField = contentType === 'quote' ? 'quote_id' : 'content_id';
    
    // Execute batch operations to check likes and bookmarks
    const [likesResult, bookmarksResult] = await batchOperations([
      async () => {
        const { data, error } = await supabase
          .from(likesTable)
          .select('id')
          .eq(idField, contentId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        return !!data;
      },
      async () => {
        const { data, error } = await supabase
          .from(bookmarksTable)
          .select('id')
          .eq(idField, contentId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        return !!data;
      }
    ]);
    
    return {
      hasLiked: likesResult,
      hasBookmarked: bookmarksResult
    };
  } catch (error) {
    console.error('Error checking user content interactions:', error);
    return {
      hasLiked: false,
      hasBookmarked: false
    };
  }
};

// Increment a counter on a content item
export const incrementCounter = async (
  contentId: string,
  counterName: string,
  tableName: string
) => {
  try {
    const { error } = await supabase.rpc('increment_counter_fn', {
      row_id: contentId,
      column_name: counterName,
      table_name: tableName
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error incrementing ${counterName} counter:`, error);
    return false;
  }
};

// Decrement a counter on a content item
export const decrementCounter = async (
  contentId: string,
  counterName: string,
  tableName: string
) => {
  try {
    const { error } = await supabase.rpc('decrement_counter_fn', {
      row_id: contentId,
      column_name: counterName,
      table_name: tableName
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error decrementing ${counterName} counter:`, error);
    return false;
  }
};
