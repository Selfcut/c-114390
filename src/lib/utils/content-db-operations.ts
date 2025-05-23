
import { supabase } from '@/integrations/supabase/client';
import { normalizeContentType, getContentTableInfo } from './content-type-utils';
import { ContentType } from '@/types/contentTypes';

// Use literal string constants to prevent type recursion
const QUOTE_LIKES_TABLE = 'quote_likes';
const CONTENT_LIKES_TABLE = 'content_likes';
const QUOTE_BOOKMARKS_TABLE = 'quote_bookmarks';
const CONTENT_BOOKMARKS_TABLE = 'content_bookmarks';

// Define explicit interfaces for database operations
interface QuoteLikePayload {
  quote_id: string;
  user_id: string;
}

interface ContentLikePayload {
  content_id: string;
  user_id: string;
  content_type: string;
}

interface QuoteBookmarkPayload {
  quote_id: string;
  user_id: string;
}

interface ContentBookmarkPayload {
  content_id: string;
  user_id: string;
  content_type: string;
}

/**
 * Error handler for database operations
 */
const handleDbError = (error: any, operation: string, fallbackValue: any = null): any => {
  console.error(`Database error during ${operation}:`, error);
  return fallbackValue;
};

/**
 * Interface for user interaction check results
 */
export interface UserInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * Check if a user has liked or bookmarked a content item
 */
export const checkUserInteractions = async (
  userId: string, 
  contentId: string, 
  contentType: string | ContentType
): Promise<UserInteractionStatus> => {
  if (!userId || !contentId) {
    return { isLiked: false, isBookmarked: false };
  }

  try {
    const normalizedType = normalizeContentType(contentType);
    const { contentIdField } = getContentTableInfo(normalizedType);
    
    // Separate code paths for quote vs other content types
    if (normalizedType === 'quote') {
      // Handle quote interactions - using explicit literal strings
      const { data: likeResult, error: likeError } = await supabase
        .from(QUOTE_LIKES_TABLE)
        .select('id')
        .eq(contentIdField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (likeError) throw likeError;
      
      const { data: bookmarkResult, error: bookmarkError } = await supabase
        .from(QUOTE_BOOKMARKS_TABLE)
        .select('id')
        .eq(contentIdField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (bookmarkError) throw bookmarkError;
      
      return {
        isLiked: !!likeResult,
        isBookmarked: !!bookmarkResult
      };
    } else {
      // Handle other content types - using explicit literal strings
      const { data: likeResult, error: likeError } = await supabase
        .from(CONTENT_LIKES_TABLE)
        .select('id')
        .eq(contentIdField, contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (likeError) throw likeError;
      
      const { data: bookmarkResult, error: bookmarkError } = await supabase
        .from(CONTENT_BOOKMARKS_TABLE)
        .select('id')
        .eq(contentIdField, contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (bookmarkError) throw bookmarkError;
      
      return {
        isLiked: !!likeResult,
        isBookmarked: !!bookmarkResult
      };
    }
  } catch (error) {
    console.error('Error checking user interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Toggle a user's like status for content
 */
export const toggleLike = async (
  userId: string,
  contentId: string,
  contentType: string | ContentType
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const normalizedType = normalizeContentType(contentType);
    const { 
      contentTable, 
      likesColumnName 
    } = getContentTableInfo(normalizedType);
    
    // Separate code paths for quotes vs other content
    if (normalizedType === 'quote') {
      // Check if the user has already liked this quote
      const { data, error: checkError } = await supabase
        .from(QUOTE_LIKES_TABLE)
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // If like exists, remove it
      if (data && 'id' in data) {
        const { error: deleteError } = await supabase
          .from(QUOTE_LIKES_TABLE)
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        
        // Decrement the like counter
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: likesColumnName,
          table_name: contentTable
        });
        
        return false; // No longer liked
      } else {
        // Insert new like with explicit payload type
        const payload: QuoteLikePayload = {
          user_id: userId,
          quote_id: contentId
        };
        
        const { error: insertError } = await supabase
          .from(QUOTE_LIKES_TABLE)
          .insert(payload);
          
        if (insertError) throw insertError;
        
        // Increment the like counter
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: likesColumnName,
          table_name: contentTable
        });
        
        return true; // Now liked
      }
    } else {
      // Handle other content types
      const { data, error: checkError } = await supabase
        .from(CONTENT_LIKES_TABLE)
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // If like exists, remove it
      if (data && 'id' in data) {
        const { error: deleteError } = await supabase
          .from(CONTENT_LIKES_TABLE)
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        
        // Decrement the like counter
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: likesColumnName,
          table_name: contentTable
        });
        
        return false; // No longer liked
      } else {
        // Insert new like with explicit payload type
        const payload: ContentLikePayload = {
          user_id: userId,
          content_id: contentId,
          content_type: normalizedType
        };
        
        const { error: insertError } = await supabase
          .from(CONTENT_LIKES_TABLE)
          .insert(payload);
          
        if (insertError) throw insertError;
        
        // Increment the like counter
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: likesColumnName,
          table_name: contentTable
        });
        
        return true; // Now liked
      }
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
};

/**
 * Toggle a user's bookmark status for content
 */
export const toggleBookmark = async (
  userId: string,
  contentId: string,
  contentType: string | ContentType
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const normalizedType = normalizeContentType(contentType);
    const { 
      contentTable, 
      bookmarksColumnName 
    } = getContentTableInfo(normalizedType);
    
    // Separate code paths for quotes vs other content
    if (normalizedType === 'quote') {
      // Check if the user has already bookmarked this quote
      const { data, error: checkError } = await supabase
        .from(QUOTE_BOOKMARKS_TABLE)
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // If bookmark exists, remove it
      if (data && 'id' in data) {
        const { error: deleteError } = await supabase
          .from(QUOTE_BOOKMARKS_TABLE)
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        
        // Only decrement counter if the column exists for this content type
        if (bookmarksColumnName) {
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: bookmarksColumnName,
            table_name: contentTable
          });
        }
        
        return false; // No longer bookmarked
      } else {
        // Insert new bookmark with explicit payload type
        const payload: QuoteBookmarkPayload = {
          user_id: userId,
          quote_id: contentId
        };
        
        const { error: insertError } = await supabase
          .from(QUOTE_BOOKMARKS_TABLE)
          .insert(payload);
          
        if (insertError) throw insertError;
        
        // Only increment counter if the column exists for this content type
        if (bookmarksColumnName) {
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: bookmarksColumnName,
            table_name: contentTable
          });
        }
        
        return true; // Now bookmarked
      }
    } else {
      // Handle other content types
      const { data, error: checkError } = await supabase
        .from(CONTENT_BOOKMARKS_TABLE)
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // If bookmark exists, remove it
      if (data && 'id' in data) {
        const { error: deleteError } = await supabase
          .from(CONTENT_BOOKMARKS_TABLE)
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        
        // Only decrement counter if the column exists for this content type
        if (bookmarksColumnName) {
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: bookmarksColumnName,
            table_name: contentTable
          });
        }
        
        return false; // No longer bookmarked
      } else {
        // Insert new bookmark with explicit payload type
        const payload: ContentBookmarkPayload = {
          user_id: userId,
          content_id: contentId,
          content_type: normalizedType
        };
        
        const { error: insertError } = await supabase
          .from(CONTENT_BOOKMARKS_TABLE)
          .insert(payload);
          
        if (insertError) throw insertError;
        
        // Only increment counter if the column exists for this content type
        if (bookmarksColumnName) {
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: bookmarksColumnName,
            table_name: contentTable
          });
        }
        
        return true; // Now bookmarked
      }
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};

/**
 * Batch check for user interactions on multiple content items
 */
export const batchCheckInteractions = async (
  userId: string,
  contentIds: string[],
  contentType: string | ContentType
): Promise<Record<string, UserInteractionStatus>> => {
  if (!userId || !contentIds.length) return {};
  
  try {
    const normalizedType = normalizeContentType(contentType);
    const result: Record<string, UserInteractionStatus> = {};
    
    // Initialize default values
    contentIds.forEach(id => {
      result[id] = { isLiked: false, isBookmarked: false };
    });
    
    // Use separate code paths to avoid type recursion
    if (normalizedType === 'quote') {
      // Batch check likes for quotes
      const { data: likesData, error: likesError } = await supabase
        .from(QUOTE_LIKES_TABLE)
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds);
        
      if (!likesError && likesData) {
        likesData.forEach(like => {
          const contentId = like.quote_id;
          if (result[contentId]) {
            result[contentId].isLiked = true;
          }
        });
      }
      
      // Batch check bookmarks for quotes
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from(QUOTE_BOOKMARKS_TABLE)
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds);
        
      if (!bookmarksError && bookmarksData) {
        bookmarksData.forEach(bookmark => {
          const contentId = bookmark.quote_id;
          if (result[contentId]) {
            result[contentId].isBookmarked = true;
          }
        });
      }
    } else {
      // Batch check likes for other content types
      const { data: likesData, error: likesError } = await supabase
        .from(CONTENT_LIKES_TABLE)
        .select('content_id')
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .in('content_id', contentIds);
        
      if (!likesError && likesData) {
        likesData.forEach(like => {
          const contentId = like.content_id;
          if (result[contentId]) {
            result[contentId].isLiked = true;
          }
        });
      }
      
      // Batch check bookmarks for other content types
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from(CONTENT_BOOKMARKS_TABLE)
        .select('content_id')
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .in('content_id', contentIds);
        
      if (!bookmarksError && bookmarksData) {
        bookmarksData.forEach(bookmark => {
          const contentId = bookmark.content_id;
          if (result[contentId]) {
            result[contentId].isBookmarked = true;
          }
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error batch checking interactions:', error);
    return {};
  }
};
