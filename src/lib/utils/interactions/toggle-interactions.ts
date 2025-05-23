
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/unified-content-types';
import { getContentTypeInfo } from '@/types/contentTypes';

export async function toggleUserInteraction(
  interactionType: 'like' | 'bookmark',
  userId: string,
  contentId: string,
  contentType: ContentType
): Promise<boolean> {
  if (!userId || !contentId) {
    throw new Error('User ID and content ID are required');
  }

  try {
    const tableInfo = getContentTypeInfo(contentType);
    const isQuote = contentType === ContentType.Quote;
    
    if (interactionType === 'like') {
      // Handle likes
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
        
        // Decrement counter
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
        
        // Increment counter
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: tableInfo.likesColumnName,
          table_name: tableInfo.contentTable
        });
        
        return true;
      }
    } else {
      // Handle bookmarks
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
        
        return true;
      }
    }
  } catch (error) {
    console.error(`Error toggling ${interactionType}:`, error);
    throw error;
  }
}
