
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
    // First, increment the view count on the media post
    const { error: updateError } = await supabase.rpc('increment_media_views', {
      media_id: mediaId
    });
    
    if (updateError) {
      console.error('Error incrementing media views:', updateError);
      return false;
    }
    
    // If user is logged in, also record this specific view in user_media_views
    if (userId) {
      const { error: viewError } = await supabase
        .from('user_media_views')
        .upsert(
          {
            user_id: userId,
            media_id: mediaId,
            last_viewed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,media_id' }
        );
        
      if (viewError) {
        console.error('Error recording user media view:', viewError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking media view:', error);
    return false;
  }
};
