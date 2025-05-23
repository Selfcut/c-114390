
import { useState, useCallback } from 'react';

/**
 * Hook for managing interaction states like likes and bookmarks
 */
export const useInteractionsState = () => {
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [likeLoadingStates, setLikeLoadingStates] = useState<Record<string, boolean>>({});
  const [bookmarkLoadingStates, setBookmarkLoadingStates] = useState<Record<string, boolean>>({});

  /**
   * Generate a consistent state key for content
   */
  const getStateKey = useCallback((id: string, type: string): string => {
    const contentType = String(type).toLowerCase();
    return `${contentType}:${id}`;
  }, []);

  /**
   * Check if an item is liked
   */
  const isItemLiked = useCallback((id: string, type: string): boolean => {
    const key = getStateKey(id, type);
    return likedItems[key] || false;
  }, [likedItems, getStateKey]);

  /**
   * Check if an item is bookmarked
   */
  const isItemBookmarked = useCallback((id: string, type: string): boolean => {
    const key = getStateKey(id, type);
    return bookmarkedItems[key] || false;
  }, [bookmarkedItems, getStateKey]);

  /**
   * Set like state for a content item
   */
  const setLikeState = useCallback((id: string, type: string, isLiked: boolean) => {
    const key = getStateKey(id, type);
    setLikedItems(prev => ({ ...prev, [key]: isLiked }));
  }, [getStateKey]);

  /**
   * Set bookmark state for a content item
   */
  const setBookmarkState = useCallback((id: string, type: string, isBookmarked: boolean) => {
    const key = getStateKey(id, type);
    setBookmarkedItems(prev => ({ ...prev, [key]: isBookmarked }));
  }, [getStateKey]);

  /**
   * Set like loading state for a content item
   */
  const setLikeLoadingState = useCallback((id: string, type: string, isLoading: boolean) => {
    const key = getStateKey(id, type);
    setLikeLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  }, [getStateKey]);

  /**
   * Set bookmark loading state for a content item
   */
  const setBookmarkLoadingState = useCallback((id: string, type: string, isLoading: boolean) => {
    const key = getStateKey(id, type);
    setBookmarkLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  }, [getStateKey]);

  /**
   * Get loading state for a content item
   */
  const getLoadingState = useCallback((id: string, type: string) => {
    const key = getStateKey(id, type);
    return {
      isLikeLoading: likeLoadingStates[key] || false,
      isBookmarkLoading: bookmarkLoadingStates[key] || false
    };
  }, [getStateKey, likeLoadingStates, bookmarkLoadingStates]);

  /**
   * Check if an interaction is loading
   */
  const isInteractionLoading = useCallback((
    id: string, 
    type: string, 
    interactionType: 'like' | 'bookmark'
  ): boolean => {
    const key = getStateKey(id, type);
    return interactionType === 'like' 
      ? likeLoadingStates[key] || false 
      : bookmarkLoadingStates[key] || false;
  }, [getStateKey, likeLoadingStates, bookmarkLoadingStates]);

  return {
    likedItems,
    bookmarkedItems,
    loadingStates: { likeLoadingStates, bookmarkLoadingStates },
    getStateKey,
    isItemLiked,
    isItemBookmarked,
    setLikeState,
    setBookmarkState,
    setLikeLoadingState,
    setBookmarkLoadingState,
    getLoadingState,
    isInteractionLoading
  };
};
