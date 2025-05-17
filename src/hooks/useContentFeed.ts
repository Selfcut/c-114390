
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useContentInteractions } from './useContentInteractions';
import { useContentFetchData } from './content-feed/useContentFetchData';
import { useContentNavigation } from './content-feed/useContentNavigation';
import { ContentFeedFilters, ContentFeedHookResult } from './content-feed/types';

export type { ContentFeedFilters } from './content-feed/types';

export const useContentFeed = (): ContentFeedHookResult => {
  const { user } = useAuth();
  
  // Get interactions hooks
  const { userLikes, userBookmarks, handleLike, handleBookmark, checkUserInteractions } = useContentInteractions({ 
    userId: user?.id 
  });
  
  // Get content data hook
  const { 
    feedItems, 
    isLoading, 
    error, 
    hasMore, 
    loadMore, 
    refetch,
    loadContent,
    isInitialLoad
  } = useContentFetchData({
    userId: user?.id,
    checkUserInteractions
  });
  
  // Get navigation hook
  const { handleContentClick } = useContentNavigation();
  
  // Load content when page changes or on initial load
  useEffect(() => {
    if (isInitialLoad) {
      loadContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    feedItems,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    handleContentClick
  };
};
