
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { checkUserContentInteractions } from '@/lib/utils/supabase-utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Simplified types
interface ContentState {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  loading: Record<string, {
    like: boolean;
    bookmark: boolean;
  }>;
}

// Props type with explicit types
interface UseOptimizedContentInteractionsProps {
  userId: string | null;
  contentType: string;
}

// Main hook implementation with simplified state management
export const useOptimizedContentInteractions = ({ 
  userId, 
  contentType 
}: UseOptimizedContentInteractionsProps) => {
  // Unified state object to simplify management
  const [state, setState] = useState<ContentState>({
    likes: {},
    bookmarks: {},
    loading: {}
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get state for a specific content item
  const getStateForContent = useCallback((contentId: string) => {
    return {
      isLiked: !!state.likes[contentId],
      isBookmarked: !!state.bookmarks[contentId],
      isLikeLoading: !!state.loading[contentId]?.like,
      isBookmarkLoading: !!state.loading[contentId]?.bookmark
    };
  }, [state]);

  // Set loading state
  const setLoadingState = useCallback((contentId: string, type: 'like' | 'bookmark', isLoading: boolean) => {
    setState(prev => {
      const currentLoadingState = prev.loading[contentId] || { like: false, bookmark: false };
      return {
        ...prev,
        loading: {
          ...prev.loading,
          [contentId]: {
            ...currentLoadingState,
            [type]: isLoading
          }
        }
      };
    });
  }, []);

  // Check interactions
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;

    try {
      const result = await checkUserContentInteractions(userId, contentId, contentType);
      
      // Update state directly
      setState(prev => ({
        ...prev,
        likes: { ...prev.likes, [contentId]: result.hasLiked },
        bookmarks: { ...prev.bookmarks, [contentId]: result.hasBookmarked }
      }));
    } catch (error) {
      console.error('Error checking content interactions:', error);
    }
  }, [userId, contentType]);

  // Handle like action with simplified state updates
  const handleLike = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "default"
      });
      return;
    }

    const isCurrentlyLiked = state.likes[contentId] || false;
    setLoadingState(contentId, 'like', true);
    
    try {
      // Optimistic update
      setState(prev => ({
        ...prev,
        likes: { ...prev.likes, [contentId]: !isCurrentlyLiked }
      }));
      
      // Determine table names
      const tableName = contentType === 'quote' ? 'quote_likes' : 'content_likes';
      const contentIdField = contentType === 'quote' ? 'quote_id' : 'content_id';
      const counterTableName = contentType === 'quote' ? 'quotes' : contentType;
      
      let success = false;
      
      if (isCurrentlyLiked) {
        // Remove like
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(contentIdField, contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        // Decrement counter
        await decrementCounter(contentId, 'likes', counterTableName);
        success = true;
      } else {
        // Add like
        if (contentType === 'quote') {
          const { error } = await supabase
            .from('quote_likes')
            .insert({
              quote_id: contentId,
              user_id: userId
            });
            
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('content_likes')
            .insert({
              content_id: contentId,
              content_type: contentType,
              user_id: userId
            });
            
          if (error) throw error;
        }
        
        // Increment counter
        await incrementCounter(contentId, 'likes', counterTableName);
        success = true;
      }
      
      // Invalidate queries if successful
      if (success) {
        queryClient.invalidateQueries({ 
          queryKey: [`${contentType}s`]
        });
        queryClient.invalidateQueries({ 
          queryKey: [`${contentType}`, contentId]
        });
      }
      
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert on error
      setState(prev => ({
        ...prev,
        likes: { ...prev.likes, [contentId]: isCurrentlyLiked }
      }));
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setLoadingState(contentId, 'like', false);
    }
  }, [userId, state.likes, contentType, queryClient, toast, setLoadingState]);

  // Handle bookmark action with simplified state updates
  const handleBookmark = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "default"
      });
      return;
    }

    const isCurrentlyBookmarked = state.bookmarks[contentId] || false;
    setLoadingState(contentId, 'bookmark', true);
    
    try {
      // Optimistic update
      setState(prev => ({
        ...prev,
        bookmarks: { ...prev.bookmarks, [contentId]: !isCurrentlyBookmarked }
      }));
      
      // Determine table names
      const tableName = contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks';
      const contentIdField = contentType === 'quote' ? 'quote_id' : 'content_id';
      
      let success = false;
      
      if (isCurrentlyBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(contentIdField, contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        // Decrement bookmarks counter if it's a quote
        if (contentType === 'quote') {
          await decrementCounter(contentId, 'bookmarks', 'quotes');
        }
        
        success = true;
      } else {
        // Add bookmark
        if (contentType === 'quote') {
          const { error } = await supabase
            .from('quote_bookmarks')
            .insert({
              quote_id: contentId,
              user_id: userId
            });
            
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('content_bookmarks')
            .insert({
              content_id: contentId,
              content_type: contentType,
              user_id: userId
            });
            
          if (error) throw error;
        }
        
        // Increment bookmarks counter if it's a quote
        if (contentType === 'quote') {
          await incrementCounter(contentId, 'bookmarks', 'quotes');
        }
        
        success = true;
      }
      
      // Invalidate queries if successful
      if (success) {
        queryClient.invalidateQueries({ 
          queryKey: [`${contentType}s`, 'bookmarked']
        });
      }
      
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      
      // Revert on error
      setState(prev => ({
        ...prev,
        bookmarks: { ...prev.bookmarks, [contentId]: isCurrentlyBookmarked }
      }));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    } finally {
      setLoadingState(contentId, 'bookmark', false);
    }
  }, [userId, state.bookmarks, contentType, queryClient, toast, setLoadingState]);

  // Helper functions for counter operations
  async function incrementCounter(contentId: string, columnName: string, tableName: string): Promise<void> {
    try {
      await supabase.rpc('increment_counter_fn', {
        row_id: contentId,
        column_name: columnName,
        table_name: tableName
      });
    } catch (error) {
      console.error(`Error incrementing ${columnName} counter:`, error);
    }
  }

  async function decrementCounter(contentId: string, columnName: string, tableName: string): Promise<void> {
    try {
      await supabase.rpc('decrement_counter_fn', {
        row_id: contentId,
        column_name: columnName,
        table_name: tableName
      });
    } catch (error) {
      console.error(`Error decrementing ${columnName} counter:`, error);
    }
  }

  return {
    interactionState: state,
    checkInteractions,
    handleLike,
    handleBookmark,
    getStateForContent
  };
};
