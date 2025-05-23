
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
    // Check if content type is a quote (special case)
    const isQuote = normalizedType === 'quote';
    
    // Table names depend on content type
    const likesTable = isQuote ? 'quote_likes' : 'content_likes';
    const bookmarksTable = isQuote ? 'quote_bookmarks' : 'content_bookmarks';
    const idField = isQuote ? 'quote_id' : 'content_id';
    
    let likesResult;
    let bookmarksResult;
    
    if (isQuote) {
      // For quotes, use the specific tables without content_type field
      likesResult = await supabase
        .from(likesTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      bookmarksResult = await supabase
        .from(bookmarksTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      // For other content types, include the content_type field
      likesResult = await supabase
        .from(likesTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      bookmarksResult = await supabase
        .from(bookmarksTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
    }
    
    // Return interaction status
    return {
      isLiked: !!likesResult.data,
      isBookmarked: !!bookmarksResult.data
    };
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
    const likesTable = isQuote ? 'quote_likes' : 'content_likes';
    const contentTable = isQuote ? 'quotes' : `${normalizedType}_posts`;
    const idField = isQuote ? 'quote_id' : 'content_id';
    const likesColumn = normalizedType === 'forum' ? 'upvotes' : 'likes';
    
    // Check if like already exists
    let existingLike;
    let checkError;
    
    if (isQuote) {
      const result = await supabase
        .from(likesTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      existingLike = result.data;
      checkError = result.error;
    } else {
      const result = await supabase
        .from(likesTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      existingLike = result.data;
      checkError = result.error;
    }
    
    if (checkError) throw checkError;
    
    if (existingLike) {
      // Remove like if it exists
      let deleteError;
      
      if (isQuote) {
        const result = await supabase
          .from(likesTable)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId);
          
        deleteError = result.error;
      } else {
        const result = await supabase
          .from(likesTable)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType);
          
        deleteError = result.error;
      }
      
      if (deleteError) throw deleteError;
      
      // Decrement likes count in content table
      await supabase.rpc('decrement_counter_fn', {
        row_id: contentId,
        column_name: likesColumn,
        table_name: contentTable
      });
      
      return false;
    } else {
      // Add like if it doesn't exist
      let insertError;
      
      if (isQuote) {
        // For quotes, we use quote_id
        const result = await supabase
          .from(likesTable)
          .insert({
            user_id: userId,
            quote_id: contentId
          });
          
        insertError = result.error;
      } else {
        // For other content, we use content_id and content_type
        const result = await supabase
          .from(likesTable)
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: normalizedType
          });
          
        insertError = result.error;
      }
      
      if (insertError) throw insertError;
      
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
    const bookmarksTable = isQuote ? 'quote_bookmarks' : 'content_bookmarks';
    const contentTable = isQuote ? 'quotes' : `${normalizedType}_posts`;
    const idField = isQuote ? 'quote_id' : 'content_id';
    const bookmarksColumn = isQuote ? 'bookmarks' : undefined;
    
    // Check if bookmark already exists
    let existingBookmark;
    let checkError;
    
    if (isQuote) {
      const result = await supabase
        .from(bookmarksTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      existingBookmark = result.data;
      checkError = result.error;
    } else {
      const result = await supabase
        .from(bookmarksTable)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
        
      existingBookmark = result.data;
      checkError = result.error;
    }
    
    if (checkError) throw checkError;
    
    if (existingBookmark) {
      // Remove bookmark if it exists
      let deleteError;
      
      if (isQuote) {
        const result = await supabase
          .from(bookmarksTable)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId);
          
        deleteError = result.error;
      } else {
        const result = await supabase
          .from(bookmarksTable)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType);
          
        deleteError = result.error;
      }
      
      if (deleteError) throw deleteError;
      
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
      let insertError;
      
      if (isQuote) {
        // For quotes, we use quote_id
        const result = await supabase
          .from(bookmarksTable)
          .insert({
            user_id: userId,
            quote_id: contentId
          });
          
        insertError = result.error;
      } else {
        // For other content, we use content_id and content_type
        const result = await supabase
          .from(bookmarksTable)
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: normalizedType
          });
          
        insertError = result.error;
      }
      
      if (insertError) throw insertError;
      
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
