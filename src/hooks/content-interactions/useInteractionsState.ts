
import { useState, useCallback } from 'react';
import { getContentStateKey } from './contentTypeUtils';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType } from '@/types/contentTypes';

export interface ContentLoadingState {
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

export type InteractionType = 'like' | 'bookmark';

export function useInteractionsState() {
  // State for liked items
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  
  // State for bookmarked items
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  
  // State for loading interactions
  const [loadingStates, setLoadingStates] = useState<Record<string, ContentLoadingState>>({});
  
  // Set like state for a content item
  const setLikeState = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType, 
    isLiked: boolean
  ) => {
    const key = getContentStateKey(id, contentType);
    setLikedItems(prev => ({
      ...prev,
      [key]: isLiked
    }));
  }, []);
  
  // Set bookmark state for a content item
  const setBookmarkState = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType, 
    isBookmarked: boolean
  ) => {
    const key = getContentStateKey(id, contentType);
    setBookmarkedItems(prev => ({
      ...prev,
      [key]: isBookmarked
    }));
  }, []);
  
  // Set like loading state for a content item
  const setLikeLoadingState = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType, 
    isLoading: boolean
  ) => {
    const key = getContentStateKey(id, contentType);
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { isLikeLoading: false, isBookmarkLoading: false }),
        isLikeLoading: isLoading
      }
    }));
  }, []);
  
  // Set bookmark loading state for a content item
  const setBookmarkLoadingState = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType, 
    isLoading: boolean
  ) => {
    const key = getContentStateKey(id, contentType);
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { isLikeLoading: false, isBookmarkLoading: false }),
        isBookmarkLoading: isLoading
      }
    }));
  }, []);
  
  // Get loading state for a content item
  const getLoadingState = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType
  ): ContentLoadingState => {
    const key = getContentStateKey(id, contentType);
    return loadingStates[key] || { isLikeLoading: false, isBookmarkLoading: false };
  }, [loadingStates]);
  
  // Check if a specific interaction is loading
  const isInteractionLoading = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType, 
    interactionType: InteractionType
  ): boolean => {
    const state = getLoadingState(id, contentType);
    return interactionType === 'like' ? state.isLikeLoading : state.isBookmarkLoading;
  }, [getLoadingState]);
  
  // Check if a content item is liked
  const isItemLiked = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType
  ): boolean => {
    const key = getContentStateKey(id, contentType);
    return !!likedItems[key];
  }, [likedItems]);
  
  // Check if a content item is bookmarked
  const isItemBookmarked = useCallback((
    id: string, 
    contentType: string | ContentType | ContentItemType
  ): boolean => {
    const key = getContentStateKey(id, contentType);
    return !!bookmarkedItems[key];
  }, [bookmarkedItems]);
  
  return {
    likedItems,
    bookmarkedItems,
    loadingStates,
    setLikeState,
    setBookmarkState,
    setLikeLoadingState,
    setBookmarkLoadingState,
    getLoadingState,
    isInteractionLoading,
    isItemLiked,
    isItemBookmarked
  };
}
