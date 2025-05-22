
import { useState, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { checkUserContentInteractions } from '@/lib/utils/supabase-utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define simple types for better type safety
interface ContentInteractionState {
  isLiked: boolean;
  isBookmarked: boolean;
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

// Props type
interface UseOptimizedContentInteractionsProps {
  userId: string | null;
  contentType: string;
}

// Mutation results type
interface MutationResult {
  contentId: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// The hook implementation with simplified state management
export const useOptimizedContentInteractions = ({ 
  userId, 
  contentType 
}: UseOptimizedContentInteractionsProps) => {
  // Use a simpler Record for state
  const [interactionState, setInteractionState] = useState<Record<string, ContentInteractionState>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Helper function that creates a default state object
  const getDefaultState = (): ContentInteractionState => ({
    isLiked: false,
    isBookmarked: false,
    isLikeLoading: false,
    isBookmarkLoading: false
  });

  // Get state for a specific content item
  const getStateForContent = (contentId: string): ContentInteractionState => {
    return interactionState[contentId] || getDefaultState();
  };

  // Update state for a content item with explicit type safety
  const updateContentState = useCallback((
    contentId: string, 
    updates: Partial<ContentInteractionState>
  ) => {
    setInteractionState(prevState => {
      const currentState = prevState[contentId] || getDefaultState();
      
      // Create a completely new state object with explicit types
      const newState: ContentInteractionState = {
        isLiked: updates.isLiked !== undefined ? updates.isLiked : currentState.isLiked,
        isBookmarked: updates.isBookmarked !== undefined ? updates.isBookmarked : currentState.isBookmarked,
        isLikeLoading: updates.isLikeLoading !== undefined ? updates.isLikeLoading : currentState.isLikeLoading,
        isBookmarkLoading: updates.isBookmarkLoading !== undefined ? updates.isBookmarkLoading : currentState.isBookmarkLoading
      };
      
      // Create a new record
      return { 
        ...prevState,
        [contentId]: newState 
      };
    });
  }, []);

  // Check interactions for a specific content item
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;

    try {
      const result = await checkUserContentInteractions(userId, contentId, contentType);
      
      // Update state with explicit field assignments
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

  // Like mutation with explicit type handling
  const likeMutation = useMutation({
    mutationFn: async ({ contentId }: { contentId: string }) => {
      if (!userId || !contentId) {
        throw new Error('User ID or Content ID missing');
      }

      // Get current state
      const state = getStateForContent(contentId);
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
        await decrementLikesCounter(contentId, counterTableName);
        
        // Return simplified result
        return { 
          contentId, 
          isLiked: false 
        };
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
        await incrementLikesCounter(contentId, counterTableName);
        
        // Return simplified result
        return { 
          contentId, 
          isLiked: true 
        };
      }
    },
    onMutate: ({ contentId }) => {
      // Store previous state for potential rollback
      const state = getStateForContent(contentId);
      const previousLiked = state.isLiked;
      
      // Update optimistic UI state
      updateContentState(contentId, {
        isLiked: !previousLiked,
        isLikeLoading: true
      });
      
      // No context needed - we'll manually restore on error
    },
    onSuccess: (result) => {
      // Update final state
      updateContentState(result.contentId, {
        isLiked: result.isLiked || false,
        isLikeLoading: false
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [`${contentType}s`]
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${contentType}`, result.contentId]
      });
    },
    onError: (error, { contentId }) => {
      // Get current state
      const state = getStateForContent(contentId);
      
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
      
      // Revert to opposite of current state
      updateContentState(contentId, {
        isLiked: !state.isLiked,
        isLikeLoading: false
      });
    }
  });

  // Bookmark mutation with explicit type handling
  const bookmarkMutation = useMutation({
    mutationFn: async ({ contentId }: { contentId: string }) => {
      if (!userId || !contentId) {
        throw new Error('User ID or Content ID missing');
      }

      // Get current state
      const state = getStateForContent(contentId);
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
          await decrementBookmarksCounter(contentId);
        }
        
        // Return simplified result
        return { 
          contentId, 
          isBookmarked: false 
        };
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
          await incrementBookmarksCounter(contentId);
        }
        
        // Return simplified result
        return {
          contentId,
          isBookmarked: true
        };
      }
    },
    onMutate: ({ contentId }) => {
      // Store previous state for potential rollback
      const state = getStateForContent(contentId);
      const previousBookmarked = state.isBookmarked;
      
      // Update optimistic UI state
      updateContentState(contentId, {
        isBookmarked: !previousBookmarked,
        isBookmarkLoading: true
      });
      
      // No context needed - we'll manually restore on error
    },
    onSuccess: (result) => {
      // Update final state
      updateContentState(result.contentId, {
        isBookmarked: result.isBookmarked || false,
        isBookmarkLoading: false
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [`${contentType}s`, 'bookmarked']
      });
    },
    onError: (error, { contentId }) => {
      // Get current state
      const state = getStateForContent(contentId);
      
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      
      // Revert to opposite of current state
      updateContentState(contentId, {
        isBookmarked: !state.isBookmarked,
        isBookmarkLoading: false
      });
    }
  });

  // Helper functions for counter operations
  async function incrementLikesCounter(contentId: string, tableName: string): Promise<void> {
    try {
      await supabase.rpc('increment_counter_fn', {
        row_id: contentId,
        column_name: 'likes',
        table_name: tableName
      });
    } catch (error) {
      console.error('Error incrementing likes counter:', error);
    }
  }

  async function decrementLikesCounter(contentId: string, tableName: string): Promise<void> {
    try {
      await supabase.rpc('decrement_counter_fn', {
        row_id: contentId,
        column_name: 'likes',
        table_name: tableName
      });
    } catch (error) {
      console.error('Error decrementing likes counter:', error);
    }
  }

  async function incrementBookmarksCounter(contentId: string): Promise<void> {
    try {
      await supabase.rpc('increment_counter_fn', {
        row_id: contentId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
    } catch (error) {
      console.error('Error incrementing bookmarks counter:', error);
    }
  }

  async function decrementBookmarksCounter(contentId: string): Promise<void> {
    try {
      await supabase.rpc('decrement_counter_fn', {
        row_id: contentId,
        column_name: 'bookmarks',
        table_name: 'quotes'
      });
    } catch (error) {
      console.error('Error decrementing bookmarks counter:', error);
    }
  }

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
    handleBookmark,
    getStateForContent
  };
};
