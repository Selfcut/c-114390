
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { getContentTypeString, getContentTypeInfo, getContentKey } from './contentTypeUtils';
import { BatchProcessingOptions } from './types';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Default batch processing options
 */
const DEFAULT_BATCH_OPTIONS: BatchProcessingOptions = {
  batchSize: 20,
  retryCount: 3,
  retryDelay: 500
};

/**
 * Hook for checking user interactions with content (likes and bookmarks)
 */
export const useInteractionsCheck = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  options: BatchProcessingOptions = DEFAULT_BATCH_OPTIONS
) => {
  
  /**
   * Check if a user has interacted with content items
   * @param itemIds Array of content item IDs
   * @param itemType Content type (optional, defaults to handling different types)
   */
  const checkUserInteractions = useCallback(async (
    itemIds: string[], 
    itemType?: ContentItemType | string,
    retryCount = options.retryCount || DEFAULT_BATCH_OPTIONS.retryCount
  ): Promise<void> => {
    if (!userId || !itemIds.length) return;
    
    // Extract content type if provided
    let contentTypeStr: string | undefined;
    if (itemType) {
      contentTypeStr = typeof itemType === 'string' 
        ? itemType 
        : getContentTypeString(itemType);
    }
    
    try {
      // Determine if we're checking a specific content type or mixed types
      if (contentTypeStr) {
        // Single content type check (more efficient)
        const typeInfo = getContentTypeInfo(contentTypeStr);
        await Promise.all([
          checkLikesForType(userId, itemIds, contentTypeStr, typeInfo.likesTable, typeInfo.idFieldName),
          checkBookmarksForType(userId, itemIds, contentTypeStr, typeInfo.bookmarksTable, typeInfo.idFieldName)
        ]);
      } else {
        // Mixed content types (fallback, less efficient)
        console.warn('Checking interactions without specific content type is less efficient');
        // Fallback to checking each individually
        // This could be improved with more complex queries if needed
      }
    } catch (err) {
      const pgError = err as PostgrestError;
      console.error('Error checking user interactions:', pgError);
      
      // Implement retry logic for transient errors
      if (retryCount > 0) {
        console.log(`Retrying interaction check, ${retryCount} attempts remaining`);
        const delay = options.retryDelay || DEFAULT_BATCH_OPTIONS.retryDelay || 500;
        
        setTimeout(() => {
          checkUserInteractions(itemIds, itemType, retryCount - 1);
        }, delay);
      }
    }
  }, [userId, options, setUserLikes, setUserBookmarks]);
  
  /**
   * Helper to check likes for a specific content type
   */
  const checkLikesForType = async (
    userId: string, 
    itemIds: string[], 
    contentType: string,
    likesTable: string,
    idFieldName: string
  ) => {
    // Ensure unique IDs only
    const uniqueIds = [...new Set(itemIds)];
    
    if (contentType === 'quote') {
      const { data, error } = await supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', uniqueIds);
        
      if (error) throw error;
      
      if (data) {
        const likedIds = data.map(item => item.quote_id);
        
        // Update state with both key formats (for backward compatibility)
        setUserLikes(prev => {
          const newState = {...prev};
          
          uniqueIds.forEach(id => {
            const isLiked = likedIds.includes(id);
            const key = getContentKey(id, contentType);
            newState[key] = isLiked;
            newState[id] = isLiked; // For backward compatibility
          });
          
          return newState;
        });
      }
    } else {
      const { data, error } = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .in('content_id', uniqueIds);
        
      if (error) throw error;
      
      if (data) {
        const likedIds = data.map(item => item.content_id);
        
        // Update state with both key formats (for backward compatibility)
        setUserLikes(prev => {
          const newState = {...prev};
          
          uniqueIds.forEach(id => {
            const isLiked = likedIds.includes(id);
            const key = getContentKey(id, contentType);
            newState[key] = isLiked;
            newState[id] = isLiked; // For backward compatibility
          });
          
          return newState;
        });
      }
    }
  };
  
  /**
   * Helper to check bookmarks for a specific content type
   */
  const checkBookmarksForType = async (
    userId: string, 
    itemIds: string[], 
    contentType: string,
    bookmarksTable: string,
    idFieldName: string
  ) => {
    // Ensure unique IDs only
    const uniqueIds = [...new Set(itemIds)];
    
    if (contentType === 'quote') {
      const { data, error } = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', uniqueIds);
        
      if (error) throw error;
      
      if (data) {
        const bookmarkedIds = data.map(item => item.quote_id);
        
        // Update state with both key formats (for backward compatibility)
        setUserBookmarks(prev => {
          const newState = {...prev};
          
          uniqueIds.forEach(id => {
            const isBookmarked = bookmarkedIds.includes(id);
            const key = getContentKey(id, contentType);
            newState[key] = isBookmarked;
            newState[id] = isBookmarked; // For backward compatibility
          });
          
          return newState;
        });
      }
    } else {
      const { data, error } = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .in('content_id', uniqueIds);
        
      if (error) throw error;
      
      if (data) {
        const bookmarkedIds = data.map(item => item.content_id);
        
        // Update state with both key formats (for backward compatibility)
        setUserBookmarks(prev => {
          const newState = {...prev};
          
          uniqueIds.forEach(id => {
            const isBookmarked = bookmarkedIds.includes(id);
            const key = getContentKey(id, contentType);
            newState[key] = isBookmarked;
            newState[id] = isBookmarked; // For backward compatibility
          });
          
          return newState;
        });
      }
    }
  };
  
  return { checkUserInteractions };
};
