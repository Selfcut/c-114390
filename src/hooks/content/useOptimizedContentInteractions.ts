
import { useState, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { checkUserContentInteractions, incrementCounter, decrementCounter } from '@/lib/utils/supabase-utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define simple concrete types
interface ContentInteractionState {
  isLiked: boolean;
  isBookmarked: boolean;
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

// Creates a default state object to avoid null checks
const createDefaultState = (): ContentInteractionState => ({
  isLiked: false,
  isBookmarked: false,
  isLikeLoading: false,
  isBookmarkLoading: false
});

// Define props type
interface UseOptimizedContentInteractionsProps {
  userId: string | null;
  contentType: string;
}

// Define mutation variables type
interface MutationVariables {
  contentId: string;
}

// Define mutation return type
interface MutationReturn {
  contentId: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export const useOptimizedContentInteractions = ({ 
  userId, 
  contentType 
}: UseOptimizedContentInteractionsProps) => {
  // Use a simpler state structure
  const [interactionState, setInteractionState] = useState<Record<string, ContentInteractionState>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Helper function to update state safely
  const updateContentState = useCallback((
    contentId: string, 
    updates: Partial<ContentInteractionState>
  ) => {
    setInteractionState(prevState => {
      const currentState = prevState[contentId] || createDefaultState();
      return {
        ...prevState,
        [contentId]: {
          ...currentState,
          ...updates
        }
      };
    });
  }, []);

  // Check interactions for a specific content item
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;

    try {
      const result = await checkUserContentInteractions(userId, contentId, contentType);
      
      updateContentState(contentId, {
        isLiked: result.hasLiked,
        isBookmarked: result.hasBookmarked,
        isLikeLoading: false,
        isBookmarkLoading: false
      });
    } catch (error) {
      console.error('Error checking content interactions:', error);
    }
  }, [userId, contentType, updateContentState]);

  // Like mutation with simplified state management
  const likeMutation = useMutation<MutationReturn, Error, MutationVariables>({
    mutationFn: async ({ contentId }) => {
      if (!userId || !contentId) {
        throw new Error('User ID or Content ID missing');
      }

      // Get the current state using a local variable
      const state = interactionState[contentId] || createDefaultState();
      const currentlyLiked = state.isLiked;
      
      // Table name based on content type
      const tableName = contentType === 'quote' ? 'quote_likes' : 'content_likes';
      const contentIdField = contentType === 'quote' ? 'quote_id' : 'content_id';
      const counterTableName = contentType === 'quote' ? 'quotes' : contentType;
      
      if (currentlyLiked) {
        // Unlike - Delete existing like
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(contentIdField, contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        // Decrement likes counter
        await decrementCounter(contentId, 'likes', counterTableName);
        
        return { contentId, isLiked: false };
      } else {
        // Like - Insert new like
        if (contentType === 'quote') {
          // For quote likes
          const { error } = await supabase
            .from('quote_likes')
            .insert({
              quote_id: contentId,
              user_id: userId
            });
            
          if (error) throw error;
        } else {
          // For other content types
          const { error } = await supabase
            .from('content_likes')
            .insert({
              content_id: contentId,
              content_type: contentType,
              user_id: userId
            });
            
          if (error) throw error;
        }
        
        // Increment likes counter
        await incrementCounter(contentId, 'likes', counterTableName);
        
        return { contentId, isLiked: true };
      }
    },
    onMutate: ({ contentId }) => {
      // Get current state
      const state = interactionState[contentId] || createDefaultState();
      
      // Create a new state object with fixed types
      const newState: ContentInteractionState = {
        isLiked: !state.isLiked,
        isBookmarked: state.isBookmarked,
        isLikeLoading: true,
        isBookmarkLoading: state.isBookmarkLoading
      };
      
      // Update the state with the new object directly
      setInteractionState({
        ...interactionState,
        [contentId]: newState
      });
    },
    onSuccess: (data) => {
      // Update with server result
      const { contentId, isLiked } = data;
      
      // Create an explicit state object
      const successState: ContentInteractionState = {
        isLiked: isLiked ?? false,
        isBookmarked: interactionState[contentId]?.isBookmarked || false,
        isLikeLoading: false,
        isBookmarkLoading: interactionState[contentId]?.isBookmarkLoading || false
      };
      
      // Update state directly with the fixed type
      setInteractionState({
        ...interactionState,
        [contentId]: successState
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [`${contentType}s`]
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${contentType}`, contentId]
      });
    },
    onError: (error, variables) => {
      const { contentId } = variables;
      
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
      
      // Get current state and create a fixed revert state
      const state = interactionState[contentId] || createDefaultState();
      const revertState: ContentInteractionState = {
        isLiked: !state.isLiked,
        isBookmarked: state.isBookmarked,
        isLikeLoading: false,
        isBookmarkLoading: state.isBookmarkLoading
      };
      
      // Update state directly with the fixed type
      setInteractionState({
        ...interactionState,
        [contentId]: revertState
      });
    }
  });

  // Bookmark mutation with similarly simplified state management
  const bookmarkMutation = useMutation<MutationReturn, Error, MutationVariables>({
    mutationFn: async ({ contentId }) => {
      if (!userId || !contentId) {
        throw new Error('User ID or Content ID missing');
      }

      // Get the current state using a local variable
      const state = interactionState[contentId] || createDefaultState();
      const currentlyBookmarked = state.isBookmarked;
      
      // Table name based on content type
      const tableName = contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
      const contentIdField = contentType === 'quote' ? 'quote_id' : 'content_id';
      const counterTableName = contentType === 'quote' ? 'quotes' : contentType;
      
      if (currentlyBookmarked) {
        // Unbookmark - Delete existing bookmark
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(contentIdField, contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        // Decrement bookmarks counter if available
        if (contentType === 'quote') {
          await decrementCounter(contentId, 'bookmarks', counterTableName);
        }
        
        return { contentId, isBookmarked: false };
      } else {
        // Bookmark - Insert new bookmark
        if (contentType === 'quote') {
          // For quote bookmarks
          const { error } = await supabase
            .from('quote_bookmarks')
            .insert({
              quote_id: contentId,
              user_id: userId
            });
            
          if (error) throw error;
        } else {
          // For other content types
          const { error } = await supabase
            .from('content_bookmarks')
            .insert({
              content_id: contentId,
              content_type: contentType,
              user_id: userId
            });
            
          if (error) throw error;
        }
        
        // Increment bookmarks counter if available
        if (contentType === 'quote') {
          await incrementCounter(contentId, 'bookmarks', counterTableName);
        }
        
        return { contentId, isBookmarked: true };
      }
    },
    onMutate: ({ contentId }) => {
      // Get current state
      const state = interactionState[contentId] || createDefaultState();
      
      // Create a new state object with fixed types
      const newState: ContentInteractionState = {
        isLiked: state.isLiked,
        isBookmarked: !state.isBookmarked,
        isLikeLoading: state.isLikeLoading,
        isBookmarkLoading: true
      };
      
      // Update the state with the new object directly
      setInteractionState({
        ...interactionState,
        [contentId]: newState
      });
    },
    onSuccess: (data) => {
      // Update with server result
      const { contentId, isBookmarked } = data;
      
      // Create an explicit state object
      const successState: ContentInteractionState = {
        isLiked: interactionState[contentId]?.isLiked || false,
        isBookmarked: isBookmarked ?? false,
        isLikeLoading: interactionState[contentId]?.isLikeLoading || false,
        isBookmarkLoading: false
      };
      
      // Update state directly with the fixed type
      setInteractionState({
        ...interactionState,
        [contentId]: successState
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [`${contentType}s`, 'bookmarked']
      });
    },
    onError: (error, variables) => {
      const { contentId } = variables;
      
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      
      // Get current state and create a fixed revert state
      const state = interactionState[contentId] || createDefaultState();
      const revertState: ContentInteractionState = {
        isLiked: state.isLiked,
        isBookmarked: !state.isBookmarked,
        isLikeLoading: state.isLikeLoading,
        isBookmarkLoading: false
      };
      
      // Update state directly with the fixed type
      setInteractionState({
        ...interactionState,
        [contentId]: revertState
      });
    }
  });

  // Handle like action
  const handleLike = useCallback((contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "default"
      });
      return;
    }
    
    likeMutation.mutate({ contentId });
  }, [userId, likeMutation, toast]);

  // Handle bookmark action  
  const handleBookmark = useCallback((contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "default"
      });
      return;
    }
    
    bookmarkMutation.mutate({ contentId });
  }, [userId, bookmarkMutation, toast]);

  return {
    interactionState,
    checkInteractions,
    handleLike,
    handleBookmark
  };
};
