
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentInteractionResult, ContentLoadingState } from './types';
import { getContentTypeString, getContentTypeInfo, getContentKey } from './contentTypeUtils';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { PostgrestError } from '@supabase/supabase-js';

export const useLikeInteractions = (
  userId?: string | null, 
  userLikes: Record<string, boolean> = {},
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  loadingStates: Record<string, ContentLoadingState> = {},
  setLoadingStates: React.Dispatch<React.SetStateAction<Record<string, ContentLoadingState>>> = () => {}
) => {
  const { toast } = useToast();
  
  const setLikeLoadingState = useCallback((id: string, contentType: string | ContentItemType, isLoading: boolean) => {
    const contentTypeStr = typeof contentType === 'string' ? contentType : getContentTypeString(contentType);
    const key = getContentKey(id, contentTypeStr);
    
    setLoadingStates(prev => {
      const current = prev[key] || { isLikeLoading: false, isBookmarkLoading: false };
      return {
        ...prev,
        [key]: {
          ...current,
          isLikeLoading: isLoading
        }
      };
    });
  }, [setLoadingStates]);

  // Handle like interaction with consistent RPC function name
  const handleLike = useCallback(async (id: string, itemType: ContentItemType | string): Promise<ContentInteractionResult | null> => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return null;
    }
    
    const contentTypeStr = typeof itemType === 'string' ? itemType : getContentTypeString(itemType);
    const key = getContentKey(id, contentTypeStr);
    const isLiked = userLikes[key] || userLikes[id] || false; // Check both formats for backward compatibility
    const typeInfo = getContentTypeInfo(contentTypeStr);
    
    // Set loading state
    setLikeLoadingState(id, contentTypeStr, true);
    
    try {
      if (isLiked) {
        // Unlike content
        if (contentTypeStr === 'quote') {
          const { error } = await supabase
            .from('quote_likes')
            .delete()
            .eq('user_id', userId)
            .eq('quote_id', id);
            
          if (error) throw error;
            
          // Update counter in quotes table
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: typeInfo.likesColumnName,
            table_name: typeInfo.contentTable
          });
        } else {
          const { error } = await supabase
            .from('content_likes')
            .delete()
            .eq('user_id', userId)
            .eq('content_id', id)
            .eq('content_type', contentTypeStr);
            
          if (error) throw error;
            
          // Update counter in the appropriate table
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: typeInfo.likesColumnName,
            table_name: typeInfo.contentTable
          });
        }
          
        // Update state with both key formats
        setUserLikes(prev => {
          const newState = {...prev};
          newState[key] = false;
          newState[id] = false; // For backward compatibility
          return newState;
        });
        
        toast({
          description: "Like removed"
        });
      } else {
        // Like content
        if (contentTypeStr === 'quote') {
          const { error } = await supabase
            .from('quote_likes')
            .insert({
              user_id: userId,
              quote_id: id
            });
            
          if (error) throw error;
            
          // Update counter in quotes table
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: typeInfo.likesColumnName,
            table_name: typeInfo.contentTable
          });
        } else {
          const { error } = await supabase
            .from('content_likes')
            .insert({
              user_id: userId,
              content_id: id,
              content_type: contentTypeStr
            });
            
          if (error) throw error;
            
          // Update counter in the appropriate table
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: typeInfo.likesColumnName,
            table_name: typeInfo.contentTable
          });
        }
          
        // Update state with both key formats
        setUserLikes(prev => {
          const newState = {...prev};
          newState[key] = true;
          newState[id] = true; // For backward compatibility
          return newState;
        });
        
        toast({
          description: "Content liked"
        });
      }
      
      return {
        isLiked: !isLiked,
        id,
        contentType: contentTypeStr
      };
      
    } catch (err) {
      const pgError = err as PostgrestError;
      console.error('Error updating like:', pgError);
      toast({
        title: "Action failed",
        description: "Failed to update like status",
        variant: "destructive"
      });
      return null;
    } finally {
      // Clear loading state
      setLikeLoadingState(id, contentTypeStr, false);
    }
  }, [userId, userLikes, toast, setUserLikes, setLikeLoadingState]);

  return { handleLike };
};
