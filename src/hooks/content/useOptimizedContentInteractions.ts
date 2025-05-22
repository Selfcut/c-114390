
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  checkContentInteractions,
  addContentLike,
  removeContentLike,
  addContentBookmark,
  removeContentBookmark
} from '@/lib/utils/interactions/content-interaction-operations';

/**
 * Input props type for the hook
 */
interface UseOptimizedContentInteractionsProps {
  userId: string | null;
  contentType: string;
}

/**
 * A simplified hook for handling content interactions (likes and bookmarks)
 * with better type safety that prevents deep type instantiation issues
 */
export const useOptimizedContentInteractions = ({ 
  userId, 
  contentType 
}: UseOptimizedContentInteractionsProps) => {
  // Simple state objects with clear types
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
  const [likeLoadingStates, setLikeLoadingStates] = useState<Record<string, boolean>>({});
  const [bookmarkLoadingStates, setBookmarkLoadingStates] = useState<Record<string, boolean>>({});
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check user's interactions with content
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;
    
    try {
      const { isLiked, isBookmarked } = await checkContentInteractions(userId, contentId, contentType);
      
      // Update states independently - no nesting
      setLikedItems(prev => ({...prev, [contentId]: isLiked}));
      setBookmarkedItems(prev => ({...prev, [contentId]: isBookmarked}));
    } catch (error) {
      console.error('Error checking content interactions:', error);
    }
  }, [userId, contentType]);

  // Handle like/unlike with separate state updates
  const handleLike = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "default"
      });
      return null;
    }

    // Get current state
    const isCurrentlyLiked = likedItems[contentId] || false;
    
    // Set loading state - no nesting 
    setLikeLoadingStates(prev => ({...prev, [contentId]: true}));
    
    try {
      // Optimistic update - no nesting
      setLikedItems(prev => ({...prev, [contentId]: !isCurrentlyLiked}));
      
      // Perform API operation
      let success;
      if (isCurrentlyLiked) {
        success = await removeContentLike(userId, contentId, contentType);
      } else {
        success = await addContentLike(userId, contentId, contentType);
      }
      
      // Revert on failure - no nesting
      if (!success) {
        setLikedItems(prev => ({...prev, [contentId]: isCurrentlyLiked}));
        
        toast({
          title: "Error",
          description: "Failed to update like status",
          variant: "destructive"
        });
      } else {
        // Invalidate queries if successful
        queryClient.invalidateQueries({ 
          queryKey: [`${contentType}s`]
        });
        queryClient.invalidateQueries({ 
          queryKey: [`${contentType}`, contentId]
        });
        
        return { isLiked: !isCurrentlyLiked, id: contentId };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert on error - no nesting
      setLikedItems(prev => ({...prev, [contentId]: isCurrentlyLiked}));
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      // Clear loading state - no nesting
      setLikeLoadingStates(prev => ({...prev, [contentId]: false}));
    }
    
    return null;
  }, [userId, likedItems, contentType, toast, queryClient]);

  // Handle bookmark/unbookmark with separate state updates
  const handleBookmark = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "default"
      });
      return null;
    }

    // Get current state
    const isCurrentlyBookmarked = bookmarkedItems[contentId] || false;
    
    // Set loading state - no nesting
    setBookmarkLoadingStates(prev => ({...prev, [contentId]: true}));
    
    try {
      // Optimistic update - no nesting
      setBookmarkedItems(prev => ({...prev, [contentId]: !isCurrentlyBookmarked}));
      
      // Perform API operation
      let success;
      if (isCurrentlyBookmarked) {
        success = await removeContentBookmark(userId, contentId, contentType);
      } else {
        success = await addContentBookmark(userId, contentId, contentType);
      }
      
      // Revert on failure - no nesting
      if (!success) {
        setBookmarkedItems(prev => ({...prev, [contentId]: isCurrentlyBookmarked}));
        
        toast({
          title: "Error",
          description: "Failed to update bookmark status",
          variant: "destructive"
        });
      } else {
        // Invalidate queries if successful
        queryClient.invalidateQueries({ 
          queryKey: [`${contentType}s`, 'bookmarked']
        });
        
        return { isBookmarked: !isCurrentlyBookmarked, id: contentId };
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      
      // Revert on error - no nesting
      setBookmarkedItems(prev => ({...prev, [contentId]: isCurrentlyBookmarked}));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    } finally {
      // Clear loading state - no nesting
      setBookmarkLoadingStates(prev => ({...prev, [contentId]: false}));
    }
    
    return null;
  }, [userId, bookmarkedItems, contentType, toast, queryClient]);

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
    checkInteractions,
    handleLike,
    handleBookmark,
    getStateForContent
  };
};
