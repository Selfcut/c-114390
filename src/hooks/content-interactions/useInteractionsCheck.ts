
import { supabase } from '@/integrations/supabase/client';
import { InteractionCheckResult } from './types';

export const useInteractionsCheck = (
  userId?: string | null,
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {},
  setUserBookmarks: React.Dispatch<React.SetStateAction<Record<string, boolean>>> = () => {}
) => {
  // Check if user has liked or bookmarked items
  const checkUserInteractions = async (itemIds: string[]): Promise<void> => {
    if (!userId || itemIds.length === 0) return;
    
    try {
      // Check likes in the content_likes table
      const { data: contentLikesData, error: contentLikesError } = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', userId)
        .in('content_id', itemIds);
        
      if (contentLikesError) {
        console.error('Error checking content likes:', contentLikesError);
      }
      
      // Check likes in the quote_likes table
      const { data: quoteLikesData, error: quoteLikesError } = await supabase
        .from('quote_likes')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', itemIds);
        
      if (quoteLikesError) {
        console.error('Error checking quote likes:', quoteLikesError);
      }
      
      // Combine likes from both tables
      const allLikes: Record<string, boolean> = {};
      
      if (contentLikesData) {
        contentLikesData.forEach(item => {
          if (item.content_id) allLikes[item.content_id] = true;
        });
      }
      
      if (quoteLikesData) {
        quoteLikesData.forEach(item => {
          if (item.quote_id) allLikes[item.quote_id] = true;
        });
      }
      
      // Update likes state
      setUserLikes(prev => ({...prev, ...allLikes}));
      
      // Check bookmarks in the content_bookmarks table
      const { data: contentBookmarksData, error: contentBookmarksError } = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', userId)
        .in('content_id', itemIds);
        
      if (contentBookmarksError) {
        console.error('Error checking content bookmarks:', contentBookmarksError);
      }
      
      // Check bookmarks in the quote_bookmarks table
      const { data: quoteBookmarksData, error: quoteBookmarksError } = await supabase
        .from('quote_bookmarks')
        .select('quote_id')
        .eq('user_id', userId)
        .in('quote_id', itemIds);
        
      if (quoteBookmarksError) {
        console.error('Error checking quote bookmarks:', quoteBookmarksError);
      }
      
      // Combine bookmarks from both tables
      const allBookmarks: Record<string, boolean> = {};
      
      if (contentBookmarksData) {
        contentBookmarksData.forEach(item => {
          if (item.content_id) allBookmarks[item.content_id] = true;
        });
      }
      
      if (quoteBookmarksData) {
        quoteBookmarksData.forEach(item => {
          if (item.quote_id) allBookmarks[item.quote_id] = true;
        });
      }
      
      // Update bookmarks state
      setUserBookmarks(prev => ({...prev, ...allBookmarks}));
    } catch (err) {
      console.error('Error checking user interactions:', err);
    }
  };

  // Check interactions for a single content item with fixed type issues
  const checkSingleItemInteractions = async (
    itemId: string, 
    contentType: string = 'content'
  ): Promise<InteractionCheckResult> => {
    if (!userId) {
      return { id: itemId, isLiked: false, isBookmarked: false };
    }
    
    try {
      const isQuoteType = contentType === 'quote';
      
      // Check likes
      let isLiked = false;
      
      if (isQuoteType) {
        // Check quote likes
        const { data: likeData } = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
          
        isLiked = !!likeData;
      } else {
        // Check content likes
        const { data: likeData } = await supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
          
        isLiked = !!likeData;
      }
      
      // Check bookmarks
      let isBookmarked = false;
      
      if (isQuoteType) {
        // Check quote bookmarks
        const { data: bookmarkData } = await supabase
          .from('quote_bookmarks')
          .select('id')
          .eq('quote_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
          
        isBookmarked = !!bookmarkData;
      } else {
        // Check content bookmarks
        const { data: bookmarkData } = await supabase
          .from('content_bookmarks')
          .select('id')
          .eq('content_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
          
        isBookmarked = !!bookmarkData;
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
