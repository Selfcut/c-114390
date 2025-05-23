
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useContentTables, ContentTypeOptions } from './useContentTables';
import { LikesHookResult } from './likes/types';

/**
 * Hook for managing content likes with proper loading states and error handling
 */
export const useContentLikes = (options: ContentTypeOptions): LikesHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { getTableNames } = useContentTables(options);
  const { toast } = useToast();
  const tables = getTableNames();

  /**
   * Check if a user has liked specific content
   */
  const checkUserLike = useCallback(async (contentId: string): Promise<boolean> => {
    if (!user?.id || !contentId) return false;
    
    try {
      // Select the appropriate table based on content type
      let query;
      
      if (options.contentType === 'media') {
        const { data, error } = await supabase
          .from('media_likes')
          .select('id')
          .eq('post_id', contentId)
          .eq('user_id', user.id)
          .limit(1);
          
        if (error) throw error;
        return data && data.length > 0;
      } else if (options.contentType === 'quote') {
        const { data, error } = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', contentId)
          .eq('user_id', user.id)
          .limit(1);
          
        if (error) throw error;
        return data && data.length > 0;
      } else {
        const { data, error } = await supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .eq('content_type', options.contentType)
          .limit(1);
          
        if (error) throw error;
        return data && data.length > 0;
      }
    } catch (error) {
      console.error(`Error checking like status for ${options.contentType}:`, error);
      return false;
    }
  }, [user?.id, options.contentType]);
  
  /**
   * Toggle like status on content
   */
  const toggleLike = useCallback(async (contentId: string): Promise<boolean | void> => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check current like status
      const isCurrentlyLiked = await checkUserLike(contentId);
      
      if (isCurrentlyLiked) {
        // Unlike logic
        if (options.contentType === 'media') {
          const { error } = await supabase
            .from('media_likes')
            .delete()
            .eq('post_id', contentId)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          // Decrement likes count in media_posts
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'likes',
            table_name: 'media_posts'
          });
        } else if (options.contentType === 'quote') {
          const { error } = await supabase
            .from('quote_likes')
            .delete()
            .eq('quote_id', contentId)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          // Decrement likes count in quotes table
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'likes',
            table_name: 'quotes'
          });
        } else {
          const { error } = await supabase
            .from('content_likes')
            .delete()
            .eq('content_id', contentId)
            .eq('user_id', user.id)
            .eq('content_type', options.contentType);
            
          if (error) throw error;
          
          // Get the correct counter field based on content type
          const counterField = options.contentType === 'forum' ? 'upvotes' : 'likes';
          
          // Decrement likes count in the appropriate table
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: counterField,
            table_name: tables.contentTable
          });
        }
        
        toast({
          description: "Like removed",
        });
        
        return false;
      } else {
        // Like logic
        if (options.contentType === 'media') {
          const { error } = await supabase
            .from('media_likes')
            .insert({
              user_id: user.id,
              post_id: contentId
            });
            
          if (error) throw error;
          
          // Increment likes count in media_posts
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'likes',
            table_name: 'media_posts'
          });
        } else if (options.contentType === 'quote') {
          const { error } = await supabase
            .from('quote_likes')
            .insert({
              user_id: user.id,
              quote_id: contentId
            });
            
          if (error) throw error;
          
          // Increment likes count in quotes table
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'likes',
            table_name: 'quotes'
          });
        } else {
          const { error } = await supabase
            .from('content_likes')
            .insert({
              user_id: user.id,
              content_id: contentId,
              content_type: options.contentType
            });
            
          if (error) throw error;
          
          // Get the correct counter field based on content type
          const counterField = options.contentType === 'forum' ? 'upvotes' : 'likes';
          
          // Increment likes count in the appropriate table
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: counterField,
            table_name: tables.contentTable
          });
        }
        
        toast({
          description: "Content liked",
        });
        
        return true;
      }
    } catch (error) {
      console.error(`Error toggling like for ${options.contentType}:`, error);
      toast({
        title: "Action failed",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, options.contentType, tables, checkUserLike, toast]);

  return {
    isLoading,
    checkUserLike,
    toggleLike
  };
};
