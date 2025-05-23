import { useState, useCallback, useEffect } from 'react';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType } from '@/types/contentTypes';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { getContentStateKey } from '@/lib/utils/content-type-utils';
import { 
  checkUserInteractions, 
  toggleLike, 
  toggleBookmark,
  batchCheckInteractions,
  UserInteractionStatus
} from '@/lib/utils/content-db-operations';
import { useInteractionsState } from './content-interactions/useInteractionsState';

/**
 * Hook configuration props
 */
export interface UseContentInteractionsProps {
  userId?: string | null;
}

/**
 * Result of a like interaction operation
 */
export interface ContentInteractionResult {
  isLiked: boolean;
  id: string;
  contentType?: string;
}

/**
 * Result of a bookmark interaction operation
 */
export interface ContentBookmarkResult {
  isBookmarked: boolean;
  id: string;
  contentType?: string;
}

/**
 * Loading states for content interactions
 */
export interface ContentLoadingState {
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

/**
 * Type of interaction
 */
export type InteractionType = 'like' | 'bookmark';

/**
 * User interactions return type
 */
export interface UserInteractions {
  // State
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  loadingStates: Record<string, ContentLoadingState>;
  
  // Methods
  handleLike: (id: string, itemType: string | ContentType | ContentItemType) => Promise<ContentInteractionResult>;
  handleBookmark: (id: string, itemType: string | ContentType | ContentItemType) => Promise<ContentBookmarkResult>;
  checkUserInteractions: (itemIds: string[], itemType?: string | ContentType | ContentItemType) => Promise<void>;
  getLoadingState: (id: string) => ContentLoadingState;
  isInteractionLoading: (id: string, type: InteractionType) => boolean;
  isItemLiked: (id: string, itemType: string | ContentType | ContentItemType) => boolean;
  isItemBookmarked: (id: string, itemType: string | ContentType | ContentItemType) => boolean;
}

/**
 * Hook for managing content interactions (likes and bookmarks)
 */
export const useContentInteractions = ({ userId }: UseContentInteractionsProps): UserInteractions => {
  const { user } = useAuth();
  const { toast } = useToast();
  const effectiveUserId = userId || user?.id;
  
  const {
    likedItems: userLikes,
    bookmarkedItems: userBookmarks,
    loadingStates,
    getLoadingState: getItemLoadingState,
    isInteractionLoading: isItemInteractionLoading,
    setLikeState,
    setBookmarkState,
    setLikeLoadingState,
    setBookmarkLoadingState,
    isItemLiked,
    isItemBookmarked
  } = useInteractionsState();
  
  // Get loading state for a content item
  const getLoadingState = useCallback((id: string): ContentLoadingState => {
    return getItemLoadingState(id, 'default');
  }, [getItemLoadingState]);
  
  // Check if a specific interaction type is loading
  const isInteractionLoading = useCallback((id: string, type: InteractionType): boolean => {
    return isItemInteractionLoading(id, 'default', type);
  }, [isItemInteractionLoading]);
  
  // Handle like interaction
  const handleLike = useCallback(async (
    id: string, 
    itemType: string | ContentType | ContentItemType
  ): Promise<ContentInteractionResult> => {
    if (!effectiveUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      
      return {
        isLiked: false,
        id,
        contentType: String(itemType)
      };
    }
    
    // Set loading state
    setLikeLoadingState(id, itemType, true);
    
    try {
      // Get current state for optimistic update
      const wasLiked = isItemLiked(id, itemType);
      
      // Optimistic update
      setLikeState(id, itemType, !wasLiked);
      
      // Perform the actual operation
      const isLiked = await toggleLike(effectiveUserId, id, String(itemType));
      
      // If operation failed, revert to previous state
      if (isLiked !== !wasLiked) {
        setLikeState(id, itemType, wasLiked);
      }
      
      return {
        isLiked,
        id,
        contentType: String(itemType)
      };
    } catch (error) {
      console.error('Error handling like:', error);
      
      // Revert on error
      setLikeState(id, itemType, isItemLiked(id, itemType));
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
      
      return {
        isLiked: isItemLiked(id, itemType),
        id,
        contentType: String(itemType)
      };
    } finally {
      // Clear loading state
      setLikeLoadingState(id, itemType, false);
    }
  }, [effectiveUserId, toast, isItemLiked, setLikeState, setLikeLoadingState]);
  
  // Handle bookmark interaction
  const handleBookmark = useCallback(async (
    id: string, 
    itemType: string | ContentType | ContentItemType
  ): Promise<ContentBookmarkResult> => {
    if (!effectiveUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "destructive"
      });
      
      return {
        isBookmarked: false,
        id,
        contentType: String(itemType)
      };
    }
    
    // Set loading state
    setBookmarkLoadingState(id, itemType, true);
    
    try {
      // Get current state for optimistic update
      const wasBookmarked = isItemBookmarked(id, itemType);
      
      // Optimistic update
      setBookmarkState(id, itemType, !wasBookmarked);
      
      // Perform the actual operation
      const isBookmarked = await toggleBookmark(effectiveUserId, id, String(itemType));
      
      // If operation failed, revert to previous state
      if (isBookmarked !== !wasBookmarked) {
        setBookmarkState(id, itemType, wasBookmarked);
      }
      
      return {
        isBookmarked,
        id,
        contentType: String(itemType)
      };
    } catch (error) {
      console.error('Error handling bookmark:', error);
      
      // Revert on error
      setBookmarkState(id, itemType, isItemBookmarked(id, itemType));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      
      return {
        isBookmarked: isItemBookmarked(id, itemType),
        id,
        contentType: String(itemType)
      };
    } finally {
      // Clear loading state
      setBookmarkLoadingState(id, itemType, false);
    }
  }, [effectiveUserId, toast, isItemBookmarked, setBookmarkState, setBookmarkLoadingState]);
  
  // Check user interactions in batch
  const checkUserInteractionsImpl = useCallback(async (
    itemIds: string[], 
    itemType?: string | ContentType | ContentItemType
  ) => {
    if (!effectiveUserId || !itemIds.length) return;
    
    try {
      const type = itemType || 'default';
      
      // Use batch operation for efficiency
      const results = await batchCheckInteractions(effectiveUserId, itemIds, String(type));
      
      // Update states based on results
      Object.entries(results).forEach(([id, status]) => {
        const interactionStatus = status as UserInteractionStatus;
        setLikeState(id, type, interactionStatus.isLiked);
        setBookmarkState(id, type, interactionStatus.isBookmarked);
      });
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  }, [effectiveUserId, setLikeState, setBookmarkState]);
  
  return {
    userLikes,
    userBookmarks,
    loadingStates,
    handleLike,
    handleBookmark,
    checkUserInteractions: checkUserInteractionsImpl,
    getLoadingState,
    isInteractionLoading,
    isItemLiked,
    isItemBookmarked
  };
};
