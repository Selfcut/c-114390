
import { supabase } from "@/integrations/supabase/client";

export type MediaPostType = 'image' | 'video' | 'youtube' | 'document' | 'text';

export interface MediaAuthor {
  name: string;
  avatar_url?: string | null;
  username?: string | null;
}

export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: MediaPostType;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  views: number;
  author?: MediaAuthor;
}

// Validate that a string is a valid MediaPostType
export function validateMediaType(type: string): MediaPostType {
  const validTypes: MediaPostType[] = ['image', 'video', 'youtube', 'document', 'text'];
  
  if (validTypes.includes(type as MediaPostType)) {
    return type as MediaPostType;
  }
  
  return 'text'; // Default to text if invalid type
}

// Track media view with proper error handling
export async function trackMediaView(mediaId: string, userId?: string): Promise<void> {
  try {
    if (!mediaId) {
      console.error("Cannot track view: Media ID is required");
      return;
    }
    
    // First increment the views counter in the media_posts table
    const { error: incrementError } = await supabase.rpc('increment_media_views', {
      media_id: mediaId
    });
    
    if (incrementError) {
      console.error("Error incrementing media views:", incrementError);
    }
    
    // If user is logged in, also track the view in user_media_views
    if (userId) {
      const { error: upsertError } = await supabase
        .from('user_media_views')
        .upsert(
          {
            media_id: mediaId,
            user_id: userId,
            last_viewed_at: new Date().toISOString(),
            view_count: 1
          },
          {
            onConflict: 'media_id,user_id',
            ignoreDuplicates: false
          }
        );
      
      if (upsertError) {
        console.error("Error updating user media views:", upsertError);
      }
    }
  } catch (err) {
    console.error("Error tracking media view:", err);
  }
}
