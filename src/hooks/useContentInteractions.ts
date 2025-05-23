
import { useState, useCallback } from 'react';
import { ContentType } from '@/types/unified-content-types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { toggleUserInteraction } from '@/lib/utils/content-interactions';

interface UserInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export const useContentInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userInteractions, setUserInteractions] = useState<UserInteractions>({
    likes: {},
    bookmarks: {}
  });

  const handleLike = useCallback(async (contentId: string, contentType: ContentType) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like content",
        variant: "destructive",
      });
      return false;
    }

    try {
      const stateKey = `${contentType}:${contentId}`;
      const newLikeState = await toggleUserInteraction('like', user.id, contentId, contentType);
      
      setUserInteractions(prev => ({
        ...prev,
        likes: {
          ...prev.likes,
          [stateKey]: newLikeState
        }
      }));
      
      return newLikeState;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast]);

  const handleBookmark = useCallback(async (contentId: string, contentType: ContentType) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to bookmark content",
        variant: "destructive",
      });
      return false;
    }

    try {
      const stateKey = `${contentType}:${contentId}`;
      const newBookmarkState = await toggleUserInteraction('bookmark', user.id, contentId, contentType);
      
      setUserInteractions(prev => ({
        ...prev,
        bookmarks: {
          ...prev.bookmarks,
          [stateKey]: newBookmarkState
        }
      }));
      
      return newBookmarkState;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast]);

  return {
    userLikes: userInteractions.likes,
    userBookmarks: userInteractions.bookmarks,
    handleLike,
    handleBookmark,
    setUserInteractions
  };
};
