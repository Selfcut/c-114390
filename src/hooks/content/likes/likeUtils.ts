
import { supabase } from '@/integrations/supabase/client';
import { MediaLikePayload, ContentLikePayload, QuoteLikePayload } from '../types';

export const createLikePayload = (
  contentType: string, 
  userId: string, 
  contentId: string
): MediaLikePayload | ContentLikePayload | QuoteLikePayload => {
  if (contentType === 'media') {
    return {
      user_id: userId,
      post_id: contentId
    } as MediaLikePayload;
  } else if (contentType === 'quote') {
    return {
      user_id: userId,
      quote_id: contentId
    } as QuoteLikePayload;
  } else {
    // Default to content_likes table format
    return {
      user_id: userId,
      content_id: contentId,
      content_type: contentType
    } as ContentLikePayload;
  }
};

export const incrementLikeCounter = async (
  contentId: string, 
  contentTable: string
): Promise<void> => {
  await supabase.rpc('increment_counter_fn', {
    row_id: contentId,
    column_name: 'likes',
    table_name: contentTable
  });
};

export const decrementLikeCounter = async (
  contentId: string, 
  contentTable: string
): Promise<void> => {
  await supabase.rpc('decrement_counter_fn', {
    row_id: contentId,
    column_name: 'likes',
    table_name: contentTable
  });
};
