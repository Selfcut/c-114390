
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/unified-content-types';
import { getContentTypeInfo } from '@/types/contentTypes';
import { toast } from 'sonner';

export type InteractionType = 'like' | 'bookmark';

/**
 * Unified content interaction handler with proper error handling
 */
export const toggleUserInteraction = async (
  type: InteractionType,
  userId: string,
  contentId: string,
  contentType: ContentType | string
): Promise<boolean> => {
  if (!userId || !contentId) {
    throw new Error('User ID and content ID are required');
  }

  try {
    const contentTypeEnum = typeof contentType === 'string' 
      ? normalizeToContentType(contentType) 
      : contentType;
    
    const typeInfo = getContentTypeInfo(contentTypeEnum);
    const isQuote = contentTypeEnum === ContentType.Quote;
    
    // Determine table and field names
    const tableName = type === 'like' ? typeInfo.likesTable : typeInfo.bookmarksTable;
    const idField = typeInfo.contentIdField;
    const columnName = type === 'like' ? typeInfo.likesColumnName : typeInfo.bookmarksColumnName;

    // Check existing interaction
    let existingQuery;
    if (isQuote) {
      existingQuery = await supabase
        .from(tableName as any)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      existingQuery = await supabase
        .from(tableName as any)
        .select('id')
        .eq(idField, contentId)
        .eq('user_id', userId)
        .eq('content_type', contentTypeEnum)
        .maybeSingle();
    }

    if (existingQuery.error) throw existingQuery.error;

    if (existingQuery.data) {
      // Remove interaction
      if (isQuote) {
        await supabase
          .from(tableName as any)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from(tableName as any)
          .delete()
          .eq(idField, contentId)
          .eq('user_id', userId)
          .eq('content_type', contentTypeEnum);
      }

      // Update counter
      if (columnName) {
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: columnName,
          table_name: typeInfo.contentTable
        });
      }

      return false;
    } else {
      // Add interaction
      const insertPayload: any = {
        user_id: userId,
        [idField]: contentId
      };

      if (!isQuote) {
        insertPayload.content_type = contentTypeEnum;
      }

      await supabase
        .from(tableName as any)
        .insert(insertPayload);

      // Update counter
      if (columnName) {
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: columnName,
          table_name: typeInfo.contentTable
        });
      }

      return true;
    }
  } catch (error) {
    console.error(`Error toggling ${type}:`, error);
    toast.error(`Failed to ${type} content. Please try again.`);
    throw error;
  }
};

/**
 * Check user interactions for content
 */
export const checkUserContentInteractions = async (
  userId: string,
  contentId: string,
  contentType: ContentType | string
): Promise<{ isLiked: boolean; isBookmarked: boolean }> => {
  if (!userId || !contentId) {
    return { isLiked: false, isBookmarked: false };
  }

  try {
    const contentTypeEnum = typeof contentType === 'string' 
      ? normalizeToContentType(contentType) 
      : contentType;
    
    const typeInfo = getContentTypeInfo(contentTypeEnum);
    const isQuote = contentTypeEnum === ContentType.Quote;

    // Check likes
    let likeQuery;
    if (isQuote) {
      likeQuery = await supabase
        .from(typeInfo.likesTable as any)
        .select('id')
        .eq(typeInfo.contentIdField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      likeQuery = await supabase
        .from(typeInfo.likesTable as any)
        .select('id')
        .eq(typeInfo.contentIdField, contentId)
        .eq('user_id', userId)
        .eq('content_type', contentTypeEnum)
        .maybeSingle();
    }

    // Check bookmarks
    let bookmarkQuery;
    if (isQuote) {
      bookmarkQuery = await supabase
        .from(typeInfo.bookmarksTable as any)
        .select('id')
        .eq(typeInfo.contentIdField, contentId)
        .eq('user_id', userId)
        .maybeSingle();
    } else {
      bookmarkQuery = await supabase
        .from(typeInfo.bookmarksTable as any)
        .select('id')
        .eq(typeInfo.contentIdField, contentId)
        .eq('user_id', userId)
        .eq('content_type', contentTypeEnum)
        .maybeSingle();
    }

    return {
      isLiked: !!likeQuery.data,
      isBookmarked: !!bookmarkQuery.data
    };
  } catch (error) {
    console.error('Error checking user interactions:', error);
    return { isLiked: false, isBookmarked: false };
  }
};

/**
 * Normalize content type string to ContentType enum
 */
function normalizeToContentType(type: string): ContentType {
  const normalized = type.toLowerCase();
  switch (normalized) {
    case 'quote':
    case 'quotes':
      return ContentType.Quote;
    case 'media':
      return ContentType.Media;
    case 'knowledge':
      return ContentType.Knowledge;
    case 'wiki':
      return ContentType.Wiki;
    case 'forum':
      return ContentType.Forum;
    case 'research':
      return ContentType.Research;
    case 'ai':
      return ContentType.AI;
    default:
      return ContentType.Forum;
  }
}
