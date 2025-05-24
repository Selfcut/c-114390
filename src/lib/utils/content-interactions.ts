
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/unified-content-types';
import { getContentTableInfo } from './content-type-utils';

export interface UserContentInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export const checkUserContentInteractions = async (
  userId: string,
  contentIds: string[]
): Promise<UserContentInteractions> => {
  try {
    const [likesData, bookmarksData] = await Promise.all([
      // Check likes
      supabase
        .from('content_likes')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', contentIds),
      
      // Check bookmarks
      supabase
        .from('content_bookmarks')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', contentIds)
    ]);

    const likes: Record<string, boolean> = {};
    const bookmarks: Record<string, boolean> = {};

    // Process likes
    if (likesData.data) {
      likesData.data.forEach(like => {
        const key = `${like.content_type}:${like.content_id}`;
        likes[key] = true;
      });
    }

    // Process bookmarks
    if (bookmarksData.data) {
      bookmarksData.data.forEach(bookmark => {
        const key = `${bookmark.content_type}:${bookmark.content_id}`;
        bookmarks[key] = true;
      });
    }

    return { likes, bookmarks };
  } catch (error) {
    console.error('Error checking user interactions:', error);
    return { likes: {}, bookmarks: {} };
  }
};

export const toggleUserInteraction = async (
  interactionType: 'like' | 'bookmark',
  userId: string,
  contentId: string,
  contentType: ContentType
): Promise<boolean> => {
  try {
    const tableName = interactionType === 'like' ? 'content_likes' : 'content_bookmarks';
    const contentTypeStr = contentType.toLowerCase();
    
    // Check if interaction exists
    const { data: existing } = await supabase
      .from(tableName)
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentTypeStr)
      .single();

    if (existing) {
      // Remove interaction
      await supabase
        .from(tableName)
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentTypeStr);

      // Decrement counter
      const { contentTable, likesColumnName } = getContentTableInfo(contentType);
      const columnName = interactionType === 'like' ? likesColumnName : 'bookmarks';
      
      await supabase.rpc('decrement_counter', {
        row_id: contentId,
        column_name: columnName,
        table_name: contentTable
      });

      return false;
    } else {
      // Add interaction
      await supabase
        .from(tableName)
        .insert({
          user_id: userId,
          content_id: contentId,
          content_type: contentTypeStr
        });

      // Increment counter
      const { contentTable, likesColumnName } = getContentTableInfo(contentType);
      const columnName = interactionType === 'like' ? likesColumnName : 'bookmarks';
      
      await supabase.rpc('increment_counter', {
        row_id: contentId,
        column_name: columnName,
        table_name: contentTable
      });

      return true;
    }
  } catch (error) {
    console.error('Error toggling user interaction:', error);
    throw error;
  }
};
