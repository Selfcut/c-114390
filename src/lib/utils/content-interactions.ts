
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/unified-content-types';

export interface UserInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export async function checkUserContentInteractions(
  userId: string,
  contentIds: string[]
): Promise<UserInteractions> {
  if (!userId || contentIds.length === 0) {
    return { likes: {}, bookmarks: {} };
  }

  try {
    // Check likes for all content types
    const [quoteLikes, contentLikes] = await Promise.all([
      supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds),
      supabase
        .from('content_likes')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', contentIds)
    ]);

    // Check bookmarks for all content types
    const [quoteBookmarks, contentBookmarks] = await Promise.all([
      supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', contentIds),
      supabase
        .from('content_bookmarks')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', contentIds)
    ]);

    const likes: Record<string, boolean> = {};
    const bookmarks: Record<string, boolean> = {};

    // Process quote likes
    if (quoteLikes.data) {
      quoteLikes.data.forEach(like => {
        likes[`quote:${like.quote_id}`] = true;
      });
    }

    // Process content likes
    if (contentLikes.data) {
      contentLikes.data.forEach(like => {
        likes[`${like.content_type}:${like.content_id}`] = true;
      });
    }

    // Process quote bookmarks
    if (quoteBookmarks.data) {
      quoteBookmarks.data.forEach(bookmark => {
        bookmarks[`quote:${bookmark.quote_id}`] = true;
      });
    }

    // Process content bookmarks
    if (contentBookmarks.data) {
      contentBookmarks.data.forEach(bookmark => {
        bookmarks[`${bookmark.content_type}:${bookmark.content_id}`] = true;
      });
    }

    return { likes, bookmarks };
  } catch (error) {
    console.error('Error checking user interactions:', error);
    return { likes: {}, bookmarks: {} };
  }
}

export async function toggleUserInteraction(
  interactionType: 'like' | 'bookmark',
  userId: string,
  contentId: string,
  contentType: ContentType | string
): Promise<boolean> {
  if (!userId || !contentId) {
    throw new Error('User ID and content ID are required');
  }

  try {
    const isQuote = contentType === ContentType.Quote || contentType === 'quote';
    
    if (interactionType === 'like') {
      if (isQuote) {
        // Handle quote likes
        const { data: existingLike } = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', userId)
          .maybeSingle();
        
        if (existingLike) {
          // Remove like
          await supabase
            .from('quote_likes')
            .delete()
            .eq('quote_id', contentId)
            .eq('user_id', userId);
          
          // Decrement counter
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'likes',
            table_name: 'quotes'
          });
          
          return false;
        } else {
          // Add like
          await supabase
            .from('quote_likes')
            .insert({
              quote_id: contentId,
              user_id: userId
            });
          
          // Increment counter
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'likes',
            table_name: 'quotes'
          });
          
          return true;
        }
      } else {
        // Handle content likes
        const { data: existingLike } = await supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .maybeSingle();
        
        if (existingLike) {
          // Remove like
          await supabase
            .from('content_likes')
            .delete()
            .eq('content_id', contentId)
            .eq('user_id', userId)
            .eq('content_type', contentType);
          
          // Decrement counter
          const tableName = getTableNameFromContentType(contentType);
          const columnName = contentType === 'forum' ? 'upvotes' : 'likes';
          
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: columnName,
            table_name: tableName
          });
          
          return false;
        } else {
          // Add like
          await supabase
            .from('content_likes')
            .insert({
              content_id: contentId,
              user_id: userId,
              content_type: contentType
            });
          
          // Increment counter
          const tableName = getTableNameFromContentType(contentType);
          const columnName = contentType === 'forum' ? 'upvotes' : 'likes';
          
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: columnName,
            table_name: tableName
          });
          
          return true;
        }
      }
    } else {
      // Handle bookmarks
      if (isQuote) {
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
            .eq('quote_id', contentId)
            .eq('user_id', userId);
          return false;
        } else {
          await supabase
            .from('quote_bookmarks')
            .insert({
              quote_id: contentId,
              user_id: userId
            });
          return true;
        }
      } else {
        const { data: existingBookmark } = await supabase
          .from('content_bookmarks')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .maybeSingle();
        
        if (existingBookmark) {
          await supabase
            .from('content_bookmarks')
            .delete()
            .eq('content_id', contentId)
            .eq('user_id', userId)
            .eq('content_type', contentType);
          return false;
        } else {
          await supabase
            .from('content_bookmarks')
            .insert({
              content_id: contentId,
              user_id: userId,
              content_type: contentType
            });
          return true;
        }
      }
    }
  } catch (error) {
    console.error(`Error toggling ${interactionType}:`, error);
    throw error;
  }
}

function getTableNameFromContentType(contentType: string | ContentType): string {
  switch (contentType) {
    case ContentType.Knowledge:
    case 'knowledge':
      return 'knowledge_entries';
    case ContentType.Media:
    case 'media':
      return 'media_posts';
    case ContentType.Forum:
    case 'forum':
      return 'forum_posts';
    case ContentType.Wiki:
    case 'wiki':
      return 'wiki_articles';
    case ContentType.Research:
    case 'research':
      return 'research_papers';
    default:
      return 'forum_posts';
  }
}
