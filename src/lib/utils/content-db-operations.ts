
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';

// Explicit type definitions to avoid recursion
type QuoteLikeRecord = {
  quote_id: string;
  user_id: string;
};

type ContentLikeRecord = {
  content_id: string;
  user_id: string;
  content_type: string;
};

type QuoteBookmarkRecord = {
  quote_id: string;
  user_id: string;
};

type ContentBookmarkRecord = {
  content_id: string;
  user_id: string;
  content_type: string;
};

/**
 * Interface for user interaction check results
 */
export interface UserInteractionStatus {
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * Normalize content type to string
 */
const normalizeType = (contentType: string | ContentType): string => {
  return String(contentType).toLowerCase();
};

/**
 * Get table names for content type
 */
const getTableNames = (contentType: string) => {
  const isQuote = contentType === 'quote';
  return {
    contentTable: isQuote ? 'quotes' : getContentTableName(contentType),
    likesTable: isQuote ? 'quote_likes' : 'content_likes',
    bookmarksTable: isQuote ? 'quote_bookmarks' : 'content_bookmarks',
    contentIdField: isQuote ? 'quote_id' : 'content_id',
    likesColumn: contentType === 'forum' ? 'upvotes' : 'likes'
  };
};

/**
 * Get content table name
 */
const getContentTableName = (contentType: string): string => {
  switch (contentType) {
    case 'forum': return 'forum_posts';
    case 'media': return 'media_posts';
    case 'wiki': return 'wiki_articles';
    case 'knowledge': return 'knowledge_entries';
    case 'research': return 'research_papers';
    case 'ai': return 'ai_content';
    default: return 'forum_posts';
  }
};

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
    const normalizedType = normalizeType(contentType);
    const { likesTable, bookmarksTable, contentIdField } = getTableNames(normalizedType);
    
    if (normalizedType === 'quote') {
      // Handle quotes
      const [likeResult, bookmarkResult] = await Promise.all([
        supabase
          .from('quote_likes' as const)
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('quote_bookmarks' as const)
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle()
      ]);
      
      return {
        isLiked: !!likeResult.data,
        isBookmarked: !!bookmarkResult.data
      };
    } else {
      // Handle other content types
      const [likeResult, bookmarkResult] = await Promise.all([
        supabase
          .from('content_likes' as const)
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType)
          .maybeSingle(),
        supabase
          .from('content_bookmarks' as const)
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType)
          .maybeSingle()
      ]);
      
      return {
        isLiked: !!likeResult.data,
        isBookmarked: !!bookmarkResult.data
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
    const normalizedType = normalizeType(contentType);
    const { contentTable, likesColumn } = getTableNames(normalizedType);
    
    if (normalizedType === 'quote') {
      // Handle quotes
      const { data: existingLike } = await supabase
        .from('quote_likes' as const)
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingLike) {
        // Remove like
        await supabase
          .from('quote_likes' as const)
          .delete()
          .eq('id', existingLike.id);
          
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: likesColumn,
          table_name: contentTable
        });
        
        return false;
      } else {
        // Add like
        const likeRecord: QuoteLikeRecord = {
          user_id: userId,
          quote_id: contentId
        };
        
        await supabase
          .from('quote_likes' as const)
          .insert(likeRecord);
          
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: likesColumn,
          table_name: contentTable
        });
        
        return true;
      }
    } else {
      // Handle other content types
      const { data: existingLike } = await supabase
        .from('content_likes' as const)
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (existingLike) {
        // Remove like
        await supabase
          .from('content_likes' as const)
          .delete()
          .eq('id', existingLike.id);
          
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: likesColumn,
          table_name: contentTable
        });
        
        return false;
      } else {
        // Add like
        const likeRecord: ContentLikeRecord = {
          user_id: userId,
          content_id: contentId,
          content_type: normalizedType
        };
        
        await supabase
          .from('content_likes' as const)
          .insert(likeRecord);
          
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: likesColumn,
          table_name: contentTable
        });
        
        return true;
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
    const normalizedType = normalizeType(contentType);
    const { contentTable } = getTableNames(normalizedType);
    
    if (normalizedType === 'quote') {
      // Handle quotes
      const { data: existingBookmark } = await supabase
        .from('quote_bookmarks' as const)
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingBookmark) {
        // Remove bookmark
        await supabase
          .from('quote_bookmarks' as const)
          .delete()
          .eq('id', existingBookmark.id);
          
        // Only increment bookmarks counter for quotes
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: 'bookmarks',
          table_name: contentTable
        });
        
        return false;
      } else {
        // Add bookmark
        const bookmarkRecord: QuoteBookmarkRecord = {
          user_id: userId,
          quote_id: contentId
        };
        
        await supabase
          .from('quote_bookmarks' as const)
          .insert(bookmarkRecord);
          
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'bookmarks',
          table_name: contentTable
        });
        
        return true;
      }
    } else {
      // Handle other content types
      const { data: existingBookmark } = await supabase
        .from('content_bookmarks' as const)
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (existingBookmark) {
        // Remove bookmark
        await supabase
          .from('content_bookmarks' as const)
          .delete()
          .eq('id', existingBookmark.id);
        
        return false;
      } else {
        // Add bookmark
        const bookmarkRecord: ContentBookmarkRecord = {
          user_id: userId,
          content_id: contentId,
          content_type: normalizedType
        };
        
        await supabase
          .from('content_bookmarks' as const)
          .insert(bookmarkRecord);
        
        return true;
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
    const normalizedType = normalizeType(contentType);
    const result: Record<string, UserInteractionStatus> = {};
    
    // Initialize default values
    contentIds.forEach(id => {
      result[id] = { isLiked: false, isBookmarked: false };
    });
    
    if (normalizedType === 'quote') {
      // Handle quotes
      const [likesData, bookmarksData] = await Promise.all([
        supabase
          .from('quote_likes' as const)
          .select('quote_id')
          .eq('user_id', userId)
          .in('quote_id', contentIds),
        supabase
          .from('quote_bookmarks' as const)
          .select('quote_id')
          .eq('user_id', userId)
          .in('quote_id', contentIds)
      ]);
      
      if (likesData.data) {
        likesData.data.forEach(like => {
          if (result[like.quote_id]) {
            result[like.quote_id].isLiked = true;
          }
        });
      }
      
      if (bookmarksData.data) {
        bookmarksData.data.forEach(bookmark => {
          if (result[bookmark.quote_id]) {
            result[bookmark.quote_id].isBookmarked = true;
          }
        });
      }
    } else {
      // Handle other content types
      const [likesData, bookmarksData] = await Promise.all([
        supabase
          .from('content_likes' as const)
          .select('content_id')
          .eq('user_id', userId)
          .eq('content_type', normalizedType)
          .in('content_id', contentIds),
        supabase
          .from('content_bookmarks' as const)
          .select('content_id')
          .eq('user_id', userId)
          .eq('content_type', normalizedType)
          .in('content_id', contentIds)
      ]);
      
      if (likesData.data) {
        likesData.data.forEach(like => {
          if (result[like.content_id]) {
            result[like.content_id].isLiked = true;
          }
        });
      }
      
      if (bookmarksData.data) {
        bookmarksData.data.forEach(bookmark => {
          if (result[bookmark.content_id]) {
            result[bookmark.content_id].isBookmarked = true;
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
