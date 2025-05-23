
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toggleUserInteraction } from '@/lib/utils/supabase-utils'; 
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { getContentKey } from '@/hooks/content-interactions/contentTypeUtils';

interface UserInteractionContextType {
  // Backward compatible API that explicitly requires userId
  toggleLike: (contentId: string, contentType: string, userId: string) => Promise<boolean>;
  toggleBookmark: (contentId: string, contentType: string, userId: string) => Promise<boolean>;
  
  // Simplified API that uses the current user's ID automatically
  likeContent: (contentId: string, contentType: string | ContentItemType) => Promise<boolean>;
  bookmarkContent: (contentId: string, contentType: string | ContentItemType) => Promise<boolean>;
  
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

  // Generate a unique cache key for an item - memoized for performance
  const getCacheKey = useCallback((contentId: string, contentType: string): string => {
    return `${contentType}:${contentId}`;
  }, []);

  // Toggle like for a content item (with explicit userId)
  const toggleLike = useCallback(async (
    contentId: string, 
    contentType: string, 
    userId: string
  ): Promise<boolean> => {
    const cacheKey = getCacheKey(contentId, contentType);
    
    // Optimistic update
    setLikedItems(prev => ({
      ...prev,
      [cacheKey]: !prev[cacheKey]
    }));
    
    setIsLoading(true);
    try {
      // Perform the actual API call
      const isLiked = await toggleUserInteraction('like', userId, contentId, contentType);
      
      // Update state with the actual result
      setLikedItems(prev => ({
        ...prev,
        [cacheKey]: isLiked
      }));
      
      // Determine which query keys to invalidate based on content type
      if (contentType === 'quote') {
        // For React Query v5, use objects for invalidateQueries
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
  }, [likedItems, queryClient, getCacheKey]);
  
  // Simplified like function that uses current user
  const likeContent = useCallback(async (
    contentId: string,
    contentType: string | ContentItemType
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You must be logged in to like content');
      return false;
    }
    
    // Ensure contentType is a string
    const contentTypeStr = typeof contentType === 'string' 
      ? contentType 
      : contentType.toLowerCase();
      
    return toggleLike(contentId, contentTypeStr, user.id);
  }, [toggleLike, user]);
  
  // Toggle bookmark for a content item (with explicit userId)
  const toggleBookmark = useCallback(async (
    contentId: string, 
    contentType: string, 
    userId: string
  ): Promise<boolean> => {
    const cacheKey = getCacheKey(contentId, contentType);
    
    // Optimistic update
    setBookmarkedItems(prev => ({
      ...prev,
      [cacheKey]: !prev[cacheKey]
    }));
    
    setIsLoading(true);
    try {
      // Perform the actual API call
      const isBookmarked = await toggleUserInteraction('bookmark', userId, contentId, contentType);
      
      // Update state with the actual result
      setBookmarkedItems(prev => ({
        ...prev,
        [cacheKey]: isBookmarked
      }));
      
      // Invalidate queries based on content type
      if (contentType === 'quote') {
        // For React Query v5, use objects for invalidateQueries
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
  }, [bookmarkedItems, queryClient, getCacheKey]);

  // Simplified bookmark function that uses current user
  const bookmarkContent = useCallback(async (
    contentId: string,
    contentType: string | ContentItemType
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You must be logged in to bookmark content');
      return false;
    }
    
    // Ensure contentType is a string
    const contentTypeStr = typeof contentType === 'string' 
      ? contentType 
      : contentType.toLowerCase();
      
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
