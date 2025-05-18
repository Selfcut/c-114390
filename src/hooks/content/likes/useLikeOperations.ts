
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { ContentTypeOptions } from '../useContentTables';
import { LikesHookResult } from './types';

export const useLikeOperations = (options: ContentTypeOptions): LikesHookResult => {
  const { contentType } = options;
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has liked the content
  const checkUserLike = async (contentId: string): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('content_likes')
        .select('*')
        .eq('content_id', contentId)
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .maybeSingle();
        
      if (!error) {
        setIsLiked(!!data);
        return !!data;
      }
    } catch (err) {
      console.error('Error checking like status:', err);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Get content likes count
  const fetchLikesCount = async (contentId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { count, error } = await supabase
        .from('content_likes')
        .select('*', { count: 'exact' })
        .eq('content_id', contentId)
        .eq('content_type', contentType);
        
      if (!error) {
        setLikesCount(count || 0);
      }
    } catch (err) {
      console.error('Error fetching likes count:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle like status
  const toggleLikeMutation = useMutation({
    mutationFn: async (contentId: string) => {
      if (!user) {
        throw new Error('User must be logged in to like content');
      }
      
      try {
        setIsLoading(true);
        if (isLiked) {
          // Unlike
          const { error } = await supabase
            .from('content_likes')
            .delete()
            .eq('content_id', contentId)
            .eq('user_id', user.id)
            .eq('content_type', contentType);
            
          if (error) throw error;
          
          // Update local state
          setIsLiked(false);
          setLikesCount(prev => Math.max(0, prev - 1));
          
          return { liked: false, contentId };
        } else {
          // Like
          const { error } = await supabase
            .from('content_likes')
            .insert({
              content_id: contentId,
              user_id: user.id,
              content_type: contentType
            });
            
          if (error) throw error;
          
          // Update local state
          setIsLiked(true);
          setLikesCount(prev => prev + 1);
          
          return { liked: true, contentId };
        }
      } catch (err) {
        console.error('Error toggling like:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update like status',
        variant: 'destructive'
      });
    }
  });

  // Fixed toggleLike function to properly return Promise<void>
  const toggleLike = async (contentId: string): Promise<void> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like content',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Execute the mutation and explicitly discard the result
      await toggleLikeMutation.mutateAsync(contentId);
      // No explicit return here makes it return void
    } catch (error) {
      console.error('Error in toggleLike:', error);
    }
  };

  return {
    isLiked,
    likesCount,
    toggleLike,
    checkUserLike,
    fetchLikesCount,
    isLoading: isLoading || toggleLikeMutation.isPending
  };
};
