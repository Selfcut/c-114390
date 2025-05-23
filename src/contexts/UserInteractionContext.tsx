
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toggleUserInteraction } from '@/lib/utils/supabase-utils'; 
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType } from '@/types/contentTypes';
import { normalizeContentType, getContentKey } from '@/hooks/content-interactions/contentTypeUtils';

interface UserInteractionContextType {
  // Backward compatible API that explicitly requires userId
  toggleLike: (contentId: string, contentType: string, userId: string) => Promise<boolean>;
  toggleBookmark: (contentId: string, contentType: string, userId: string) => Promise<boolean>;
  
  // Simplified API that uses the current user's ID automatically
  likeContent: (contentId: string, contentType: string | ContentItemType | ContentType) => Promise<boolean>;
  bookmarkContent: (contentId: string, contentType: string | ContentItemType | ContentType) => Promise<boolean>;
  
  likedItems: Record<string, boolean>;
  bookmarkedItems: Record<string, boolean>;
  isLoading: boolean;
}

const UserInteractionContext = createContext<UserInteractionContextType | undefined>(undefined);

export const UserInteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Toggle like for a content item (with explicit userId)
  const toggleLike = useCallback(async (
    contentId: string, 
    contentType: string, 
    userId: string
  ): Promise<boolean> => {
    const normalizedType = normalizeContentType(contentType);
    const cacheKey = getContentKey(contentId, normalizedType);
    
    // Optimistic update
    setLikedItems(prev => ({
      ...prev,
      [cacheKey]: !prev[cacheKey]
    }));
    
    setIsLoading(true);
    try {
      // Perform the actual API call
      const isLiked = await toggleUserInteraction('like', userId, contentId, normalizedType);
      
      // Update state with the actual result
      setLikedItems(prev => ({
        ...prev,
        [cacheKey]: isLiked
      }));
      
      // Invalidate queries based on content type
      await invalidateContentQueries(contentId, normalizedType);
      
      // Return the new state
      return isLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      setLikedItems(prev => ({
        ...prev,
        [cacheKey]: !prev[cacheKey]
      }));
      
      toast.error('Failed to update like status. Please try again.');
      return !likedItems[cacheKey];
    } finally {
      setIsLoading(false);
    }
  }, [likedItems, queryClient]);
  
  // Helper function to invalidate the appropriate queries
  const invalidateContentQueries = useCallback(async (contentId: string, contentType: string) => {
    if (contentType === 'quote') {
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
      await queryClient.invalidateQueries({ queryKey: ['quote', contentId] });
    } else if (contentType === 'forum') {
      await queryClient.invalidateQueries({ queryKey: ['forum'] });
      await queryClient.invalidateQueries({ queryKey: ['forum', 'post', contentId] });
    } else if (contentType === 'research') {
      await queryClient.invalidateQueries({ queryKey: ['research'] });
      await queryClient.invalidateQueries({ queryKey: ['research', contentId] });
    } else {
      // Generic invalidation for other content types
      await queryClient.invalidateQueries({ queryKey: [contentType] });
      await queryClient.invalidateQueries({ queryKey: [contentType, contentId] });
    }
  }, [queryClient]);
  
  // Simplified like function that uses current user
  const likeContent = useCallback(async (
    contentId: string,
    contentType: string | ContentItemType | ContentType
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You must be logged in to like content');
      return false;
    }
    
    // Normalize content type
    const contentTypeStr = normalizeContentType(contentType);
      
    return toggleLike(contentId, contentTypeStr, user.id);
  }, [toggleLike, user]);
  
  // Toggle bookmark for a content item (with explicit userId)
  const toggleBookmark = useCallback(async (
    contentId: string, 
    contentType: string, 
    userId: string
  ): Promise<boolean> => {
    const normalizedType = normalizeContentType(contentType);
    const cacheKey = getContentKey(contentId, normalizedType);
    
    // Optimistic update
    setBookmarkedItems(prev => ({
      ...prev,
      [cacheKey]: !prev[cacheKey]
    }));
    
    setIsLoading(true);
    try {
      // Perform the actual API call
      const isBookmarked = await toggleUserInteraction('bookmark', userId, contentId, normalizedType);
      
      // Update state with the actual result
      setBookmarkedItems(prev => ({
        ...prev,
        [cacheKey]: isBookmarked
      }));
      
      // Invalidate queries based on content type
      await invalidateContentQueries(contentId, normalizedType);
      
      return isBookmarked;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      
      // Revert optimistic update on error
      setBookmarkedItems(prev => ({
        ...prev,
        [cacheKey]: !prev[cacheKey]
      }));
      
      toast.error('Failed to update bookmark status. Please try again.');
      return !bookmarkedItems[cacheKey];
    } finally {
      setIsLoading(false);
    }
  }, [bookmarkedItems, invalidateContentQueries]);

  // Simplified bookmark function that uses current user
  const bookmarkContent = useCallback(async (
    contentId: string,
    contentType: string | ContentItemType | ContentType
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You must be logged in to bookmark content');
      return false;
    }
    
    // Normalize content type
    const contentTypeStr = normalizeContentType(contentType);
      
    return toggleBookmark(contentId, contentTypeStr, user.id);
  }, [toggleBookmark, user]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ 
    toggleLike, 
    toggleBookmark, 
    likeContent,
    bookmarkContent,
    likedItems, 
    bookmarkedItems,
    isLoading
  }), [
    toggleLike, 
    toggleBookmark, 
    likeContent,
    bookmarkContent,
    likedItems, 
    bookmarkedItems,
    isLoading
  ]);

  return (
    <UserInteractionContext.Provider value={contextValue}>
      {children}
    </UserInteractionContext.Provider>
  );
};

export const useUserInteraction = (): UserInteractionContextType => {
  const context = useContext(UserInteractionContext);
  if (!context) {
    throw new Error('useUserInteraction must be used within a UserInteractionProvider');
  }
  return context;
};
