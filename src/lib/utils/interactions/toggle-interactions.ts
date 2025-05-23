
import { supabase } from '@/integrations/supabase/client';
import { ContentType, getContentTypeInfo } from '@/types/contentTypes';

export const toggleUserInteraction = async (
  type: 'like' | 'bookmark',
  userId: string,
  contentId: string,
  contentType: ContentType | string
): Promise<boolean> => {
  const normalizedType = typeof contentType === 'string' ? contentType as ContentType : contentType;
  const typeInfo = getContentTypeInfo(normalizedType);
  const isLike = type === 'like';
  
  try {
    // Check if interaction exists
    let checkData;
    let checkError;
    
    if (normalizedType === ContentType.Quote) {
      const tableName = isLike ? 'quote_likes' : 'quote_bookmarks';
      const { data, error } = await supabase
        .from(tableName as any)
        .select('id')
        .eq('quote_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
      checkData = data;
      checkError = error;
    } else if (normalizedType === ContentType.Media && isLike) {
      const { data, error } = await supabase
        .from('media_likes')
        .select('id')
        .eq('post_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
      checkData = data;
      checkError = error;
    } else {
      // Use content_likes or content_bookmarks with content_type
      const tableName = isLike ? 'content_likes' : 'content_bookmarks';
      const { data, error } = await supabase
        .from(tableName as any)
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('content_type', normalizedType)
        .maybeSingle();
      checkData = data;
      checkError = error;
    }
    
    if (checkError) throw checkError;

    if (checkData) {
      // Remove interaction
      if (normalizedType === ContentType.Quote) {
        const tableName = isLike ? 'quote_likes' : 'quote_bookmarks';
        const { error } = await supabase
          .from(tableName as any)
          .delete()
          .eq(typeInfo.contentIdField, contentId)
          .eq('user_id', userId);
        if (error) throw error;
      } else if (normalizedType === ContentType.Media && isLike) {
        const { error } = await supabase
          .from('media_likes')
          .delete()
          .eq('post_id', contentId)
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        const tableName = isLike ? 'content_likes' : 'content_bookmarks';
        const { error } = await supabase
          .from(tableName as any)
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('content_type', normalizedType);
        if (error) throw error;
      }
      
      // Decrement counter
      const columnName = isLike ? typeInfo.likesColumnName : typeInfo.bookmarksColumnName;
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
      const insertPayload: any = { user_id: userId };
      
      if (normalizedType === ContentType.Quote) {
        insertPayload.quote_id = contentId;
        const tableName = isLike ? 'quote_likes' : 'quote_bookmarks';
        const { error } = await supabase
          .from(tableName as any)
          .insert(insertPayload);
        if (error) throw error;
      } else if (normalizedType === ContentType.Media && isLike) {
        insertPayload.post_id = contentId;
        const { error } = await supabase
          .from('media_likes')
          .insert(insertPayload);
        if (error) throw error;
      } else {
        insertPayload.content_id = contentId;
        insertPayload.content_type = normalizedType;
        const tableName = isLike ? 'content_likes' : 'content_bookmarks';
        const { error } = await supabase
          .from(tableName as any)
          .insert(insertPayload);
        if (error) throw error;
      }
      
      // Increment counter
      const columnName = isLike ? typeInfo.likesColumnName : typeInfo.bookmarksColumnName;
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
    throw error;
  }
};
