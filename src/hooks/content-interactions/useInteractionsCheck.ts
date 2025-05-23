
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InteractionCheckResult, BatchProcessingOptions } from './types';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { getContentTypeString, usesQuoteTables, getContentKey } from './contentTypeUtils';
import { PostgrestError } from '@supabase/supabase-js';

export const useInteractionsCheck = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  const [isChecking, setIsChecking] = useState(false);
  
  // Check if user has liked or bookmarked items
  const checkUserInteractions = useCallback(async (
    itemIds: string[], 
    itemType?: ContentItemType | string,
    options: BatchProcessingOptions = {}
  ): Promise<void> => {
    if (!userId || itemIds.length === 0) return;

    const contentType = itemType ? 
      (typeof itemType === 'string' ? itemType : getContentTypeString(itemType)) : 
      null;
    
    try {
      setIsChecking(true);
      
      // Process in batches if there are many IDs to avoid URL length limits
      const batchSize = options.batchSize || 20;
      const batches = [];
      
      for (let i = 0; i < itemIds.length; i += batchSize) {
        batches.push(itemIds.slice(i, i + batchSize));
      }
      
      const allLikes: Record<string, boolean> = {};
      const allBookmarks: Record<string, boolean> = {};
      
      // Process each batch
      for (const batchIds of batches) {
        if (contentType) {
          // If contentType is provided, we can optimize the query
          const isQuote = usesQuoteTables(contentType);
          
          // Check likes
          await checkTypedBatchLikes(batchIds, contentType, isQuote, allLikes);
          
          // Check bookmarks
          await checkTypedBatchBookmarks(batchIds, contentType, isQuote, allBookmarks);
        } else {
          // If no contentType provided, check all tables
          await checkBatchLikes(batchIds, allLikes);
          await checkBatchBookmarks(batchIds, allBookmarks);
        }
      }
      
      // Update state with all results
      if (Object.keys(allLikes).length > 0) {
        setUserLikes(prev => ({...prev, ...allLikes}));
      }
      
      if (Object.keys(allBookmarks).length > 0) {
        setUserBookmarks(prev => ({...prev, ...allBookmarks}));
      }
    } catch (err) {
      console.error('Error checking user interactions:', err);
    } finally {
      setIsChecking(false);
    }
  }, [userId, setUserLikes, setUserBookmarks]);

  // Check batch of items for likes with a specific content type
  const checkTypedBatchLikes = async (
    batchIds: string[],
    contentType: string,
    isQuote: boolean,
    results: Record<string, boolean>
  ): Promise<void> => {
    if (!userId) return;
    
    try {
      if (isQuote) {
        // Check quote_likes table
        const { data: quoteLikes, error } = await supabase
          .from('quote_likes')
          .select('quote_id')
          .eq('user_id', userId)
          .in('quote_id', batchIds);
        
        if (error) throw error;
        
        // Record quote likes with content type in the key
        if (quoteLikes) {
          quoteLikes.forEach(item => {
            if (item.quote_id) {
              const key = getContentKey(item.quote_id, contentType);
              results[key] = true;
              // Also store by ID only for backward compatibility
              results[item.quote_id] = true;
            }
          });
        }
      } else {
        // Check content_likes table
        const { data: contentLikes, error } = await supabase
          .from('content_likes')
          .select('content_id')
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .in('content_id', batchIds);
        
        if (error) throw error;
        
        // Record content likes with content type in the key
        if (contentLikes) {
          contentLikes.forEach(item => {
            if (item.content_id) {
              const key = getContentKey(item.content_id, contentType);
              results[key] = true;
              // Also store by ID only for backward compatibility
              results[item.content_id] = true;
            }
          });
        }
      }
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error(`Error checking ${contentType} likes:`, pgError.message);
    }
  };
  
  // Check batch of items for bookmarks with a specific content type
  const checkTypedBatchBookmarks = async (
    batchIds: string[],
    contentType: string,
    isQuote: boolean,
    results: Record<string, boolean>
  ): Promise<void> => {
    if (!userId) return;
    
    try {
      if (isQuote) {
        // Check quote_bookmarks table
        const { data: quoteBookmarks, error } = await supabase
          .from('quote_bookmarks')
          .select('quote_id')
          .eq('user_id', userId)
          .in('quote_id', batchIds);
        
        if (error) throw error;
        
        // Record quote bookmarks with content type in the key
        if (quoteBookmarks) {
          quoteBookmarks.forEach(item => {
            if (item.quote_id) {
              const key = getContentKey(item.quote_id, contentType);
              results[key] = true;
              // Also store by ID only for backward compatibility
              results[item.quote_id] = true;
            }
          });
        }
      } else {
        // Check content_bookmarks table
        const { data: contentBookmarks, error } = await supabase
          .from('content_bookmarks')
          .select('content_id')
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .in('content_id', batchIds);
        
        if (error) throw error;
        
        // Record content bookmarks with content type in the key
        if (contentBookmarks) {
          contentBookmarks.forEach(item => {
            if (item.content_id) {
              const key = getContentKey(item.content_id, contentType);
              results[key] = true;
              // Also store by ID only for backward compatibility
              results[item.content_id] = true;
            }
          });
        }
      }
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error(`Error checking ${contentType} bookmarks:`, pgError.message);
    }
  };

  // Check batch of items for likes across all content types
  const checkBatchLikes = async (
    batchIds: string[], 
    results: Record<string, boolean>
  ): Promise<void> => {
    if (!userId) return;
    
    try {
      // Check content_likes table
      const { data: contentLikes, error: contentError } = await supabase
        .from('content_likes')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', batchIds);
      
      // Record content likes
      if (!contentError && contentLikes) {
        contentLikes.forEach(item => {
          if (item.content_id) {
            const key = getContentKey(item.content_id, item.content_type);
            results[key] = true;
            // Also store by ID only for backward compatibility
            results[item.content_id] = true;
          }
        });
      } else if (contentError) {
        console.error('Error checking content likes:', contentError);
      }
      
      // Check quote_likes table
      const { data: quoteLikes, error: quoteError } = await supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', batchIds);
      
      // Record quote likes
      if (!quoteError && quoteLikes) {
        quoteLikes.forEach(item => {
          if (item.quote_id) {
            const key = getContentKey(item.quote_id, 'quote');
            results[key] = true;
            // Also store by ID only for backward compatibility
            results[item.quote_id] = true;
          }
        });
      } else if (quoteError) {
        console.error('Error checking quote likes:', quoteError);
      }
    } catch (error) {
      console.error('Error checking batch likes:', error);
    }
  };
  
  // Check batch of items for bookmarks across all content types
  const checkBatchBookmarks = async (
    batchIds: string[],
    results: Record<string, boolean>
  ): Promise<void> => {
    if (!userId) return;
    
    try {
      // Check content_bookmarks table
      const { data: contentBookmarks, error: contentError } = await supabase
        .from('content_bookmarks')
        .select('content_id, content_type')
        .eq('user_id', userId)
        .in('content_id', batchIds);
      
      // Record content bookmarks
      if (!contentError && contentBookmarks) {
        contentBookmarks.forEach(item => {
          if (item.content_id) {
            const key = getContentKey(item.content_id, item.content_type);
            results[key] = true;
            // Also store by ID only for backward compatibility
            results[item.content_id] = true;
          }
        });
      } else if (contentError) {
        console.error('Error checking content bookmarks:', contentError);
      }
      
      // Check quote_bookmarks table
      const { data: quoteBookmarks, error: quoteError } = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', batchIds);
      
      // Record quote bookmarks
      if (!quoteError && quoteBookmarks) {
        quoteBookmarks.forEach(item => {
          if (item.quote_id) {
            const key = getContentKey(item.quote_id, 'quote');
            results[key] = true;
            // Also store by ID only for backward compatibility
            results[item.quote_id] = true;
          }
        });
      } else if (quoteError) {
        console.error('Error checking quote bookmarks:', quoteError);
      }
    } catch (error) {
      console.error('Error checking batch bookmarks:', error);
    }
  };

  return { 
    checkUserInteractions,
    isChecking
  };
};
