
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { normalizeContentType, getContentTableInfo } from '@/lib/utils/content-type-utils';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Define strongly typed interfaces for database operations
interface QuoteLikePayload {
  quote_id: string;
  user_id: string;
}

interface ContentLikePayload {
  content_id: string;
  user_id: string;
  content_type: string;
}

type LikePayload = QuoteLikePayload | ContentLikePayload;

interface UseLikeInteractionsProps {
  contentId: string;
  contentType: string | ContentType | ContentItemType;
  initialLikeCount?: number;
  onLikeChange?: (newLikeCount: number) => void;
}

/**
 * Hook for managing like interactions for different content types
 */
export const useLikeInteractions = ({
  contentId,
  contentType,
  initialLikeCount = 0,
  onLikeChange,
}: UseLikeInteractionsProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { toast } = useToast();
  
  const normalizedType = normalizeContentType(contentType);
  const { contentTable, likesColumnName } = getContentTableInfo(normalizedType);

  // Fetch initial like state on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchInitialLikeState = async () => {
        try {
          setIsLoading(true);
          
          if (normalizedType === 'quote') {
            const { data, error } = await supabase
              .from('quote_likes')
              .select('id')
              .eq('quote_id', contentId)
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (error) {
              throw error;
            }
            
            setIsLiked(!!data);
          } else {
            const { data, error } = await supabase
              .from('content_likes')
              .select('id')
              .eq('content_id', contentId)
              .eq('user_id', user.id)
              .eq('content_type', normalizedType)
              .maybeSingle();
            
            if (error) {
              throw error;
            }
            
            setIsLiked(!!data);
          }
        } catch (error) {
          console.error('Error fetching initial like state:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchInitialLikeState();
    }
  }, [isAuthenticated, user, contentId, normalizedType]);

  // Function to toggle like
  const toggleLike = useCallback(async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to like this content.',
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Optimistic update
      setIsLiked(prev => !prev);
      setLikeCount(prevCount => (isLiked ? prevCount - 1 : prevCount + 1));
      
      if (normalizedType === 'quote') {
        // Handle quote likes
        if (isLiked) {
          // Unlike: Delete the like
          const { data, error: findError } = await supabase
            .from('quote_likes')
            .select('id')
            .eq('quote_id', contentId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (findError) throw findError;
          
          if (data) {
            const { error: deleteError } = await supabase
              .from('quote_likes')
              .delete()
              .eq('id', data.id);
            
            if (deleteError) throw deleteError;
          }
          
          // Decrement counter in the content table
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: likesColumnName,
            table_name: contentTable
          });
        } else {
          // Like: Insert a new like
          const likeData: QuoteLikePayload = {
            user_id: user.id,
            quote_id: contentId
          };
          
          const { error } = await supabase
            .from('quote_likes')
            .insert(likeData);
          
          if (error) throw error;
          
          // Increment counter in the content table
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: likesColumnName,
            table_name: contentTable
          });
        }
      } else {
        // Handle other content types
        if (isLiked) {
          // Unlike: Delete the like
          const { data, error: findError } = await supabase
            .from('content_likes')
            .select('id')
            .eq('content_id', contentId)
            .eq('user_id', user.id)
            .eq('content_type', normalizedType)
            .maybeSingle();
            
          if (findError) throw findError;
          
          if (data) {
            const { error: deleteError } = await supabase
              .from('content_likes')
              .delete()
              .eq('id', data.id);
            
            if (deleteError) throw deleteError;
          }
          
          // Decrement counter in the content table
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: likesColumnName,
            table_name: contentTable
          });
        } else {
          // Like: Insert a new like
          const likeData: ContentLikePayload = {
            user_id: user.id,
            content_id: contentId,
            content_type: normalizedType
          };
          
          const { error } = await supabase
            .from('content_likes')
            .insert(likeData);
          
          if (error) throw error;
          
          // Increment counter in the content table
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: likesColumnName,
            table_name: contentTable
          });
        }
      }
      
      // Notify parent component about like count change
      if (onLikeChange) {
        onLikeChange(isLiked ? likeCount - 1 : likeCount + 1);
      }
      
      return !isLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      setIsLiked(prev => !prev);
      setLikeCount(prevCount => (isLiked ? prevCount - 1 : prevCount + 1));
      
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive'
      });
      
      return isLiked;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, contentId, isLiked, likeCount, normalizedType, contentTable, likesColumnName, onLikeChange, toast]);

  return {
    isLiked,
    likeCount,
    isLoading,
    toggleLike,
  };
};
