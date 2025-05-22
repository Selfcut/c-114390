
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { incrementCounter, decrementCounter } from './counter-operations';

// Content interaction interfaces for better type safety
export interface ContentInteractions {
  hasLiked: boolean;
  hasBookmarked: boolean;
}

// Define explicit interfaces for insert operations to avoid deep type instantiation
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
    
    // Execute likes query directly without the wrapper function
    const { data: likesData, error: likesError } = await supabase
      .from(likesTable)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    // Execute the bookmarks query directly without the wrapper function
    const { data: bookmarksData, error: bookmarksError } = await supabase
      .from(bookmarksTable)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
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

    // Check if interaction exists using direct Supabase client
    const { data: checkData, error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) throw checkError;

    if (checkData) {
      // Remove interaction - use the data.id directly
      const recordId = checkData.id;
      if (!recordId) throw new Error('Could not find record ID');
      
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', recordId);
        
      if (deleteError) throw deleteError;
      
      // Only decrement count for supported counters
      const counterSupported = isLike || (contentType === 'quote');
      if (counterSupported) {
        await decrementCounter(contentId, counterName, contentTableName);
      }
      
      return false;
    } else {
      let insertError;
      
      if (contentType === 'quote') {
        if (isLike) {
          // Quote like - use explicit interface
          const insertData: QuoteLikeInsert = {
            quote_id: contentId,
            user_id: userId
          };
          
          // Use direct supabase client for insertion
          const { error } = await supabase
            .from(tableName)
            .insert(insertData);
            
          insertError = error;
        } else {
          // Quote bookmark - use explicit interface
          const insertData: QuoteBookmarkInsert = {
            quote_id: contentId,
            user_id: userId
          };
          
          // Use direct supabase client for insertion
          const { error } = await supabase
            .from(tableName)
            .insert(insertData);
            
          insertError = error;
        }
      } else {
        if (isLike) {
          // Content like - use explicit interface
          const insertData: ContentLikeInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          
          // Use direct supabase client for insertion
          const { error } = await supabase
            .from(tableName)
            .insert(insertData);
            
          insertError = error;
        } else {
          // Content bookmark - use explicit interface
          const insertData: ContentBookmarkInsert = {
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          };
          
          // Use direct supabase client for insertion
          const { error } = await supabase
            .from(tableName)
            .insert(insertData);
            
          insertError = error;
        }
      }
      
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
