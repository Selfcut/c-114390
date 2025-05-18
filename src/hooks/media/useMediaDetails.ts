
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaPost, getMediaPostById } from "@/utils/mediaUtils";

export const useMediaDetails = (mediaId: string | undefined) => {
  return useQuery({
    queryKey: ['media-details', mediaId],
    queryFn: async (): Promise<{
      post: MediaPost | null;
      error: string | null;
      isLoading: boolean;
    }> => {
      if (!mediaId) {
        return { post: null, error: "No media ID provided", isLoading: false };
      }
      
      try {
        const post = await getMediaPostById(mediaId);
        
        if (!post) {
          return { 
            post: null, 
            error: "Media item not found",
            isLoading: false
          };
        }
        
        // Increment view count
        try {
          await supabase.rpc('increment_media_views', { media_id: mediaId });
        } catch (viewError) {
          console.error("Error incrementing view count:", viewError);
        }
        
        return {
          post,
          error: null,
          isLoading: false
        };
      } catch (err) {
        console.error("Error fetching media details:", err);
        return {
          post: null,
          error: err instanceof Error ? err.message : "An unknown error occurred",
          isLoading: false
        };
      }
    },
    enabled: !!mediaId
  });
};
