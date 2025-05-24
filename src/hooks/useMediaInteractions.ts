
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaInteractions {
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
}

export const useMediaInteractions = (mediaId: string, initialData?: Partial<MediaInteractions>) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [interactions, setInteractions] = useState<MediaInteractions>({
    isLiked: false,
    isBookmarked: false,
    likesCount: initialData?.likesCount || 0,
    commentsCount: initialData?.commentsCount || 0,
    viewsCount: initialData?.viewsCount || 0,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user interactions on mount
  useEffect(() => {
    if (user?.id && mediaId) {
      fetchUserInteractions();
    }
  }, [user?.id, mediaId]);

  const fetchUserInteractions = async () => {
    if (!user?.id) return;

    try {
      // Check if user has liked the media
      const { data: likeData } = await supabase
        .from('content_likes')
        .select('id')
        .eq('content_id', mediaId)
        .eq('user_id', user.id)
        .eq('content_type', 'media')
        .maybeSingle();

      // Check if user has bookmarked the media
      const { data: bookmarkData } = await supabase
        .from('content_bookmarks')
        .select('id')
        .eq('content_id', mediaId)
        .eq('user_id', user.id)
        .eq('content_type', 'media')
        .maybeSingle();

      setInteractions(prev => ({
        ...prev,
        isLiked: !!likeData,
        isBookmarked: !!bookmarkData,
      }));
    } catch (error) {
      console.error('Error fetching user interactions:', error);
    }
  };

  const toggleLike = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (interactions.isLiked) {
        // Remove like
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', mediaId)
          .eq('user_id', user.id)
          .eq('content_type', 'media');

        // Decrement counter
        await supabase.rpc('decrement_counter_fn', {
          row_id: mediaId,
          column_name: 'likes',
          table_name: 'media_posts'
        });

        setInteractions(prev => ({
          ...prev,
          isLiked: false,
          likesCount: Math.max(0, prev.likesCount - 1)
        }));
      } else {
        // Add like
        await supabase
          .from('content_likes')
          .insert({
            content_id: mediaId,
            user_id: user.id,
            content_type: 'media'
          });

        // Increment counter
        await supabase.rpc('increment_counter_fn', {
          row_id: mediaId,
          column_name: 'likes',
          table_name: 'media_posts'
        });

        setInteractions(prev => ({
          ...prev,
          isLiked: true,
          likesCount: prev.likesCount + 1
        }));
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, mediaId, interactions.isLiked, toast]);

  const toggleBookmark = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to bookmark content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (interactions.isBookmarked) {
        // Remove bookmark
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', mediaId)
          .eq('user_id', user.id)
          .eq('content_type', 'media');

        setInteractions(prev => ({
          ...prev,
          isBookmarked: false
        }));
      } else {
        // Add bookmark
        await supabase
          .from('content_bookmarks')
          .insert({
            content_id: mediaId,
            user_id: user.id,
            content_type: 'media'
          });

        setInteractions(prev => ({
          ...prev,
          isBookmarked: true
        }));
      }
    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, mediaId, interactions.isBookmarked, toast]);

  return {
    interactions,
    isLoading,
    toggleLike,
    toggleBookmark,
    refetch: fetchUserInteractions
  };
};
