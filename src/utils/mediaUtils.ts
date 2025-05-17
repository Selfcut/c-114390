
import { supabase } from "@/integrations/supabase/client";

export type MediaType = 'image' | 'youtube' | 'document' | 'text' | 'audio' | 'video';

export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: MediaType;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  views?: number;
  author?: {
    name?: string;
    avatar_url?: string;
    username?: string;
  };
}

export function validateMediaType(type: string): MediaType {
  const validTypes: MediaType[] = ['image', 'youtube', 'document', 'text', 'audio', 'video'];
  if (validTypes.includes(type as MediaType)) {
    return type as MediaType;
  }
  return 'text'; // Default to text if invalid type
}

/**
 * Track when a media item is viewed by a user
 * @param mediaId The ID of the media being viewed
 * @param userId The ID of the user viewing the media (optional)
 * @returns Promise that resolves to whether the tracking was successful
 */
export const trackMediaView = async (
  mediaId: string,
  userId?: string | null
): Promise<boolean> => {
  try {
    // First, increment the view count on the media post using our new DB function
    const { error: updateError } = await supabase.rpc('increment_media_views', {
      media_id: mediaId
    });
    
    if (updateError) {
      console.error('Error incrementing media views:', updateError);
      return false;
    }
    
    // If user is logged in, also record this specific view in user_media_views
    if (userId) {
      // Check if there's an existing record
      const { data: existingView } = await supabase
        .from('user_media_views')
        .select('id, view_count')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .single();
        
      if (existingView) {
        // Update existing record
        const { error: updateViewError } = await supabase
          .from('user_media_views')
          .update({
            view_count: (existingView.view_count || 0) + 1,
            last_viewed_at: new Date().toISOString()
          })
          .eq('id', existingView.id);
          
        if (updateViewError) {
          console.error('Error updating user media view:', updateViewError);
          return false;
        }
      } else {
        // Insert new record
        const { error: insertViewError } = await supabase
          .from('user_media_views')
          .insert({
            user_id: userId,
            media_id: mediaId,
            last_viewed_at: new Date().toISOString(),
            view_count: 1
          });
          
        if (insertViewError) {
          console.error('Error recording user media view:', insertViewError);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking media view:', error);
    return false;
  }
};
