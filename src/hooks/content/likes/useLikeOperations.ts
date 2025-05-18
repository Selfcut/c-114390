
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
      // Use a raw query approach instead of typed to avoid type errors
      const query = `
        SELECT id FROM "${tables.likesTable}"
        WHERE content_id = '${contentId}'
        AND user_id = '${user.id}'
        AND content_type = '${options.contentType}'
        LIMIT 1
      `;
      
      const { data, error } = await supabase.rpc('execute_sql', { sql_query: query });
        
      if (error) {
        console.error('Error checking like status:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Exception in checkUserLike:', error);
      return false;
    }
  }, [user?.id, tables.likesTable, options.contentType]);

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
        // Remove the like using raw SQL approach
        const deleteQuery = `
          DELETE FROM "${tables.likesTable}"
          WHERE content_id = '${contentId}'
          AND user_id = '${user.id}'
          AND content_type = '${options.contentType}'
        `;
        
        const { error: deleteError } = await supabase.rpc('execute_sql', { sql_query: deleteQuery });
          
        if (deleteError) throw deleteError;
        
        // Update the likes count in the content table using RPC function
        const { error: updateError } = await supabase
          .rpc('decrement_counter', {
            row_id: contentId,
            column_name: 'likes',
            table_name: tables.contentTable
          });
          
        if (updateError) console.error('Error decrementing likes count:', updateError);
        
        return false;
      } else {
        // Add the like using raw SQL approach
        const insertQuery = `
          INSERT INTO "${tables.likesTable}" (content_id, user_id, content_type)
          VALUES ('${contentId}', '${user.id}', '${options.contentType}')
        `;
        
        const { error: insertError } = await supabase.rpc('execute_sql', { sql_query: insertQuery });
          
        if (insertError) throw insertError;
        
        // Update the likes count in the content table using RPC function
        const { error: updateError } = await supabase
          .rpc('increment_counter', {
            row_id: contentId,
            column_name: 'likes',
            table_name: tables.contentTable
          });
          
        if (updateError) console.error('Error incrementing likes count:', updateError);
        
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error(`Failed to update like: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, checkUserLike, tables, options.contentType]);

  return {
    isLoading,
    checkUserLike,
    toggleLike
  };
};
