
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
  const handleLike = useCallback(async (id: string, itemType: string): Promise<ContentInteractionResult> => {
    // Implementation will be added in a separate system
    console.log(`Like handler for ${id} of type ${itemType}`);
    
    // Return proper ContentInteractionResult type
    return {
      isLiked: true,
      id: id,
      contentType: itemType
    };
  }, []);

  const handleBookmark = useCallback(async (id: string, itemType: string): Promise<ContentBookmarkResult> => {
    // Implementation will be added in a separate system
    console.log(`Bookmark handler for ${id} of type ${itemType}`);
    
    // Return proper ContentBookmarkResult type
    return {
      isBookmarked: true,
      id: id,
      contentType: itemType
    };
  }, []);

  const checkUserInteractions = useCallback(async (itemIds: string[], itemType?: string) => {
    // Implementation will be added in a separate system
    console.log(`Checking interactions for ${itemIds.join(', ')}${itemType ? ` of type ${itemType}` : ''}`);
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
