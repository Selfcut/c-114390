
import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseMutation } from '@/hooks/api/useSupabaseQuery';
import { useContentTables, ContentTypeOptions } from '../useContentTables';
import { createLikePayload, incrementLikeCounter, decrementLikeCounter } from './likeUtils';
import { LikesHookResult } from './types';

export const useLikeOperations = (options: ContentTypeOptions): LikesHookResult => {
  const { contentType } = options;
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate } = useSupabaseMutation();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const { getTableNames } = useContentTables({ contentType });

  // Check if user has liked content
  const checkUserLike = useCallback(async (contentId: string): Promise<boolean> => {
    if (!user) return false;
    
    const { likesTable, contentIdField } = getTableNames();
    
    const { data } = await supabase
      .from(likesTable as any)
      .select()
      .eq('user_id', user.id)
      .eq(contentIdField, contentId)
      .maybeSingle();
      
    return !!data;
  }, [user, getTableNames]);

  // Like/unlike content
  const toggleLike = useCallback(async (contentId: string, onSuccess?: () => void, onError?: (error: any) => void) => {
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
      const { data: existingLike, error: fetchError } = await supabase
        .from(likesTable as any)
        .select()
        .eq('user_id', user.id)
        .eq(contentIdField, contentId)
        .maybeSingle();
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (existingLike) {
        // Unlike
        await mutate(
          async () => {
            const result = await supabase
              .from(likesTable as any)
              .delete()
              .eq('user_id', user.id)
              .eq(contentIdField, contentId);
            return result;
          },
          {},
          { 
            onSuccess: async () => {
              await decrementLikeCounter(contentId, contentTable);
              if (onSuccess) onSuccess();
            },
            onError
          }
        );
      } else {
        // Like
        const payload = createLikePayload(contentType, user.id, contentId);
        
        await mutate(
          async () => {
            const result = await supabase
              .from(likesTable as any)
              .insert(payload);
            return result;  
          },
          {},
          { 
            onSuccess: async () => {
              await incrementLikeCounter(contentId, contentTable);
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
  }, [user, toast, mutate, getTableNames, isProcessing, contentType]);

  return {
    toggleLike,
    checkUserLike,
    isProcessing,
    isAuthenticated: !!user
  };
};
