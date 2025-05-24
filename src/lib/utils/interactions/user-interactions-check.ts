
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/unified-content-types';

export interface ContentInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export async function checkUserContentInteractions(
  userId: string,
  itemIds: string[]
): Promise<ContentInteractions> {
  if (!userId || itemIds.length === 0) {
    return { likes: {}, bookmarks: {} };
  }

  try {
    // Check likes for quotes
    const { data: quoteLikes } = await supabase
      .from('quote_likes')
      .select('quote_id')
      .in('quote_id', itemIds)
      .eq('user_id', userId);

    // Check bookmarks for quotes
    const { data: quoteBookmarks } = await supabase
      .from('quote_bookmarks')
      .select('quote_id')
      .in('quote_id', itemIds)
      .eq('user_id', userId);

    // Check likes for other content types
    const { data: contentLikes } = await supabase
      .from('content_likes')
      .select('content_id, content_type')
      .in('content_id', itemIds)
      .eq('user_id', userId);

    // Check bookmarks for other content types
    const { data: contentBookmarks } = await supabase
      .from('content_bookmarks')
      .select('content_id, content_type')
      .in('content_id', itemIds)
      .eq('user_id', userId);

    const likes: Record<string, boolean> = {};
    const bookmarks: Record<string, boolean> = {};

    // Process quote likes
    quoteLikes?.forEach(like => {
      likes[`${ContentType.Quote}:${like.quote_id}`] = true;
    });

    // Process quote bookmarks
    quoteBookmarks?.forEach(bookmark => {
      bookmarks[`${ContentType.Quote}:${bookmark.quote_id}`] = true;
    });

    // Process content likes
    contentLikes?.forEach(like => {
      likes[`${like.content_type}:${like.content_id}`] = true;
    });

    // Process content bookmarks
    contentBookmarks?.forEach(bookmark => {
      bookmarks[`${bookmark.content_type}:${bookmark.content_id}`] = true;
    });

    return { likes, bookmarks };
  } catch (error) {
    console.error('Error checking user interactions:', error);
    return { likes: {}, bookmarks: {} };
  }
}
