
import { supabase } from '@/integrations/supabase/client';
import type { ContentInteractions } from './types';

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
    // Simplify the approach by using direct table names
    let hasLiked = false;
    let hasBookmarked = false;
    const idField = contentType === 'quote' ? 'quote_id' : 'content_id';
    
    // Check likes using concrete table names to avoid type instantiation issues
    if (contentType === 'quote') {
      const { data: likesData, error: likesError } = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (likesError) {
        console.warn('[Supabase Utils] Error checking likes:', likesError);
      } else {
        hasLiked = !!likesData;
      }
      
      // Check bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('quote_bookmarks')
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (bookmarksError) {
        console.warn('[Supabase Utils] Error checking bookmarks:', bookmarksError);
      } else {
        hasBookmarked = !!bookmarksData;
      }
    } else {
      // For other content types
      const { data: likesData, error: likesError } = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .maybeSingle();
        
      if (likesError) {
        console.warn('[Supabase Utils] Error checking likes:', likesError);
      } else {
        hasLiked = !!likesData;
      }
      
      // Check bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('content_bookmarks')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .maybeSingle();
        
      if (bookmarksError) {
        console.warn('[Supabase Utils] Error checking bookmarks:', bookmarksError);
      } else {
        hasBookmarked = !!bookmarksData;
      }
    }
    
    return { hasLiked, hasBookmarked };
  } catch (error) {
    console.error('[Supabase Utils] Error checking user content interactions:', error);
    return {
      hasLiked: false,
      hasBookmarked: false
    };
  }
};
