
import { useState, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { checkUserContentInteractions, incrementCounter, decrementCounter } from '@/lib/utils/supabase-utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define key types clearly to avoid deep type instantiations
interface UseOptimizedContentInteractionsProps {
  userId: string | null;
  contentType: string;
}

interface ContentInteractionState {
  isLiked: boolean;
  isBookmarked: boolean;
  isLikeLoading: boolean;
  isBookmarkLoading: boolean;
}

// Simple mutation variable type
interface MutationVariables {
  contentId: string;
}

// Simple mutation return type
interface MutationReturn {
  contentId: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export const useOptimizedContentInteractions = ({ 
  userId, 
  contentType 
}: UseOptimizedContentInteractionsProps) => {
  const [interactionState, setInteractionState] = useState<Record<string, ContentInteractionState>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check interactions for a specific content item
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;

    try {
      const result = await checkUserContentInteractions(userId, contentId, contentType);
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          isLiked: result.hasLiked,
          isBookmarked: result.hasBookmarked,
          isLikeLoading: false,
          isBookmarkLoading: false
        }
      }));
    } catch (error) {
      console.error('Error checking content interactions:', error);
    }
  }, [userId, contentType]);

  // Use a simpler approach to handle like mutations
  const likeMutation = useMutation<MutationReturn, Error, MutationVariables>({
    mutationFn: async (variables) => {
      const { contentId } = variables;
      
      if (!userId || !contentId) {
        throw new Error('User ID or Content ID missing');
      }

      // Get the current like state (to toggle)
      const currentState = interactionState[contentId]?.isLiked || false;
      
      // Table name based on content type
      const tableName = contentType === 'quote' ? 'quote_likes' : 'content_likes';
      const contentIdField = contentType === 'quote' ? 'quote_id' : 'content_id';
      const counterTableName = contentType === 'quote' ? 'quotes' : contentType;
      
      if (currentState) {
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
    onMutate: (variables) => {
      const { contentId } = variables;
      // Optimistically update the UI
      const currentState = interactionState[contentId]?.isLiked || false;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...(prev[contentId] || { isBookmarked: false, isBookmarkLoading: false }),
          isLiked: !currentState,
          isLikeLoading: true
        }
      }));
    },
    onSuccess: (data) => {
      // Update with server result
      const { contentId, isLiked } = data;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...(prev[contentId] || { isBookmarked: false, isBookmarkLoading: false }),
          isLiked: isLiked || false,
          isLikeLoading: false
        }
      }));
      
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
      
      // Revert to previous state
      const prevState = !interactionState[contentId]?.isLiked;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...(prev[contentId] || { isBookmarked: false, isBookmarkLoading: false }),
          isLiked: prevState,
          isLikeLoading: false
        }
      }));
    }
  });

  // Similarly simplified approach for bookmark mutations
  const bookmarkMutation = useMutation<MutationReturn, Error, MutationVariables>({
    mutationFn: async (variables) => {
      const { contentId } = variables;
      
      if (!userId || !contentId) {
        throw new Error('User ID or Content ID missing');
      }

      // Get the current bookmark state (to toggle)
      const currentState = interactionState[contentId]?.isBookmarked || false;
      
      // Table name based on content type
      const tableName = contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
      const contentIdField = contentType === 'quote' ? 'quote_id' : 'content_id';
      const counterTableName = contentType === 'quote' ? 'quotes' : contentType;
      
      if (currentState) {
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
    onMutate: (variables) => {
      const { contentId } = variables;
      // Optimistically update the UI
      const currentState = interactionState[contentId]?.isBookmarked || false;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...(prev[contentId] || { isLiked: false, isLikeLoading: false }),
          isBookmarked: !currentState,
          isBookmarkLoading: true
        }
      }));
    },
    onSuccess: (data) => {
      // Update with server result
      const { contentId, isBookmarked } = data;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...(prev[contentId] || { isLiked: false, isLikeLoading: false }),
          isBookmarked: isBookmarked || false,
          isBookmarkLoading: false
        }
      }));
      
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
      
      // Revert to previous state
      const prevState = !interactionState[contentId]?.isBookmarked;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...(prev[contentId] || { isLiked: false, isLikeLoading: false }),
          isBookmarked: prevState,
          isBookmarkLoading: false
        }
      }));
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
