
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

  // Check if user has liked the content
  const checkUserLike = async (contentId: string) => {
    if (!user) return;
    
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
      }
    } catch (err) {
      console.error('Error checking like status:', err);
    }
  };

  // Get content likes count
  const fetchLikesCount = async (contentId: string) => {
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
    }
  };

  // Toggle like status
  const toggleLikeMutation = useMutation({
    mutationFn: async ({ contentId }: { contentId: string }) => {
      if (!user) {
        throw new Error('User must be logged in to like content');
      }
      
      try {
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

  const toggleLike = (contentId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like content',
        variant: 'destructive'
      });
      return;
    }
    
    toggleLikeMutation.mutate({ contentId });
  };

  return {
    isLiked,
    likesCount,
    toggleLike,
    checkUserLike,
    fetchLikesCount,
    isLoading: toggleLikeMutation.isPending
  };
};
