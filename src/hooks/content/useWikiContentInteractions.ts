
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  addWikiLike,
  removeWikiLike,
  addWikiBookmark,
  removeWikiBookmark,
  checkWikiInteractions
} from '@/lib/utils/interactions/wiki-like-operations';

/**
 * A simplified hook for handling Wiki article interactions (likes and bookmarks)
 */
export const useWikiContentInteractions = (userId: string | null) => {
  // Simple state management with direct booleans instead of complex records
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, {
    isLikeLoading: boolean;
    isBookmarkLoading: boolean;
  }>>({});
  
  const { toast } = useToast();
  
  // Helper to get loading state
  const getLoadingState = useCallback((contentId: string) => {
    return loadingStates[contentId] || { 
      isLikeLoading: false, 
      isBookmarkLoading: false 
    };
  }, [loadingStates]);
  
  // Helper to update loading state
  const setLoading = useCallback((
    contentId: string, 
    type: 'like' | 'bookmark', 
    isLoading: boolean
  ) => {
    setLoadingStates(prev => {
      const current = prev[contentId] || { 
        isLikeLoading: false, 
        isBookmarkLoading: false 
      };
      
      return {
        ...prev,
        [contentId]: {
          ...current,
          [type === 'like' ? 'isLikeLoading' : 'isBookmarkLoading']: isLoading
        }
      };
    });
  }, []);
  
  // Handle like action with simple state updates
  const handleLike = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "default"
      });
      return;
    }
    
    // Get current liked state
    const isCurrentlyLiked = likedItems[contentId] || false;
    
    // Set loading state
    setLoading(contentId, 'like', true);
    
    try {
      // Optimistic update
      setLikedItems(prev => ({
        ...prev,
        [contentId]: !isCurrentlyLiked
      }));
      
      // Perform the actual API operation
      let success;
      if (isCurrentlyLiked) {
        success = await removeWikiLike(userId, contentId);
      } else {
        success = await addWikiLike(userId, contentId);
      }
      
      // Revert on failure
      if (!success) {
        setLikedItems(prev => ({
          ...prev,
          [contentId]: isCurrentlyLiked
        }));
        
        toast({
          title: "Error",
          description: "Failed to update like status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      
      // Revert on error
      setLikedItems(prev => ({
        ...prev,
        [contentId]: isCurrentlyLiked
      }));
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setLoading(contentId, 'like', false);
    }
  }, [userId, likedItems, toast, setLoading]);
  
  // Handle bookmark action with simple state updates
  const handleBookmark = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "default"
      });
      return;
    }
    
    // Get current bookmarked state
    const isCurrentlyBookmarked = bookmarkedItems[contentId] || false;
    
    // Set loading state
    setLoading(contentId, 'bookmark', true);
    
    try {
      // Optimistic update
      setBookmarkedItems(prev => ({
        ...prev,
        [contentId]: !isCurrentlyBookmarked
      }));
      
      // Perform the actual API operation
      let success;
      if (isCurrentlyBookmarked) {
        success = await removeWikiBookmark(userId, contentId);
      } else {
        success = await addWikiBookmark(userId, contentId);
      }
      
      // Revert on failure
      if (!success) {
        setBookmarkedItems(prev => ({
          ...prev,
          [contentId]: isCurrentlyBookmarked
        }));
        
        toast({
          title: "Error",
          description: "Failed to update bookmark status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
      
      // Revert on error
      setBookmarkedItems(prev => ({
        ...prev,
        [contentId]: isCurrentlyBookmarked
      }));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
        });
    } finally {
      setLoading(contentId, 'bookmark', false);
    }
  }, [userId, bookmarkedItems, toast, setLoading]);
  
  // Check interactions for a content item
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;
    
    try {
      const { isLiked, isBookmarked } = await checkWikiInteractions(userId, contentId);
      
      setLikedItems(prev => ({
        ...prev,
        [contentId]: isLiked
      }));
      
      setBookmarkedItems(prev => ({
        ...prev,
        [contentId]: isBookmarked
      }));
    } catch (error) {
      console.error('Error checking interactions:', error);
    }
  }, [userId]);
  
  return {
    likedItems,
    bookmarkedItems,
    checkInteractions,
    handleLike,
    handleBookmark,
    getLoadingState
  };
};
