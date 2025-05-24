
import { useState, useEffect, useCallback } from 'react';
import { useUserInteraction } from '@/contexts/UserInteractionContext';
import { ContentType, UnifiedContentItem, ContentViewMode } from '@/types/unified-content-types';
import { useNavigate } from 'react-router-dom';

interface UserInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export const useUnifiedContentFeed = (
  contentType: ContentType = ContentType.All,
  viewMode: ContentViewMode = 'list'
) => {
  const [userInteractions, setUserInteractions] = useState<UserInteractions>({
    likes: {},
    bookmarks: {}
  });
  const [feedItems, setFeedItems] = useState<UnifiedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { likedItems, bookmarkedItems, checkInteractions, likeContent, bookmarkContent } = useUserInteraction();
  const navigate = useNavigate();

  useEffect(() => {
    setUserInteractions({
      likes: likedItems,
      bookmarks: bookmarkedItems
    });
  }, [likedItems, bookmarkedItems]);

  const checkContentInteractions = async (contentId: string, contentType: string) => {
    await checkInteractions(contentId, contentType);
  };

  const loadMore = useCallback(() => {
    // TODO: Implement pagination
    console.log('Load more items');
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    // TODO: Implement data fetching
    setTimeout(() => {
      setFeedItems([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLike = useCallback(async (contentId: string, contentType: ContentType) => {
    try {
      await likeContent(contentId, contentType);
    } catch (error) {
      console.error('Error liking content:', error);
    }
  }, [likeContent]);

  const handleBookmark = useCallback(async (contentId: string, contentType: ContentType) => {
    try {
      await bookmarkContent(contentId, contentType);
    } catch (error) {
      console.error('Error bookmarking content:', error);
    }
  }, [bookmarkContent]);

  const handleContentClick = useCallback((contentId: string, contentType: ContentType) => {
    try {
      switch (contentType) {
        case ContentType.Knowledge:
          navigate(`/knowledge/${contentId}`);
          break;
        case ContentType.Media:
          navigate(`/media/${contentId}`);
          break;
        case ContentType.Quote:
          navigate(`/quotes/${contentId}`);
          break;
        case ContentType.Forum:
          navigate(`/forum/${contentId}`);
          break;
        default:
          navigate(`/content/${contentId}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  // Initial load
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    userInteractions,
    checkContentInteractions,
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
    handleContentClick
  };
};
