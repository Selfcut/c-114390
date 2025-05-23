
import { supabase } from '@/integrations/supabase/client';

/**
 * Normalize content type for database operations
 */
export function normalizeContentType(type: string): string {
  // Convert to lowercase string for consistency
  const normalizedType = String(type).toLowerCase();
  
  // Map types to ensure consistency
  switch (normalizedType) {
    case 'quotes':
    case 'quote':
      return 'quote';
    case 'media':
      return 'media';
    case 'knowledge':
      return 'knowledge';
    case 'wiki':
      return 'wiki';
    case 'forum':
      return 'forum';
    case 'research':
      return 'research';
    case 'ai':
      return 'ai';
    default:
      console.warn(`Unknown content type: ${normalizedType}, using as-is`);
      return normalizedType;
  }
}

/**
 * Check if a user has liked or bookmarked a piece of content
 */
export async function checkUserInteractions(
  userId: string, 
  contentId: string, 
  contentType: string
): Promise<{ isLiked: boolean, isBookmarked: boolean }> {
  const normalizedType = normalizeContentType(contentType);
  
  try {
    const isQuote = normalizedType === 'quote';
    
    let likesResult;
    let bookmarksResult;
    
    if (isQuote) {
      // For quotes, use the specific tables without content_type field
      const { data: likeData, error: likeError } = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('quote_bookmarks')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (likeError) throw likeError;
      if (bookmarkError) throw bookmarkError;
      
      return {
        isLiked: !!likeData,
        isBookmarked: !!bookmarkData
      };
    } else {
      // For other content types, include the content_type field
      const { data: likeData, error: likeError } = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('content_bookmarks')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (likeError) throw likeError;
      if (bookmarkError) throw bookmarkError;
      
      return {
        isLiked: !!likeData,
        isBookmarked: !!bookmarkData
      };
    }
  } catch (error) {
    console.error('Error checking interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
}

/**
 * Toggle like status for content
 */
export async function toggleLike(
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> {
  const normalizedType = normalizeContentType(contentType);
  const isQuote = normalizedType === 'quote';
  
  try {
    // Determine tables to use
    const contentTable = isQuote ? 'quotes' : `${normalizedType}_posts`;
    const likesColumn = normalizedType === 'forum' ? 'upvotes' : 'likes';
    
    // Check if like already exists
    let existingLike;
    
    if (isQuote) {
      const { data, error } = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      existingLike = data;
    } else {
      const { data, error } = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (error) throw error;
      existingLike = data;
    }
    
    if (existingLike) {
      // Remove like if it exists
      if (isQuote) {
        const { error } = await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType);
          
        if (error) throw error;
      }
      
      // Decrement likes count in content table
      await supabase.rpc('decrement_counter_fn', {
        row_id: contentId,
        column_name: likesColumn,
        table_name: contentTable
      });
      
      return false;
    } else {
      // Add like if it doesn't exist
      if (isQuote) {
        const { error } = await supabase
          .from('quote_likes')
          .insert({
            user_id: userId,
            quote_id: contentId
          });
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('content_likes')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: normalizedType
          });
          
        if (error) throw error;
      }
      
      // Increment likes count in content table
      await supabase.rpc('increment_counter_fn', {
        row_id: contentId,
        column_name: likesColumn,
        table_name: contentTable
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
}

/**
 * Toggle bookmark status for content
 */
export async function toggleBookmark(
  userId: string,
  contentId: string,
  contentType: string
): Promise<boolean> {
  const normalizedType = normalizeContentType(contentType);
  const isQuote = normalizedType === 'quote';
  
  try {
    // Determine tables to use
    const contentTable = isQuote ? 'quotes' : `${normalizedType}_posts`;
    const bookmarksColumn = isQuote ? 'bookmarks' : undefined;
    
    // Check if bookmark already exists
    let existingBookmark;
    
    if (isQuote) {
      const { data, error } = await supabase
        .from('quote_bookmarks')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      existingBookmark = data;
    } else {
      const { data, error } = await supabase
        .from('content_bookmarks')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      if (error) throw error;
      existingBookmark = data;
    }
    
    if (existingBookmark) {
      // Remove bookmark if it exists
      if (isQuote) {
        const { error } = await supabase
          .from('quote_bookmarks')
          .delete()
          .eq('quote_id', contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType);
          
        if (error) throw error;
      }
      
      // Decrement bookmarks count in content table if column exists
      if (bookmarksColumn) {
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: bookmarksColumn,
          table_name: contentTable
        });
      }
      
      return false;
    } else {
      // Add bookmark if it doesn't exist
      if (isQuote) {
        const { error } = await supabase
          .from('quote_bookmarks')
          .insert({
            user_id: userId,
            quote_id: contentId
          });
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('content_bookmarks')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: normalizedType
          });
          
        if (error) throw error;
      }
      
      // Increment bookmarks count in content table if column exists
      if (bookmarksColumn) {
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: bookmarksColumn,
          table_name: contentTable
        });
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
}
