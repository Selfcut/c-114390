
import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseMutation } from '@/hooks/api/useSupabaseQuery';
import { useContentTables, ContentTypeOptions } from './useContentTables';
import { MediaCommentPayload, ContentCommentPayload, QuoteCommentPayload } from './types';

export const useContentComments = (options: ContentTypeOptions) => {
  const { contentType } = options;
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate } = useSupabaseMutation();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const { getTableNames } = useContentTables({ contentType });

  // Add a comment
  const addComment = useCallback(async (contentId: string, comment: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    const operationKey = `comment_${contentId}`;
    if (isProcessing[operationKey]) return;
    
    setIsProcessing(prev => ({ ...prev, [operationKey]: true }));
    
    try {
      const { commentsTable, contentTable, contentIdField } = getTableNames();
      
      // Create the right payload type based on the table
      let payload;
      
      if (commentsTable === 'media_comments') {
        payload = {
          user_id: user.id,
          post_id: contentId,
          content: comment.trim()
        } as MediaCommentPayload;
      } else if (commentsTable === 'quote_comments') {
        payload = {
          user_id: user.id,
          quote_id: contentId,
          content: comment.trim()
        } as QuoteCommentPayload;
      } else {
        // content_comments table
        payload = {
          user_id: user.id,
          content_id: contentId,
          content_type: contentType,
          comment: comment.trim(),
          content: comment.trim()
        } as ContentCommentPayload;
      }
      
      await mutate(
        async () => {
          const result = await supabase
            .from(commentsTable as any)
            .insert(payload);
          return result;
        },
        {},
        { 
          onSuccess: () => {
            // Increment comment count
            supabase.rpc('increment_counter_fn', {
              row_id: contentId,
              column_name: 'comments',
              table_name: contentTable
            });
            if (onSuccess) onSuccess();
          },
          onError,
          successMessage: {
            title: "Comment added"
          }
        }
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      if (onError) onError(error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [operationKey]: false }));
    }
  }, [user, toast, mutate, getTableNames, isProcessing, contentType]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string, contentId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
    if (!user) return;
    
    const operationKey = `delete_comment_${commentId}`;
    if (isProcessing[operationKey]) return;
    
    setIsProcessing(prev => ({ ...prev, [operationKey]: true }));
    
    try {
      const { commentsTable, contentTable } = getTableNames();
      
      await mutate(
        async () => {
          const result = await supabase
            .from(commentsTable as any)
            .delete()
            .eq('id', commentId)
            .eq('user_id', user.id);
          return result;
        },
        {},
        { 
          onSuccess: () => {
            // Decrement comment count
            supabase.rpc('decrement_counter_fn', {
              row_id: contentId,
              column_name: 'comments',
              table_name: contentTable
            });
            if (onSuccess) onSuccess();
          },
          onError,
          successMessage: {
            title: "Comment deleted"
          }
        }
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (onError) onError(error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [operationKey]: false }));
    }
  }, [user, mutate, getTableNames, isProcessing]);

  return {
    addComment,
    deleteComment,
    isProcessing,
    isAuthenticated: !!user
  };
};
