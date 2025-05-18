
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useContentTables } from '../useContentTables';
import { LikesHookResult } from './types';
import { ContentTypeOptions } from '../useContentTables';

export const useLikeOperations = (options: ContentTypeOptions): LikesHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { getTableNames } = useContentTables(options);
  const tables = getTableNames();
  
  // Check if a user has liked content
  const checkUserLike = useCallback(async (contentId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Use the appropriate table based on content type
      let query;
      
      switch (options.contentType) {
        case 'media':
          const { data: mediaData, error: mediaError } = await supabase
            .from('media_likes')
            .select('id')
            .eq('post_id', contentId)
            .eq('user_id', user.id)
            .limit(1);
            
          if (mediaError) throw mediaError;
          return mediaData && mediaData.length > 0;
          
        case 'quote':
          const { data: quoteData, error: quoteError } = await supabase
            .from('quote_likes')
            .select('id')
            .eq('quote_id', contentId)
            .eq('user_id', user.id)
            .limit(1);
            
          if (quoteError) throw quoteError;
          return quoteData && quoteData.length > 0;
          
        case 'knowledge':
        case 'wiki':
        case 'research':
        default:
          const { data: contentData, error: contentError } = await supabase
            .from('content_likes')
            .select('id')
            .eq('content_id', contentId)
            .eq('user_id', user.id)
            .eq('content_type', options.contentType)
            .limit(1);
            
          if (contentError) throw contentError;
          return contentData && contentData.length > 0;
      }
    } catch (error) {
      console.error('Exception in checkUserLike:', error);
      return false;
    }
  }, [user?.id, options.contentType]);

  // Toggle like status on content
  const toggleLike = useCallback(async (contentId: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You need to be signed in to like content');
      return false;
    }

    setIsLoading(true);
    
    try {
      // Check if the user already liked the content
      const hasLiked = await checkUserLike(contentId);
      
      if (hasLiked) {
        // Remove the like based on content type
        switch (options.contentType) {
          case 'media':
            const { error: mediaDeleteError } = await supabase
              .from('media_likes')
              .delete()
              .eq('post_id', contentId)
              .eq('user_id', user.id);
              
            if (mediaDeleteError) throw mediaDeleteError;
            
            // Update the likes count
            await supabase.rpc('decrement_counter', {
              row_id: contentId,
              column_name: 'likes',
              table_name: 'media_posts'
            });
            break;
            
          case 'quote':
            const { error: quoteDeleteError } = await supabase
              .from('quote_likes')
              .delete()
              .eq('quote_id', contentId)
              .eq('user_id', user.id);
              
            if (quoteDeleteError) throw quoteDeleteError;
            
            // Update the likes count
            await supabase.rpc('decrement_counter', {
              row_id: contentId,
              column_name: 'likes',
              table_name: 'quotes'
            });
            break;
            
          case 'knowledge':
          case 'wiki':
          case 'research':
          default:
            const { error: contentDeleteError } = await supabase
              .from('content_likes')
              .delete()
              .eq('content_id', contentId)
              .eq('user_id', user.id)
              .eq('content_type', options.contentType);
              
            if (contentDeleteError) throw contentDeleteError;
            
            // Get the right table name for the content type
            const tableName = options.contentType === 'research' ? 'research_papers' :
                              options.contentType === 'knowledge' ? 'knowledge_entries' :
                              options.contentType === 'wiki' ? 'wiki_articles' : 
                              `${options.contentType}s`;
            
            // Update the likes count
            await supabase.rpc('decrement_counter', {
              row_id: contentId,
              column_name: 'likes',
              table_name: tableName
            });
        }
        
        return false;
      } else {
        // Add the like based on content type
        switch (options.contentType) {
          case 'media':
            const { error: mediaInsertError } = await supabase
              .from('media_likes')
              .insert({
                post_id: contentId,
                user_id: user.id
              });
              
            if (mediaInsertError) throw mediaInsertError;
            
            // Update the likes count
            await supabase.rpc('increment_counter', {
              row_id: contentId,
              column_name: 'likes',
              table_name: 'media_posts'
            });
            break;
            
          case 'quote':
            const { error: quoteInsertError } = await supabase
              .from('quote_likes')
              .insert({
                quote_id: contentId,
                user_id: user.id
              });
              
            if (quoteInsertError) throw quoteInsertError;
            
            // Update the likes count
            await supabase.rpc('increment_counter', {
              row_id: contentId,
              column_name: 'likes',
              table_name: 'quotes'
            });
            break;
            
          case 'knowledge':
          case 'wiki':
          case 'research':
          default:
            const { error: contentInsertError } = await supabase
              .from('content_likes')
              .insert({
                content_id: contentId,
                user_id: user.id,
                content_type: options.contentType
              });
              
            if (contentInsertError) throw contentInsertError;
            
            // Get the right table name for the content type
            const tableName = options.contentType === 'research' ? 'research_papers' :
                              options.contentType === 'knowledge' ? 'knowledge_entries' :
                              options.contentType === 'wiki' ? 'wiki_articles' : 
                              `${options.contentType}s`;
            
            // Update the likes count
            await supabase.rpc('increment_counter', {
              row_id: contentId,
              column_name: 'likes',
              table_name: tableName
            });
        }
        
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error(`Failed to update like: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, checkUserLike, options.contentType]);

  return {
    isLoading,
    checkUserLike,
    toggleLike
  };
};
