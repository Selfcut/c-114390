
import { supabase } from '@/integrations/supabase/client';
import { getContentTableInfo } from '@/lib/utils/content-type-utils';
import { ContentType } from '@/types/contentTypes';

/**
 * User interaction status result
 */
export interface UserInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * Check if a user has liked or bookmarked a specific content item
 */
export const checkUserInteractions = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<UserInteractionStatus> => {
  if (!userId || !contentId) {
    return { isLiked: false, isBookmarked: false };
  }

  try {
    const tableInfo = getContentTableInfo(contentType);
    const isQuote = contentType === ContentType.Quote;
    
    // Check likes
    let likeQuery;
    if (isQuote) {
      likeQuery = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      likeQuery = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .maybeSingle();
    }
    
    // Check bookmarks
    let bookmarkQuery;
    if (isQuote) {
      bookmarkQuery = await supabase
        .from('quote_bookmarks')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      bookmarkQuery = await supabase
        .from('content_bookmarks')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .maybeSingle();
    }
    
    return {
      isLiked: !!likeQuery.data,
      isBookmarked: !!bookmarkQuery.data
    };
  } catch (error) {
    console.error('Error checking user interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Toggle like status for a content item
 */
export const toggleLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const tableInfo = getContentTableInfo(contentType);
    const isQuote = contentType === ContentType.Quote;
    
    // Check if already liked
    let existingLikeQuery;
    if (isQuote) {
      existingLikeQuery = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      existingLikeQuery = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .maybeSingle();
    }
    
    const isLiked = !!existingLikeQuery.data;
    
    if (isLiked) {
      // Remove like
      if (isQuote) {
        await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', contentId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', contentType);
      }
      
      // Decrement like count
      await supabase.rpc('decrement_counter_fn', {
        row_id: contentId,
        column_name: tableInfo.likesColumnName,
        table_name: tableInfo.contentTable
      });
      
      return false;
    } else {
      // Add like
      if (isQuote) {
        await supabase
          .from('quote_likes')
          .insert({
            quote_id: contentId,
            user_id: userId
          });
      } else {
        await supabase
          .from('content_likes')
          .insert({
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          });
      }
      
      // Increment like count
      await supabase.rpc('increment_counter_fn', {
        row_id: contentId,
        column_name: tableInfo.likesColumnName,
        table_name: tableInfo.contentTable
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
};

/**
 * Toggle bookmark status for a content item
 */
export const toggleBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const tableInfo = getContentTableInfo(contentType);
    const isQuote = contentType === ContentType.Quote;
    
    // Check if already bookmarked
    let existingBookmarkQuery;
    if (isQuote) {
      existingBookmarkQuery = await supabase
        .from('quote_bookmarks')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      existingBookmarkQuery = await supabase
        .from('content_bookmarks')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .maybeSingle();
    }
    
    const isBookmarked = !!existingBookmarkQuery.data;
    
    if (isBookmarked) {
      // Remove bookmark
      if (isQuote) {
        await supabase
          .from('quote_bookmarks')
          .delete()
          .eq('quote_id', contentId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', contentType);
      }
      
      // Only quotes track bookmark counts
      if (isQuote && tableInfo.bookmarksColumnName) {
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: tableInfo.bookmarksColumnName,
          table_name: tableInfo.contentTable
        });
      }
      
      return false;
    } else {
      // Add bookmark
      if (isQuote) {
        await supabase
          .from('quote_bookmarks')
          .insert({
            quote_id: contentId,
            user_id: userId
          });
      } else {
        await supabase
          .from('content_bookmarks')
          .insert({
            content_id: contentId,
            user_id: userId,
            content_type: contentType
          });
      }
      
      // Only quotes track bookmark counts
      if (isQuote && tableInfo.bookmarksColumnName) {
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: tableInfo.bookmarksColumnName,
          table_name: tableInfo.contentTable
        });
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};

/**
 * Batch check user interactions for multiple content items
 */
export const batchCheckInteractions = async (
  userId: string,
  contentIds: string[],
  contentType: string
): Promise<Record<string, UserInteractionStatus>> => {
  if (!userId || !contentIds.length) {
    return {};
  }
  
  const results: Record<string, UserInteractionStatus> = {};
  const isQuote = contentType === ContentType.Quote;
  
  try {
    // Batch check likes
    let likesQuery;
    if (isQuote) {
      likesQuery = await supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds);
    } else {
      likesQuery = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .in('content_id', contentIds);
    }
    
    // Batch check bookmarks
    let bookmarksQuery;
    if (isQuote) {
      bookmarksQuery = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds);
    } else {
      bookmarksQuery = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .in('content_id', contentIds);
    }
    
    // Initialize all results to false
    contentIds.forEach(id => {
      results[id] = { isLiked: false, isBookmarked: false };
    });
    
    // Mark liked items
    if (likesQuery.data) {
      likesQuery.data.forEach(item => {
        const id = isQuote ? item.quote_id : item.content_id;
        if (results[id]) {
          results[id].isLiked = true;
        }
      });
    }
    
    // Mark bookmarked items
    if (bookmarksQuery.data) {
      bookmarksQuery.data.forEach(item => {
        const id = isQuote ? item.quote_id : item.content_id;
        if (results[id]) {
          results[id].isBookmarked = true;
        }
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error batch checking interactions:', error);
    return results;
  }
};
