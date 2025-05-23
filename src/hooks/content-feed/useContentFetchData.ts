
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContentFeedState } from './types';
import { mapKnowledgeToFeedItem, mapQuoteToFeedItem, mapMediaToFeedItem } from './contentMappers';
import { ContentViewMode } from '@/types/unified-content-types';

interface UseContentFetchDataProps {
  userId?: string | null;
  checkUserInteractions?: (itemIds: string[]) => Promise<void>;
  viewMode?: ContentViewMode;
}

export const useContentFetchData = ({ userId, checkUserInteractions, viewMode = 'list' }: UseContentFetchDataProps) => {
  const [state, setState] = useState<ContentFeedState>({
    feedItems: [],
    isLoading: true,
    error: null,
    hasMore: true,
    page: 0
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();

  const loadContent = useCallback(async (reset = false) => {
    if (reset) {
      setState(prev => ({
        ...prev,
        page: 0,
        feedItems: [],
        hasMore: true
      }));
    }
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const pageSize = 10;
      const currentPage = reset ? 0 : state.page;
      
      // Get knowledge entries
      const { data: knowledgeData, error: knowledgeError } = await supabase
        .from('knowledge_entries')
        .select(`
          id,
          title,
          summary,
          content,
          created_at,
          categories,
          cover_image,
          views,
          likes,
          comments,
          user_id,
          profiles:user_id(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);
      
      // Get quotes
      const { data: quotesData, error: quoteError } = await supabase
        .from('quotes')
        .select(`
          id,
          text,
          author,
          source,
          created_at,
          tags,
          likes,
          comments,
          bookmarks,
          user_id,
          profiles:user_id(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);
      
      // Get media posts
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          url,
          type,
          likes,
          comments,
          views,
          user_id,
          profiles:user_id(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);
      
      // Check if we have any errors
      if (knowledgeError || quoteError || mediaError) {
        console.error("Error fetching content:", {
          knowledgeError,
          quoteError,
          mediaError
        });
        
        // Show error only if all queries fail
        if (knowledgeError && quoteError && mediaError) {
          setState(prev => ({
            ...prev,
            error: "Failed to load content. Please try again later.",
            isLoading: false
          }));
          return;
        }
      }
      
      // Map data to UnifiedContentItem format with proper viewMode parameter
      const mappedKnowledge = knowledgeData ? knowledgeData.map(item => mapKnowledgeToFeedItem(item, viewMode)) : [];
      const mappedQuotes = quotesData ? quotesData.map(item => mapQuoteToFeedItem(item, viewMode)) : [];
      const mappedMedia = mediaData ? mediaData.map(item => mapMediaToFeedItem(item, viewMode)) : [];
      
      // Combine all items and sort by date
      const combinedItems = [
        ...mappedKnowledge,
        ...mappedQuotes,
        ...mappedMedia
      ].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      // Update state
      setState(prev => ({
        ...prev,
        feedItems: reset ? combinedItems : [...prev.feedItems, ...combinedItems],
        hasMore: combinedItems.length === pageSize * 3,
        page: reset ? 0 : prev.page + 1,
        isLoading: false
      }));
      
      // If user is logged in, check their interactions (likes, bookmarks)
      if (userId && combinedItems.length > 0 && checkUserInteractions) {
        const itemIds = combinedItems.map(item => item.id);
        await checkUserInteractions(itemIds);
      }
      
    } catch (err) {
      console.error('Error fetching feed items:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to load content. Please try again later.',
        isLoading: false
      }));
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
      setIsInitialLoad(false);
    }
  }, [state.page, userId, toast, checkUserInteractions, viewMode]);

  const refetch = useCallback(() => loadContent(true), [loadContent]);
  
  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      loadContent(false);
    }
  }, [state.isLoading, state.hasMore, loadContent]);

  // Return the data and functions
  return {
    ...state,
    loadMore,
    refetch,
    loadContent,
    isInitialLoad
  };
};
