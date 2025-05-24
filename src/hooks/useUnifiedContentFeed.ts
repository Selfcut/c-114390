
import { useState, useEffect, useCallback } from 'react';
import { ContentType, ContentViewMode } from '@/types/unified-content-types';
import { useContentFetchData } from './content-feed/useContentFetchData';
import { useAuth } from '@/lib/auth';
import { toggleUserInteraction, checkUserContentInteractions } from '@/lib/utils/content-interactions';
import { useToast } from '@/hooks/use-toast';

interface UserInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export const useUnifiedContentFeed = (
  contentType: ContentType = ContentType.All,
  viewMode: ContentViewMode = 'list'
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userInteractions, setUserInteractions] = useState<UserInteractions>({
    likes: {},
    bookmarks: {}
  });

  // Check user interactions for content items
  const checkUserInteractions = useCallback(async (itemIds: string[]) => {
    if (!user?.id) return;

    try {
      const interactions = await checkUserContentInteractions(user.id, itemIds);
      setUserInteractions(interactions);
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  }, [user?.id]);

  // Use the content fetch data hook
  const {
    feedItems,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    isInitialLoad
  } = useContentFetchData({
    userId: user?.id,
    checkUserInteractions,
    viewMode
  });

  // Handle like toggle
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

  // Handle bookmark toggle
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

  // Handle content click navigation
  const handleContentClick = useCallback((id: string, type: ContentType) => {
    // This will be handled by the component using this hook
    console.log(`Content clicked: ${type}:${id}`);
  }, []);

  return {
    feedItems,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    userLikes: userInteractions.likes,
    userBookmarks: userInteractions.bookmarks,
    handleLike,
    handleBookmark,
    handleContentClick,
    isInitialLoad
  };
};
