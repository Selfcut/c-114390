
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  checkContentInteractions,
  addContentLike,
  removeContentLike,
  addContentBookmark,
  removeContentBookmark
} from '@/lib/utils/interactions/content-interaction-operations';
import { useContentStates } from './interactions/use-content-states';

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
  const {
    likedItems,
    bookmarkedItems,
    setLikeState,
    setBookmarkState,
    setLikeLoadingState,
    setBookmarkLoadingState,
    getStateForContent
  } = useContentStates();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check user's interactions with content
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;
    
    try {
      const { isLiked, isBookmarked } = await checkContentInteractions(userId, contentId, contentType);
      
      // Update states separately with our helper functions
      setLikeState(contentId, isLiked);
      setBookmarkState(contentId, isBookmarked);
    } catch (error) {
      console.error('Error checking content interactions:', error);
    }
  }, [userId, contentType, setLikeState, setBookmarkState]);

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
    
    // Set loading state with helper function
    setLikeLoadingState(contentId, true);
    
    try {
      // Optimistic update with helper function
      setLikeState(contentId, !isCurrentlyLiked);
      
      // Perform API operation
      let success;
      if (isCurrentlyLiked) {
        success = await removeContentLike(userId, contentId, contentType);
      } else {
        success = await addContentLike(userId, contentId, contentType);
      }
      
      // Revert on failure with helper function
      if (!success) {
        setLikeState(contentId, isCurrentlyLiked);
        
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
      
      // Revert on error with helper function
      setLikeState(contentId, isCurrentlyLiked);
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      // Clear loading state with helper function
      setLikeLoadingState(contentId, false);
    }
    
    return null;
  }, [userId, likedItems, contentType, toast, queryClient, setLikeState, setLikeLoadingState]);

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
    
    // Set loading state with helper function
    setBookmarkLoadingState(contentId, true);
    
    try {
      // Optimistic update with helper function
      setBookmarkState(contentId, !isCurrentlyBookmarked);
      
      // Perform API operation
      let success;
      if (isCurrentlyBookmarked) {
        success = await removeContentBookmark(userId, contentId, contentType);
      } else {
        success = await addContentBookmark(userId, contentId, contentType);
      }
      
      // Revert on failure with helper function
      if (!success) {
        setBookmarkState(contentId, isCurrentlyBookmarked);
        
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
      
      // Revert on error with helper function
      setBookmarkState(contentId, isCurrentlyBookmarked);
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    } finally {
      // Clear loading state with helper function
      setBookmarkLoadingState(contentId, false);
    }
    
    return null;
  }, [userId, bookmarkedItems, contentType, toast, queryClient, setBookmarkState, setBookmarkLoadingState]);

  return {
    likedItems,
    bookmarkedItems,
    checkInteractions,
    handleLike,
    handleBookmark,
    getStateForContent
  };
};
