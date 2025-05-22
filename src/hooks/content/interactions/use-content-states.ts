
import { useState, useCallback } from 'react';

/**
 * Hook to manage interaction state records with simple, non-nested state updates
 */
export const useContentStates = () => {
  // Simple flat state objects with clear types
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [likeLoadingStates, setLikeLoadingStates] = useState<Record<string, boolean>>({});
  const [bookmarkLoadingStates, setBookmarkLoadingStates] = useState<Record<string, boolean>>({});

  // Set like state safely
  const setLikeState = useCallback((contentId: string, isLiked: boolean) => {
    setLikedItems(prev => ({...prev, [contentId]: isLiked}));
  }, []);

  // Set bookmark state safely
  const setBookmarkState = useCallback((contentId: string, isBookmarked: boolean) => {
    setBookmarkedItems(prev => ({...prev, [contentId]: isBookmarked}));
  }, []);

  // Set like loading state safely
  const setLikeLoadingState = useCallback((contentId: string, isLoading: boolean) => {
    setLikeLoadingStates(prev => ({...prev, [contentId]: isLoading}));
  }, []);

  // Set bookmark loading state safely
  const setBookmarkLoadingState = useCallback((contentId: string, isLoading: boolean) => {
    setBookmarkLoadingStates(prev => ({...prev, [contentId]: isLoading}));
  }, []);

  // Get state helper with minimal processing
  const getStateForContent = useCallback((contentId: string) => {
    return {
      isLiked: likedItems[contentId] || false,
      isBookmarked: bookmarkedItems[contentId] || false,
      isLikeLoading: likeLoadingStates[contentId] || false,
      isBookmarkLoading: bookmarkLoadingStates[contentId] || false
    };
  }, [likedItems, bookmarkedItems, likeLoadingStates, bookmarkLoadingStates]);

  return {
    likedItems,
    bookmarkedItems,
    likeLoadingStates,
    bookmarkLoadingStates,
    setLikeState,
    setBookmarkState,
    setLikeLoadingState,
    setBookmarkLoadingState,
    getStateForContent
  };
};
