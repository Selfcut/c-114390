
import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseMutation } from '@/hooks/api/useSupabaseQuery';

export interface InteractionOptions {
  contentType: 'media' | 'forum' | 'wiki' | 'quote';
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

interface TableNames {
  likesTable: 'media_likes' | 'content_likes' | 'quote_likes';
  commentsTable: 'media_comments' | 'content_comments' | 'quote_comments';
  contentTable: 'media_posts' | 'forum_posts' | 'wiki_articles' | 'quotes';
  contentIdField: 'post_id' | 'content_id' | 'quote_id';
}

export function useContentInteraction(options: InteractionOptions) {
  const { contentType, onSuccess, onError } = options;
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate } = useSupabaseMutation();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  // Helper to get the right table names based on content type
  const getTableNames = useCallback((): TableNames => {
    switch (contentType) {
      case 'media':
        return {
          likesTable: 'media_likes',
          commentsTable: 'media_comments',
          contentTable: 'media_posts',
          contentIdField: 'post_id',
        };
      case 'forum':
        return {
          likesTable: 'content_likes',
          commentsTable: 'content_comments',
          contentTable: 'forum_posts',
          contentIdField: 'content_id',
        };
      case 'wiki':
        return {
          likesTable: 'content_likes',
          commentsTable: 'content_comments',
          contentTable: 'wiki_articles',
          contentIdField: 'content_id',
        };
      case 'quote':
        return {
          likesTable: 'quote_likes',
          commentsTable: 'quote_comments',
          contentTable: 'quotes',
          contentIdField: 'quote_id',
        };
      default:
        return {
          likesTable: 'content_likes',
          commentsTable: 'content_comments',
          contentTable: 'forum_posts',
          contentIdField: 'content_id',
        };
    }
  }, [contentType]);

  // Like/unlike content
  const toggleLike = useCallback(async (contentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive",
      });
      return;
    }

    // Avoid duplicate requests
    const operationKey = `like_${contentId}`;
    if (isProcessing[operationKey]) return;
    
    setIsProcessing(prev => ({ ...prev, [operationKey]: true }));
    
    try {
      const { likesTable, contentTable, contentIdField } = getTableNames();
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from(likesTable)
        .select()
        .eq('user_id', user.id)
        .eq(contentIdField, contentId)
        .single();
      
      if (existingLike) {
        // Unlike
        await mutate(
          async () => {
            const result = await supabase
              .from(likesTable)
              .delete()
              .eq('user_id', user.id)
              .eq(contentIdField, contentId);
            return result;
          },
          {},
          { 
            onSuccess: () => {
              // Decrement likes count
              supabase.rpc('decrement_counter_fn', {
                row_id: contentId,
                column_name: 'likes',
                table_name: contentTable
              });
              if (onSuccess) onSuccess();
            },
            onError
          }
        );
      } else {
        // Like
        const insertPayload: Record<string, any> = {
          user_id: user.id
        };
        insertPayload[contentIdField] = contentId;
        
        // Add content_type if needed
        if (contentIdField === 'content_id') {
          insertPayload.content_type = contentType;
        }
        
        await mutate(
          async () => {
            const result = await supabase
              .from(likesTable)
              .insert(insertPayload);
            return result;  
          },
          {},
          { 
            onSuccess: () => {
              // Increment likes count
              supabase.rpc('increment_counter_fn', {
                row_id: contentId,
                column_name: 'likes',
                table_name: contentTable
              });
              if (onSuccess) onSuccess();
            },
            onError
          }
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      if (onError) onError(error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [operationKey]: false }));
    }
  }, [user, toast, mutate, getTableNames, isProcessing, onSuccess, onError]);

  // Add a comment
  const addComment = useCallback(async (contentId: string, comment: string) => {
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
      
      const insertPayload: Record<string, any> = {
        user_id: user.id,
        comment: comment.trim()
      };
      
      insertPayload[contentIdField] = contentId;
      
      // Add content_type and content if needed
      if (contentIdField === 'content_id') {
        insertPayload.content_type = contentType;
        insertPayload.content = comment.trim();
      }
      
      if (contentIdField === 'post_id') {
        insertPayload.content = comment.trim();
      }
      
      await mutate(
        async () => {
          const result = await supabase
            .from(commentsTable)
            .insert(insertPayload);
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
  }, [user, toast, mutate, getTableNames, isProcessing, onSuccess, onError, contentType]);

  // Check if user has liked content
  const checkUserLike = useCallback(async (contentId: string): Promise<boolean> => {
    if (!user) return false;
    
    const { likesTable, contentIdField } = getTableNames();
    
    const { data } = await supabase
      .from(likesTable)
      .select()
      .eq('user_id', user.id)
      .eq(contentIdField, contentId)
      .maybeSingle();
      
    return !!data;
  }, [user, getTableNames]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string, contentId: string) => {
    if (!user) return;
    
    const operationKey = `delete_comment_${commentId}`;
    if (isProcessing[operationKey]) return;
    
    setIsProcessing(prev => ({ ...prev, [operationKey]: true }));
    
    try {
      const { commentsTable, contentTable } = getTableNames();
      
      await mutate(
        async () => {
          const result = await supabase
            .from(commentsTable)
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
  }, [user, mutate, getTableNames, isProcessing, onSuccess, onError]);

  return {
    toggleLike,
    addComment,
    checkUserLike,
    deleteComment,
    isProcessing,
    isAuthenticated: !!user
  };
}
