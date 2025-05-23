
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { normalizeContentType, getContentTypeString } from './contentTypeUtils';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';
import { useContentTables } from '@/hooks/content/useContentTables';

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
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { getTableNames } = useContentTables({ contentType: normalizeContentType(contentType) });
  const tableNames = getTableNames();
  
  const { contentTable, likesTable, contentIdField } = tableNames;

  // Fetch initial like state on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchInitialLikeState = async () => {
        try {
          const { data, error } = await supabase
            .from(likesTable as any) // Type assertion to bypass TypeScript restriction
            .select('id')
            .eq(contentIdField, contentId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error) {
            throw error;
          }
          
          setIsLiked(!!data);
        } catch (error) {
          console.error('Error fetching initial like state:', error);
        }
      };
      
      fetchInitialLikeState();
    }
  }, [isAuthenticated, user, contentId, likesTable, contentIdField]);

  // Function to toggle like
  const toggleLike = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to like this content.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Optimistic update
      setIsLiked(prev => !prev);
      setLikeCount(prevCount => (isLiked ? prevCount - 1 : prevCount + 1));
      
      // Determine if we should insert or delete based on current state
      if (isLiked) {
        // Unlike: Delete the like
        const { error } = await supabase
          .from(likesTable as any) // Type assertion to bypass TypeScript restriction
          .delete()
          .eq(contentIdField, contentId)
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        // Decrement counter in the content table
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: contentTable
        });
      } else {
        // Like: Insert a new like
        const insertData: any = {
          user_id: user.id,
        };
        
        // Add the proper content ID field
        insertData[contentIdField] = contentId;
        
        // Conditionally add content_type if it's not a quote
        if (normalizeContentType(contentType) !== 'quote') {
          insertData['content_type'] = normalizeContentType(contentType);
        }
        
        const { error } = await supabase
          .from(likesTable as any) // Type assertion to bypass TypeScript restriction
          .insert(insertData);
        
        if (error) {
          throw error;
        }
        
        // Increment counter in the content table
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: contentTable
        });
      }
      
      // Notify parent component about like count change
      if (onLikeChange) {
        onLikeChange(isLiked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      setIsLiked(prev => !prev);
      setLikeCount(prevCount => (isLiked ? prevCount + 1 : prevCount - 1));
      
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
  };
};
