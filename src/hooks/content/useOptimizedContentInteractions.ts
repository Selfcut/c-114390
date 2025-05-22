
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getContentTable, getContentColumnName } from '@/lib/utils/interactions/content-type-utils';

// Simple interface for content items' interaction state
interface ContentInteractionState {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  loadingLikes: Record<string, boolean>;
  loadingBookmarks: Record<string, boolean>;
}

// Input props type
interface UseOptimizedContentInteractionsProps {
  userId: string | null;
  contentType: string;
}

/**
 * A simplified hook for handling optimized content interactions (likes and bookmarks)
 * with improved type safety to prevent deep type instantiation issues
 */
export const useOptimizedContentInteractions = ({ 
  userId, 
  contentType 
}: UseOptimizedContentInteractionsProps) => {
  // Simplified state structure to avoid deep nesting
  const [state, setState] = useState<ContentInteractionState>({
    likes: {},
    bookmarks: {},
    loadingLikes: {},
    loadingBookmarks: {}
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get content interaction state (simplified)
  const getStateForContent = useCallback((contentId: string) => {
    return {
      isLiked: !!state.likes[contentId],
      isBookmarked: !!state.bookmarks[contentId],
      isLikeLoading: !!state.loadingLikes[contentId],
      isBookmarkLoading: !!state.loadingBookmarks[contentId]
    };
  }, [state]);

  // Check user's interactions with content
  const checkInteractions = useCallback(async (contentId: string) => {
    if (!userId || !contentId) return;
    
    try {
      // Check likes
      const { data: likeData } = await supabase
        .from(contentType === 'quote' ? 'quote_likes' : 'content_likes')
        .select('id')
        .eq(contentType === 'quote' ? 'quote_id' : 'content_id', contentId)
        .eq('user_id', userId);
        
      // Check bookmarks
      const { data: bookmarkData } = await supabase
        .from(contentType === 'quote' ? 'quote_bookmarks' : 'content_bookmarks')
        .select('id')
        .eq(contentType === 'quote' ? 'quote_id' : 'content_id', contentId)
        .eq('user_id', userId);
      
      // Update state directly with explicit spread syntax
      setState(currentState => ({
        ...currentState,
        likes: { 
          ...currentState.likes, 
          [contentId]: likeData && likeData.length > 0 
        },
        bookmarks: { 
          ...currentState.bookmarks, 
          [contentId]: bookmarkData && bookmarkData.length > 0 
        }
      }));
    } catch (error) {
      console.error('Error checking content interactions:', error);
    }
  }, [userId, contentType]);

  // Function to safely update counter
  const updateCounter = useCallback(async (
    contentId: string, 
    columnName: string, 
    tableName: string, 
    increment: boolean
  ): Promise<boolean> => {
    try {
      const funcName = increment ? 'increment_counter_fn' : 'decrement_counter_fn';
      const { error } = await supabase.rpc(funcName, {
        row_id: contentId,
        column_name: columnName,
        table_name: tableName
      });
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error ${increment ? 'incrementing' : 'decrementing'} counter:`, err);
      return false;
    }
  }, []);

  // Handle like/unlike
  const handleLike = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "default"
      });
      return;
    }

    // Get current state
    const isLiked = !!state.likes[contentId];
    
    // Set loading state
    setState(curr => ({
      ...curr,
      loadingLikes: { ...curr.loadingLikes, [contentId]: true }
    }));
    
    try {
      // Optimistic update
      setState(curr => ({
        ...curr,
        likes: { ...curr.likes, [contentId]: !isLiked }
      }));
      
      // Get table and column names
      const isQuote = contentType === 'quote';
      const tableName = isQuote ? 'quote_likes' : 'content_likes';
      const contentIdField = isQuote ? 'quote_id' : 'content_id';
      const counterTableName = isQuote ? 'quotes' : contentType;
      const likeColumnName = isQuote || contentType === 'wiki' ? 'likes' : 'upvotes';
      
      let success = false;
      
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(contentIdField, contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        // Decrement counter
        await updateCounter(contentId, likeColumnName, counterTableName, false);
        success = true;
      } else {
        // Add like
        if (isQuote) {
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
        await updateCounter(contentId, likeColumnName, counterTableName, true);
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
      
      // Revert on error - use direct state update to avoid nesting
      setState(curr => ({
        ...curr,
        likes: { ...curr.likes, [contentId]: isLiked }
      }));
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      // Clear loading state - use direct state update to avoid nesting
      setState(curr => ({
        ...curr,
        loadingLikes: { ...curr.loadingLikes, [contentId]: false }
      }));
    }
  }, [userId, state.likes, contentType, queryClient, toast, updateCounter]);

  // Handle bookmark/unbookmark
  const handleBookmark = useCallback(async (contentId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "default"
      });
      return;
    }

    // Get current state
    const isBookmarked = !!state.bookmarks[contentId];
    
    // Set loading state
    setState(curr => ({
      ...curr,
      loadingBookmarks: { ...curr.loadingBookmarks, [contentId]: true }
    }));
    
    try {
      // Optimistic update
      setState(curr => ({
        ...curr,
        bookmarks: { ...curr.bookmarks, [contentId]: !isBookmarked }
      }));
      
      // Determine table names
      const isQuote = contentType === 'quote';
      const tableName = isQuote ? 'quote_bookmarks' : 'content_bookmarks';
      const contentIdField = isQuote ? 'quote_id' : 'content_id';
      const counterTableName = isQuote ? 'quotes' : contentType;
      
      let success = false;
      
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(contentIdField, contentId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        // Decrement bookmarks counter if it's a quote
        if (isQuote) {
          await updateCounter(contentId, 'bookmarks', counterTableName, false);
        }
        
        success = true;
      } else {
        // Add bookmark
        if (isQuote) {
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
        if (isQuote) {
          await updateCounter(contentId, 'bookmarks', counterTableName, true);
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
      
      // Revert on error - use direct state update
      setState(curr => ({
        ...curr,
        bookmarks: { ...curr.bookmarks, [contentId]: isBookmarked }
      }));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    } finally {
      // Clear loading state - use direct state update
      setState(curr => ({
        ...curr,
        loadingBookmarks: { ...curr.loadingBookmarks, [contentId]: false }
      }));
    }
  }, [userId, state.bookmarks, contentType, queryClient, toast, updateCounter]);

  return {
    interactionState: state,
    checkInteractions,
    handleLike,
    handleBookmark,
    getStateForContent
  };
};
