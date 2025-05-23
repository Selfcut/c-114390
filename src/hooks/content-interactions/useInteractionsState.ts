
import { useState, useCallback } from 'react';
import { getContentStateKey } from '@/lib/utils/content-type-utils';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType } from '@/types/contentTypes';

/**
 * State tracking for content loading
 */
export interface LoadingState {
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

/**
 * Hook for managing content interaction states with proper caching
 */
export const useInteractionsState = () => {
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});
  
  /**
   * Get the loading state for a content item
   */
  const getLoadingState = useCallback((id: string, type: string | ContentType | ContentItemType): LoadingState => {
    const key = getContentStateKey(id, type);
    return loadingStates[key] || { isLikeLoading: false, isBookmarkLoading: false };
  }, [loadingStates]);
  
  /**
   * Check if a specific interaction type is loading
   */
  const isInteractionLoading = useCallback((
    id: string, 
    type: string | ContentType | ContentItemType,
    interactionType: 'like' | 'bookmark'
  ): boolean => {
    const key = getContentStateKey(id, type);
    const state = loadingStates[key];
    if (!state) return false;
    
    return interactionType === 'like' ? state.isLikeLoading : state.isBookmarkLoading;
  }, [loadingStates]);
  
  /**
   * Set the like state for a content item
   */
  const setLikeState = useCallback((
    id: string, 
    type: string | ContentType | ContentItemType,
    isLiked: boolean
  ): void => {
    const key = getContentStateKey(id, type);
    setLikedItems(prev => ({
      ...prev,
      [key]: isLiked
    }));
  }, []);
  
  /**
   * Set the bookmark state for a content item
   */
  const setBookmarkState = useCallback((
    id: string,
    type: string | ContentType | ContentItemType,
    isBookmarked: boolean
  ): void => {
    const key = getContentStateKey(id, type);
    setBookmarkedItems(prev => ({
      ...prev,
      [key]: isBookmarked
    }));
  }, []);
  
  /**
   * Set the loading state for a like operation
   */
  const setLikeLoadingState = useCallback((
    id: string,
    type: string | ContentType | ContentItemType,
    isLoading: boolean
  ): void => {
    const key = getContentStateKey(id, type);
    setLoadingStates(prev => {
      const current = prev[key] || { isLikeLoading: false, isBookmarkLoading: false };
      return {
        ...prev,
        [key]: {
          ...current,
          isLikeLoading: isLoading
        }
      };
    });
  }, []);
  
  /**
   * Set the loading state for a bookmark operation
   */
  const setBookmarkLoadingState = useCallback((
    id: string,
    type: string | ContentType | ContentItemType,
    isLoading: boolean
  ): void => {
    const key = getContentStateKey(id, type);
    setLoadingStates(prev => {
      const current = prev[key] || { isLikeLoading: false, isBookmarkLoading: false };
      return {
        ...prev,
        [key]: {
          ...current,
          isBookmarkLoading: isLoading
        }
      };
    });
  }, []);
  
  /**
   * Check if a content item is liked
   */
  const isItemLiked = useCallback((
    id: string,
    type: string | ContentType | ContentItemType
  ): boolean => {
    const key = getContentStateKey(id, type);
    return !!likedItems[key];
  }, [likedItems]);
  
  /**
   * Check if a content item is bookmarked
   */
  const isItemBookmarked = useCallback((
    id: string,
    type: string | ContentType | ContentItemType
  ): boolean => {
    const key = getContentStateKey(id, type);
    return !!bookmarkedItems[key];
  }, [bookmarkedItems]);
  
  return {
    likedItems,
    bookmarkedItems,
    loadingStates,
    getLoadingState,
    isInteractionLoading,
    setLikeState,
    setBookmarkState,
    setLikeLoadingState,
    setBookmarkLoadingState,
    isItemLiked,
    isItemBookmarked
  };
};
