
import { useState, useCallback, useEffect } from 'react';
import { checkUserInteractions, toggleLike, normalizeContentType } from '@/lib/utils/content-operations';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface UseLikeInteractionsProps {
  contentId: string;
  contentType: string | ContentType | ContentItemType;
  initialLikeCount?: number;
  onLikeChange?: (newLikeCount: number) => void;
}

/**
 * Hook for managing like interactions for different content types
 */
export const useLikeInteractions = ({
  contentId,
  contentType,
  initialLikeCount = 0,
  onLikeChange,
}: UseLikeInteractionsProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { toast } = useToast();
  
  const normalizedType = normalizeContentType(contentType);

  // Fetch initial like state on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchInitialLikeState = async () => {
        try {
          setIsLoading(true);
          
          const interactions = await checkUserInteractions(
            user.id,
            contentId,
            normalizedType
          );
          
          setIsLiked(interactions.isLiked);
        } catch (error) {
          console.error('Error fetching initial like state:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchInitialLikeState();
    }
  }, [isAuthenticated, user, contentId, normalizedType]);

  // Function to toggle like
  const handleToggleLike = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to like this content.',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Optimistic update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);
      
      // Use the utility function for like operations
      const result = await toggleLike(
        user.id,
        contentId,
        normalizedType
      );
      
      // Update state if the result is different from our optimistic update
      if (result !== newIsLiked) {
        setIsLiked(result);
        setLikeCount(prevCount => result ? prevCount + 1 : prevCount - 1);
      }
      
      // Notify parent component about like count change
      if (onLikeChange) {
        onLikeChange(result ? likeCount + 1 : likeCount - 1);
      }
      
      return result;
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikeCount(prevCount => isLiked ? prevCount + 1 : prevCount - 1);
      
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
      
      return isLiked;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, contentId, isLiked, likeCount, normalizedType, onLikeChange, toast]);

  return {
    isLiked,
    likeCount,
    isLoading,
    toggleLike: handleToggleLike,
  };
};
