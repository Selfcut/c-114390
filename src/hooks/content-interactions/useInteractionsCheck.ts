
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { normalizeContentType } from '@/lib/utils/content-type-utils';

interface UseInteractionsCheckProps {
  userId?: string | null;
  contentId: string;
  contentType: string | ContentType | ContentItemType;
}

interface Interactions {
  isLiked: boolean;
  isBookmarked: boolean;
  error?: Error;
}

/**
 * Hook to check if a user has liked or bookmarked a piece of content.
 */
export const useInteractionsCheck = ({ userId, contentId, contentType }: UseInteractionsCheckProps) => {
  const [interactions, setInteractions] = useState<Interactions>({
    isLiked: false,
    isBookmarked: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const normalizedType = normalizeContentType(contentType);
  
  useEffect(() => {
    if (!userId || !contentId) {
      return;
    }
    
    const fetchInteractions = async () => {
      setIsLoading(true);
      
      try {
        let isLiked = false;
        let isBookmarked = false;
        
        // Determine if it's a quote
        if (normalizedType === 'quote') {
          // Check quote likes
          const { data: likeData, error: likeError } = await supabase
            .from('quote_likes')
            .select('id')
            .eq('quote_id', contentId)
            .eq('user_id', userId)
            .maybeSingle();
            
          if (likeError) throw likeError;
          isLiked = !!likeData;
          
          // Check quote bookmarks
          const { data: bookmarkData, error: bookmarkError } = await supabase
            .from('quote_bookmarks')
            .select('id')
            .eq('quote_id', contentId)
            .eq('user_id', userId)
            .maybeSingle();
            
          if (bookmarkError) throw bookmarkError;
          isBookmarked = !!bookmarkData;
        } else {
          // Check content likes
          const { data: likeData, error: likeError } = await supabase
            .from('content_likes')
            .select('id')
            .eq('content_id', contentId)
            .eq('user_id', userId)
            .eq('content_type', normalizedType)
            .maybeSingle();
            
          if (likeError) throw likeError;
          isLiked = !!likeData;
          
          // Check content bookmarks
          const { data: bookmarkData, error: bookmarkError } = await supabase
            .from('content_bookmarks')
            .select('id')
            .eq('content_id', contentId)
            .eq('user_id', userId)
            .eq('content_type', normalizedType)
            .maybeSingle();
            
          if (bookmarkError) throw bookmarkError;
          isBookmarked = !!bookmarkData;
        }
        
        setInteractions({ isLiked, isBookmarked });
      } catch (error) {
        console.error("Error fetching interactions:", error);
        setInteractions(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error : new Error(String(error)) 
        }));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInteractions();
  }, [userId, contentId, normalizedType]);
  
  return {
    ...interactions,
    isLoading
  };
};
