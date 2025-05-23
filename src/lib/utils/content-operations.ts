
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

/**
 * Normalize any content type to a simple string
 */
export const normalizeContentType = (type: string | ContentType | ContentItemType): string => {
  return String(type).toLowerCase();
};

/**
 * Get the content table name for a content type
 */
export const getContentTableName = (contentType: string): string => {
  switch (contentType) {
    case 'quote': return 'quotes';
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
 * Get the likes column name for a content type
 */
export const getLikesColumnName = (contentType: string): string => {
  return contentType === 'forum' ? 'upvotes' : 'likes';
};

/**
 * Check user interactions for any content type
 */
export const checkUserInteractions = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<{ isLiked: boolean; isBookmarked: boolean }> => {
  if (!userId || !contentId) {
    return { isLiked: false, isBookmarked: false };
  }

  try {
    const normalizedType = normalizeContentType(contentType);
    
    if (normalizedType === 'quote') {
      const [likeResult, bookmarkResult] = await Promise.all([
        supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('quote_bookmarks')
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
      const [likeResult, bookmarkResult] = await Promise.all([
        supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType)
          .maybeSingle(),
        supabase
          .from('content_bookmarks')
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
 * Toggle like for any content type
 */
export const toggleLike = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const normalizedType = normalizeContentType(contentType);
    const contentTable = getContentTableName(normalizedType);
    const likesColumn = getLikesColumnName(normalizedType);
    
    if (normalizedType === 'quote') {
      const { data: existingLike } = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingLike) {
        await supabase
          .from('quote_likes')
          .delete()
          .eq('id', existingLike.id);
          
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: likesColumn,
          table_name: 'quotes'
        });
        
        return false;
      } else {
        await supabase
          .from('quote_likes')
          .insert({
            user_id: userId,
            quote_id: contentId
          });
          
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: likesColumn,
          table_name: 'quotes'
        });
        
        return true;
      }
    } else {
      const { data: existingLike } = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (existingLike) {
        await supabase
          .from('content_likes')
          .delete()
          .eq('id', existingLike.id);
          
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: likesColumn,
          table_name: contentTable
        });
        
        return false;
      } else {
        await supabase
          .from('content_likes')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: normalizedType
          });
          
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
 * Toggle bookmark for any content type
 */
export const toggleBookmark = async (
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> => {
  if (!userId || !contentId) return false;
  
  try {
    const normalizedType = normalizeContentType(contentType);
    
    if (normalizedType === 'quote') {
      const { data: existingBookmark } = await supabase
        .from('quote_bookmarks')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingBookmark) {
        await supabase
          .from('quote_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);
          
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: 'bookmarks',
          table_name: 'quotes'
        });
        
        return false;
      } else {
        await supabase
          .from('quote_bookmarks')
          .insert({
            user_id: userId,
            quote_id: contentId
          });
          
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'bookmarks',
          table_name: 'quotes'
        });
        
        return true;
      }
    } else {
      const { data: existingBookmark } = await supabase
        .from('content_bookmarks')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (existingBookmark) {
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);
        
        return false;
      } else {
        await supabase
          .from('content_bookmarks')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: normalizedType
          });
        
        return true;
      }
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};
