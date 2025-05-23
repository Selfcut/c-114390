
import { useState, useCallback } from 'react';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { 
  UseContentInteractionsProps, 
  UserInteractions, 
  ContentInteractionResult, 
  ContentBookmarkResult,
  ContentLoadingState,
  InteractionType
} from './content-interactions/types';
import { useLikeInteractions } from './content-interactions/useLikeInteractions';
import { useBookmarkInteractions } from './content-interactions/useBookmarkInteractions';
import { useInteractionsCheck } from './content-interactions/useInteractionsCheck';
import { useRealtimeInteractions } from './content-interactions/useRealtimeInteractions';
import { getContentKey } from './content-interactions/contentTypeUtils';

export type { 
  UseContentInteractionsProps, 
  ContentInteractionResult, 
  ContentBookmarkResult 
} from './content-interactions/types';

/**
 * Hook for managing content interactions (likes and bookmarks)
 * @param props Hook configuration
 * @returns User interaction state and handlers
 */
export const useContentInteractions = ({ userId }: UseContentInteractionsProps): UserInteractions => {
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, ContentLoadingState>>({});
  
  // Get loading state for a content item
  const getLoadingState = useCallback((id: string): ContentLoadingState => {
    return loadingStates[id] || { isLikeLoading: false, isBookmarkLoading: false };
  }, [loadingStates]);

  // Check if a specific interaction type is loading
  const isInteractionLoading = useCallback((id: string, type: InteractionType): boolean => {
    const state = loadingStates[id];
    if (!state) return false;
    
    return type === 'like' ? state.isLikeLoading : state.isBookmarkLoading;
  }, [loadingStates]);
  
  // Create custom handlers that will be used by individual hooks
  const handleLike = useCallback(async (contentId: string, contentType: string) => {
    // Implementation will be added in a separate system
    console.log(`Like handler for ${contentId} of type ${contentType}`);
    return true;
  }, []);

  const handleBookmark = useCallback(async (contentId: string, contentType: string) => {
    // Implementation will be added in a separate system
    console.log(`Bookmark handler for ${contentId} of type ${contentType}`);
    return true;
  }, []);

  const checkUserInteractions = useCallback(async (contentId: string) => {
    // Implementation will be added in a separate system
    console.log(`Checking interactions for ${contentId}`);
  }, []);
  
  return {
    userLikes,
    userBookmarks,
    loadingStates,
    handleLike,
    handleBookmark,
    checkUserInteractions,
    getLoadingState,
    isInteractionLoading
  };
};
