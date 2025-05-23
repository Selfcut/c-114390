
import { useState, useEffect, useCallback } from 'react';
import { ContentViewMode, ContentType, UnifiedContentItem } from '@/types/unified-content-types';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { useUnifiedContentFeed } from './useUnifiedContentFeed';

// Export ContentFeedItem for backward compatibility
export type ContentFeedItem = UnifiedContentItem;

// Wrapper hook for backward compatibility
export const useContentFeed = (
  contentType: ContentType = 'all',
  viewMode: ContentViewMode = 'list'
) => {
  const {
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
  } = useUnifiedContentFeed(contentType, viewMode);

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
