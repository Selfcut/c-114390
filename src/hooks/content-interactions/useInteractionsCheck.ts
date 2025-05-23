
import { supabase } from '@/integrations/supabase/client';
import { InteractionCheckResult } from './types';
import { PostgrestError } from '@supabase/supabase-js';

export const useInteractionsCheck = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  // Check if user has liked or bookmarked items
  const checkUserInteractions = async (itemIds: string[]): Promise<void> => {
    if (!userId || itemIds.length === 0) return;
    
    try {
      // Process in batches if there are many IDs to avoid URL length limits
      const batchSize = 20;
      const batches = [];
      
      for (let i = 0; i < itemIds.length; i += batchSize) {
        batches.push(itemIds.slice(i, i + batchSize));
      }
      
      const allLikes: Record<string, boolean> = {};
      const allBookmarks: Record<string, boolean> = {};
      
      // Process each batch
      for (const batchIds of batches) {
        // Check likes
        await checkBatchLikes(batchIds, allLikes);
        
        // Check bookmarks
        await checkBatchBookmarks(batchIds, allBookmarks);
      }
      
      // Update state with all results
      setUserLikes(prev => ({...prev, ...allLikes}));
      setUserBookmarks(prev => ({...prev, ...allBookmarks}));
    } catch (err) {
      console.error('Error checking user interactions:', err);
    }
  };

  // Check batch of items for likes
  const checkBatchLikes = async (
    batchIds: string[], 
    results: Record<string, boolean>
  ): Promise<void> => {
    try {
      // Check content_likes table
      const { data: contentLikes, error: contentError } = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', userId!)
        .in('content_id', batchIds);
      
      // Record content likes
      if (!contentError && contentLikes) {
        contentLikes.forEach(item => {
          if (item.content_id) results[item.content_id] = true;
        });
      }
      
      // Check quote_likes table
      const { data: quoteLikes, error: quoteError } = await supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', userId!)
        .in('quote_id', batchIds);
      
      // Record quote likes
      if (!quoteError && quoteLikes) {
        quoteLikes.forEach(item => {
          if (item.quote_id) results[item.quote_id] = true;
        });
      }
    } catch (error) {
      console.error('Error checking batch likes:', error);
    }
  };
  
  // Check batch of items for bookmarks
  const checkBatchBookmarks = async (
    batchIds: string[],
    results: Record<string, boolean>
  ): Promise<void> => {
    try {
      // Check content_bookmarks table
      const { data: contentBookmarks, error: contentError } = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', userId!)
        .in('content_id', batchIds);
      
      // Record content bookmarks
      if (!contentError && contentBookmarks) {
        contentBookmarks.forEach(item => {
          if (item.content_id) results[item.content_id] = true;
        });
      }
      
      // Check quote_bookmarks table
      const { data: quoteBookmarks, error: quoteError } = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', userId!)
        .in('quote_id', batchIds);
      
      // Record quote bookmarks
      if (!quoteError && quoteBookmarks) {
        quoteBookmarks.forEach(item => {
          if (item.quote_id) results[item.quote_id] = true;
        });
      }
    } catch (error) {
      console.error('Error checking batch bookmarks:', error);
    }
  };

  // Check interactions for a single content item
  const checkSingleItemInteractions = async (
    itemId: string, 
    contentType: string = 'content'
  ): Promise<InteractionCheckResult> => {
    if (!userId) {
      return { id: itemId, isLiked: false, isBookmarked: false };
    }
    
    try {
      const isQuote = contentType === 'quote';
      
      // Check likes
      let isLiked = false;
      let likeError: PostgrestError | null = null;
      
      if (isQuote) {
        // Check quote likes
        const result = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
          
        isLiked = !!result.data;
        likeError = result.error;
      } else {
        // Check content likes
        const result = await supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', itemId)
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .maybeSingle();
          
        isLiked = !!result.data;
        likeError = result.error;
      }
      
      if (likeError) {
        console.error('Error checking like status:', likeError);
      }
      
      // Check bookmarks
      let isBookmarked = false;
      let bookmarkError: PostgrestError | null = null;
      
      if (isQuote) {
        // Check quote bookmarks
        const result = await supabase
          .from('quote_bookmarks')
          .select('id')
          .eq('quote_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
          
        isBookmarked = !!result.data;
        bookmarkError = result.error;
      } else {
        // Check content bookmarks
        const result = await supabase
          .from('content_bookmarks')
          .select('id')
          .eq('content_id', itemId)
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .maybeSingle();
          
        isBookmarked = !!result.data;
        bookmarkError = result.error;
      }
      
      if (bookmarkError) {
        console.error('Error checking bookmark status:', bookmarkError);
      }
      
      return {
        id: itemId,
        isLiked,
        isBookmarked
      };
    } catch (err) {
      console.error('Error checking item interactions:', err);
      return { id: itemId, isLiked: false, isBookmarked: false };
    }
  };

  return { 
    checkUserInteractions,
    checkSingleItemInteractions
  };
};
