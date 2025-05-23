
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
          allLikes[item.content_id] = true;
        });
      }
      
      if (quoteLikesData) {
        quoteLikesData.forEach(item => {
          allLikes[item.quote_id] = true;
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
          allBookmarks[item.content_id] = true;
        });
      }
      
      if (quoteBookmarksData) {
        quoteBookmarksData.forEach(item => {
          allBookmarks[item.quote_id] = true;
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
      const likesTable = isQuoteType ? 'quote_likes' : 'content_likes';
      const bookmarksTable = isQuoteType ? 'quote_bookmarks' : 'content_bookmarks';
      const idField = isQuoteType ? 'quote_id' : 'content_id';
      
      // Check likes using type assertion for table names
      let likeData = null;
      if (isQuoteType) {
        const result = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
        likeData = result.data;
      } else {
        const result = await supabase
          .from('content_likes')
          .select('id')
          .eq('content_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
        likeData = result.data;
      }
      
      // Check bookmarks using type assertion for table names
      let bookmarkData = null;
      if (isQuoteType) {
        const result = await supabase
          .from('quote_bookmarks')
          .select('id')
          .eq('quote_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
        bookmarkData = result.data;
      } else {
        const result = await supabase
          .from('content_bookmarks')
          .select('id')
          .eq('content_id', itemId)
          .eq('user_id', userId)
          .maybeSingle();
        bookmarkData = result.data;
      }
      
      return {
        id: itemId,
        isLiked: !!likeData,
        isBookmarked: !!bookmarkData
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
