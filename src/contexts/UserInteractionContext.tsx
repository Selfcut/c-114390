
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { toggleUserInteraction } from '@/lib/utils/supabase-utils';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface InteractionState {
  isLiked: boolean;
  isBookmarked: boolean;
}

interface InteractionsState {
  [key: string]: InteractionState;
}

interface UserInteractionContextType {
  interactionStates: InteractionsState;
  toggleLike: (contentId: string, contentType: string) => Promise<boolean>;
  toggleBookmark: (contentId: string, contentType: string) => Promise<boolean>;
  checkInteraction: (contentId: string, contentType: string) => Promise<void>;
  isLoading: Record<string, boolean>;
}

const UserInteractionContext = createContext<UserInteractionContextType | undefined>(undefined);

export const UserInteractionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [interactionStates, setInteractionStates] = useState<InteractionsState>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const checkInteraction = useCallback(
    async (contentId: string, contentType: string) => {
      if (!user || !contentId) return;

      try {
        // Check if we've already loaded this interaction
        if (interactionStates[contentId]) return;

        // Import dynamically to avoid circular dependencies
        const { checkUserContentInteractions } = await import('@/lib/utils/supabase-utils');
        
        const result = await checkUserContentInteractions(user.id, contentId, contentType);
        
        setInteractionStates(prev => ({
          ...prev,
          [contentId]: {
            isLiked: result.hasLiked,
            isBookmarked: result.hasBookmarked
          }
        }));
      } catch (error) {
        console.error('Error checking interaction state:', error);
      }
    },
    [user, interactionStates]
  );

  const toggleLike = useCallback(
    async (contentId: string, contentType: string) => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like content",
          variant: "destructive",
        });
        return false;
      }

      const loadingKey = `like_${contentId}`;
      setIsLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      try {
        // Optimistically update UI
        const currentState = interactionStates[contentId]?.isLiked || false;
        setInteractionStates(prev => ({
          ...prev,
          [contentId]: {
            ...(prev[contentId] || { isBookmarked: false }),
            isLiked: !currentState
          }
        }));

        // Perform the actual toggle
        const newState = await toggleUserInteraction('like', user.id, contentId, contentType);
        
        // Update with server result
        setInteractionStates(prev => ({
          ...prev,
          [contentId]: {
            ...(prev[contentId] || { isBookmarked: false }),
            isLiked: newState
          }
        }));
        
        // Invalidate relevant queries - Fix for React Query v5
        queryClient.invalidateQueries({
          queryKey: [contentType]
        });
        queryClient.invalidateQueries({
          queryKey: [contentType, contentId]
        });
        
        return newState;
      } catch (error) {
        console.error('Error toggling like:', error);
        
        // Revert to previous state on error
        const prevState = !interactionStates[contentId]?.isLiked;
        setInteractionStates(prev => ({
          ...prev,
          [contentId]: {
            ...(prev[contentId] || { isBookmarked: false }),
            isLiked: prevState
          }
        }));
        
        return false;
      } finally {
        setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
      }
    },
    [user, toast, interactionStates, queryClient]
  );

  const toggleBookmark = useCallback(
    async (contentId: string, contentType: string) => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to bookmark content",
          variant: "destructive",
        });
        return false;
      }

      const loadingKey = `bookmark_${contentId}`;
      setIsLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      try {
        // Optimistically update UI
        const currentState = interactionStates[contentId]?.isBookmarked || false;
        setInteractionStates(prev => ({
          ...prev,
          [contentId]: {
            ...(prev[contentId] || { isLiked: false }),
            isBookmarked: !currentState
          }
        }));

        // Perform the actual toggle
        const newState = await toggleUserInteraction('bookmark', user.id, contentId, contentType);
        
        // Update with server result
        setInteractionStates(prev => ({
          ...prev,
          [contentId]: {
            ...(prev[contentId] || { isLiked: false }),
            isBookmarked: newState
          }
        }));
        
        // Invalidate relevant queries - Fix for React Query v5
        queryClient.invalidateQueries({
          queryKey: [contentType, 'bookmarked']
        });
        
        return newState;
      } catch (error) {
        console.error('Error toggling bookmark:', error);
        
        // Revert to previous state on error
        const prevState = !interactionStates[contentId]?.isBookmarked;
        setInteractionStates(prev => ({
          ...prev,
          [contentId]: {
            ...(prev[contentId] || { isLiked: false }),
            isBookmarked: prevState
          }
        }));
        
        return false;
      } finally {
        setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
      }
    },
    [user, toast, interactionStates, queryClient]
  );

  return (
    <UserInteractionContext.Provider
      value={{
        interactionStates,
        toggleLike,
        toggleBookmark,
        checkInteraction,
        isLoading
      }}
    >
      {children}
    </UserInteractionContext.Provider>
  );
};

export const useUserInteraction = () => {
  const context = useContext(UserInteractionContext);
  if (context === undefined) {
    throw new Error('useUserInteraction must be used within a UserInteractionProvider');
  }
  return context;
};

// Hook to use interactions for a specific content item
export const useContentInteraction = (contentId: string, contentType: string) => {
  const { interactionStates, toggleLike, toggleBookmark, checkInteraction, isLoading } = useUserInteraction();
  const interactions = interactionStates[contentId] || { isLiked: false, isBookmarked: false };
  
  const handleCheckInteraction = useCallback(() => {
    checkInteraction(contentId, contentType);
  }, [checkInteraction, contentId, contentType]);
  
  const handleToggleLike = useCallback(() => {
    return toggleLike(contentId, contentType);
  }, [toggleLike, contentId, contentType]);
  
  const handleToggleBookmark = useCallback(() => {
    return toggleBookmark(contentId, contentType);
  }, [toggleBookmark, contentId, contentType]);
  
  return {
    isLiked: interactions.isLiked,
    isBookmarked: interactions.isBookmarked,
    isLikeLoading: isLoading[`like_${contentId}`] || false,
    isBookmarkLoading: isLoading[`bookmark_${contentId}`] || false,
    toggleLike: handleToggleLike,
    toggleBookmark: handleToggleBookmark,
    checkInteraction: handleCheckInteraction
  };
};
