
import { supabase } from '@/integrations/supabase/client';
import { ContentInteractions } from './types';

export const checkUserContentInteractions = async (
  userId: string,
  contentIds: string[]
): Promise<ContentInteractions> => {
  const interactions: ContentInteractions = {
    likes: {},
    bookmarks: {}
  };

  if (!userId || !contentIds.length) {
    return interactions;
  }

  try {
    // Check likes across all content types
    const [quoteLikes, contentLikes, mediaLikes] = await Promise.all([
      // Quote likes
      supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds),
      
      // Content likes (knowledge, forum, etc.)
      supabase
        .from('content_likes')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', contentIds),
      
      // Media likes
      supabase
        .from('media_likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', contentIds)
    ]);

    // Process quote likes
    if (quoteLikes.data) {
      quoteLikes.data.forEach(like => {
        interactions.likes[`quote:${like.quote_id}`] = true;
      });
    }

    // Process content likes
    if (contentLikes.data) {
      contentLikes.data.forEach(like => {
        interactions.likes[`${like.content_type}:${like.content_id}`] = true;
      });
    }

    // Process media likes
    if (mediaLikes.data) {
      mediaLikes.data.forEach(like => {
        interactions.likes[`media:${like.post_id}`] = true;
      });
    }

    // Check bookmarks
    const [quoteBookmarks, contentBookmarks] = await Promise.all([
      // Quote bookmarks
      supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds),
      
      // Content bookmarks
      supabase
        .from('content_bookmarks')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', contentIds)
    ]);

    // Process quote bookmarks
    if (quoteBookmarks.data) {
      quoteBookmarks.data.forEach(bookmark => {
        interactions.bookmarks[`quote:${bookmark.quote_id}`] = true;
      });
    }

    // Process content bookmarks
    if (contentBookmarks.data) {
      contentBookmarks.data.forEach(bookmark => {
        interactions.bookmarks[`${bookmark.content_type}:${bookmark.content_id}`] = true;
      });
    }

  } catch (error) {
    console.error('Error checking user interactions:', error);
  }

  return interactions;
};
