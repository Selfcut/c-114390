
import { useState, useCallback, useEffect } from 'react';
import { ContentItemType, ContentType } from '@/types/contentTypes';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  checkUserInteractions, 
  toggleLike, 
  toggleBookmark,
  batchCheckInteractions,
  UserInteractionStatus
} from '@/lib/utils/content-db-operations';
import { useInteractionsState } from './content-interactions/useInteractionsState';

export interface UseContentInteractionsProps {
  userId?: string | null;
}

export interface ContentInteractionResult {
  isLiked: boolean;
  id: string;
  contentType?: string;
}

export interface ContentBookmarkResult {
  isBookmarked: boolean;
  id: string;
  contentType?: string;
}

export interface ContentLoadingState {
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

export type InteractionType = 'like' | 'bookmark';

export interface UserInteractions {
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (id: string, itemType: string | ContentType | ContentItemType) => Promise<ContentInteractionResult>;
  handleBookmark: (id: string, itemType: string | ContentType | ContentItemType) => Promise<ContentBookmarkResult>;
  checkUserInteractions: (itemIds: string[], itemType?: string | ContentType | ContentItemType) => Promise<void>;
  getLoadingState: (id: string) => ContentLoadingState;
  isInteractionLoading: (id: string, type: InteractionType) => boolean;
  isItemLiked: (id: string, itemType: string | ContentType | ContentItemType) => boolean;
  isItemBookmarked: (id: string, itemType: string | ContentType | ContentItemType) => boolean;
}

export const useContentInteractions = ({ userId }: UseContentInteractionsProps): UserInteractions => {
  const { user } = useAuth();
  const { toast } = useToast();
  const effectiveUserId = userId || user?.id;
  
  const {
    likedItems: userLikes,
    bookmarkedItems: userBookmarks,
    getLoadingState: getItemLoadingState,
    isInteractionLoading: isItemInteractionLoading,
    setLikeState,
    setBookmarkState,
    setLikeLoadingState,
    setBookmarkLoadingState,
    isItemLiked,
    isItemBookmarked
  } = useInteractionsState();
  
  const getLoadingState = useCallback((id: string): ContentLoadingState => {
    return getItemLoadingState(id, 'default');
  }, [getItemLoadingState]);
  
  const isInteractionLoading = useCallback((id: string, type: InteractionType): boolean => {
    return isItemInteractionLoading(id, 'default', type);
  }, [isItemInteractionLoading]);
  
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
    
    setLikeLoadingState(id, String(itemType), true);
    
    try {
      const wasLiked = isItemLiked(id, String(itemType));
      setLikeState(id, String(itemType), !wasLiked);
      
      const isLiked = await toggleLike(effectiveUserId, id, String(itemType));
      
      if (isLiked !== !wasLiked) {
        setLikeState(id, String(itemType), wasLiked);
      }
      
      return {
        isLiked,
        id,
        contentType: String(itemType)
      };
    } catch (error) {
      console.error('Error handling like:', error);
      setLikeState(id, String(itemType), isItemLiked(id, String(itemType)));
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
      
      return {
        isLiked: isItemLiked(id, String(itemType)),
        id,
        contentType: String(itemType)
      };
    } finally {
      setLikeLoadingState(id, String(itemType), false);
    }
  }, [effectiveUserId, toast, isItemLiked, setLikeState, setLikeLoadingState]);
  
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
    
    setBookmarkLoadingState(id, String(itemType), true);
    
    try {
      const wasBookmarked = isItemBookmarked(id, String(itemType));
      setBookmarkState(id, String(itemType), !wasBookmarked);
      
      const isBookmarked = await toggleBookmark(effectiveUserId, id, String(itemType));
      
      if (isBookmarked !== !wasBookmarked) {
        setBookmarkState(id, String(itemType), wasBookmarked);
      }
      
      return {
        isBookmarked,
        id,
        contentType: String(itemType)
      };
    } catch (error) {
      console.error('Error handling bookmark:', error);
      setBookmarkState(id, String(itemType), isItemBookmarked(id, String(itemType)));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      
      return {
        isBookmarked: isItemBookmarked(id, String(itemType)),
        id,
        contentType: String(itemType)
      };
    } finally {
      setBookmarkLoadingState(id, String(itemType), false);
    }
  }, [effectiveUserId, toast, isItemBookmarked, setBookmarkState, setBookmarkLoadingState]);
  
  const checkUserInteractionsImpl = useCallback(async (
    itemIds: string[], 
    itemType?: string | ContentType | ContentItemType
  ) => {
    if (!effectiveUserId || !itemIds.length) return;
    
    try {
      const type = itemType || 'default';
      const results = await batchCheckInteractions(effectiveUserId, itemIds, String(type));
      
      Object.entries(results).forEach(([id, status]) => {
        const interactionStatus = status as UserInteractionStatus;
        setLikeState(id, String(type), interactionStatus.isLiked);
        setBookmarkState(id, String(type), interactionStatus.isBookmarked);
      });
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  }, [effectiveUserId, setLikeState, setBookmarkState]);
  
  return {
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    checkUserInteractions: checkUserInteractionsImpl,
    getLoadingState,
    isInteractionLoading,
    isItemLiked,
    isItemBookmarked
  };
};
