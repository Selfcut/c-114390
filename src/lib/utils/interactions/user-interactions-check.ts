
import { supabase } from '@/integrations/supabase/client';
import { ContentInteractions } from './types';

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
    
    // Execute likes query
    const { data: likesData, error: likesError } = await supabase
      .from(likesTable)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    // Execute the bookmarks query
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
