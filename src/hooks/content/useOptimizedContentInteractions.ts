
import { useState, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { checkUserContentInteractions, incrementCounter, decrementCounter } from '@/lib/utils/supabase-utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  // Handle like interaction with optimistic updates
  const likeMutation = useMutation({
    mutationFn: async ({ contentId }: { contentId: string }) => {
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
        const { data, error } = await supabase
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
        const insertData: Record<string, any> = {
          user_id: userId
        };
        
        // Set the correct content id field based on content type
        insertData[contentIdField] = contentId;
        
        // Add content_type field if not a quote
        if (contentType !== 'quote') {
          insertData['content_type'] = contentType;
        }
        
        const { data, error } = await supabase
          .from(tableName)
          .insert(insertData);
          
        if (error) throw error;
        
        // Increment likes counter
        await incrementCounter(contentId, 'likes', counterTableName);
        
        return { contentId, isLiked: true };
      }
    },
    onMutate: ({ contentId }) => {
      // Optimistically update the UI
      const currentState = interactionState[contentId]?.isLiked || false;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...prev[contentId] || { isBookmarked: false, isBookmarkLoading: false },
          isLiked: !currentState,
          isLikeLoading: true
        }
      }));
    },
    onSuccess: ({ contentId, isLiked }) => {
      // Update with server result
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...prev[contentId] || { isBookmarked: false, isBookmarkLoading: false },
          isLiked,
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
    onError: (error, { contentId }) => {
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
          ...prev[contentId] || { isBookmarked: false, isBookmarkLoading: false },
          isLiked: prevState,
          isLikeLoading: false
        }
      }));
    }
  });

  // Handle bookmark interaction with optimistic updates
  const bookmarkMutation = useMutation({
    mutationFn: async ({ contentId }: { contentId: string }) => {
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
        const { data, error } = await supabase
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
        const insertData: Record<string, any> = {
          user_id: userId
        };
        
        // Set the correct content id field based on content type
        insertData[contentIdField] = contentId;
        
        // Add content_type field if not a quote
        if (contentType !== 'quote') {
          insertData['content_type'] = contentType;
        }
        
        const { data, error } = await supabase
          .from(tableName)
          .insert(insertData);
          
        if (error) throw error;
        
        // Increment bookmarks counter if available
        if (contentType === 'quote') {
          await incrementCounter(contentId, 'bookmarks', counterTableName);
        }
        
        return { contentId, isBookmarked: true };
      }
    },
    onMutate: ({ contentId }) => {
      // Optimistically update the UI
      const currentState = interactionState[contentId]?.isBookmarked || false;
      
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...prev[contentId] || { isLiked: false, isLikeLoading: false },
          isBookmarked: !currentState,
          isBookmarkLoading: true
        }
      }));
    },
    onSuccess: ({ contentId, isBookmarked }) => {
      // Update with server result
      setInteractionState(prev => ({
        ...prev,
        [contentId]: {
          ...prev[contentId] || { isLiked: false, isLikeLoading: false },
          isBookmarked,
          isBookmarkLoading: false
        }
      }));
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [`${contentType}s`, 'bookmarked'] 
      });
    },
    onError: (error, { contentId }) => {
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
          ...prev[contentId] || { isLiked: false, isLikeLoading: false },
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
