
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useContentInteractions } from './useContentInteractions';
import { useToast } from './use-toast';
import { ContentItemType, MediaType } from '@/components/library/content-items/ContentItemTypes';
import { ContentFeedItem } from '@/components/library/ContentFeedItem';
import { useNavigate } from 'react-router-dom';

export interface ContentFeedFilters {
  contentType?: ContentItemType | 'all';
  sortBy?: 'latest' | 'popular' | 'trending';
  searchTerm?: string;
}

export const useContentFeed = () => {
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { userLikes, userBookmarks, handleLike, handleBookmark, checkUserInteractions } = useContentInteractions({ 
    userId: user?.id 
  });
  
  const loadContent = useCallback(async (reset = false) => {
    if (reset) {
      setPage(0);
      setFeedItems([]);
      setHasMore(true);
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const pageSize = 10;
      const currentPage = reset ? 0 : page;
      
      // Get knowledge entries
      const { data: knowledgeData, error: knowledgeError } = await supabase
        .from('knowledge_entries')
        .select(`
          *,
          profiles(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);
      
      // Get quotes
      const { data: quotesData, error: quoteError } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);
      
      // Get media posts
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_posts')
        .select(`
          *,
          profiles(name, avatar_url, username)
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
          setError("Failed to load content. Please try again later.");
          return;
        }
      }
      
      // Map data to ContentFeedItem format
      const mappedKnowledge = knowledgeData ? knowledgeData.map((item: any) => ({
        id: item.id,
        type: 'knowledge' as ContentItemType,
        title: item.title,
        summary: item.summary,
        content: item.content,
        author: {
          name: item.profiles?.name || 'Unknown Author',
          avatar: item.profiles?.avatar_url,
          username: item.profiles?.username
        },
        createdAt: item.created_at,
        metrics: {
          likes: item.likes || 0,
          comments: item.comments || 0,
          views: item.views || 0
        },
        tags: item.categories || [],
        coverImage: item.cover_image
      })) : [];
      
      const mappedQuotes = quotesData ? quotesData.map((item: any) => ({
        id: item.id,
        type: 'quote' as ContentItemType,
        title: item.author, // For quotes, we use the quote author as the title
        summary: item.text,
        author: {
          name: item.profiles?.name || 'Unknown Author',
          avatar: item.profiles?.avatar_url,
          username: item.profiles?.username
        },
        createdAt: item.created_at,
        metrics: {
          likes: item.likes || 0,
          comments: item.comments || 0,
          bookmarks: item.bookmarks || 0
        },
        tags: item.tags || [],
        coverImage: null
      })) : [];
      
      const mappedMedia = mediaData ? mediaData.map((item: any) => ({
        id: item.id,
        type: 'media' as ContentItemType,
        title: item.title,
        summary: item.content,
        author: {
          name: item.profiles?.name || 'Unknown Author',
          avatar: item.profiles?.avatar_url,
          username: item.profiles?.username
        },
        createdAt: item.created_at,
        metrics: {
          likes: item.likes || 0,
          comments: item.comments || 0,
          views: item.views || 0
        },
        tags: item.tags || [],
        mediaUrl: item.url,
        mediaType: item.type as MediaType
      })) : [];
      
      // Combine all items and sort by date
      const combinedItems = [
        ...mappedKnowledge,
        ...mappedQuotes,
        ...mappedMedia
      ].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      // Update state
      if (reset) {
        setFeedItems(combinedItems);
      } else {
        setFeedItems(prev => [...prev, ...combinedItems]);
      }
      
      // Check if there are more items to load
      setHasMore(combinedItems.length === pageSize * 3);
      
      // If user is logged in, check their interactions (likes, bookmarks)
      if (user && combinedItems.length > 0) {
        const itemIds = combinedItems.map(item => item.id);
        await checkUserInteractions(itemIds);
      }
      
    } catch (err) {
      console.error('Error fetching feed items:', err);
      setError('Failed to load content. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, user, checkUserInteractions, toast]);
  
  const refetch = useCallback(() => loadContent(true), [loadContent]);
  
  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };
  
  const handleContentClick = (contentId: string, contentType: ContentItemType) => {
    let path = '';
    
    switch(contentType) {
      case 'knowledge':
        path = `/knowledge/${contentId}`;
        break;
      case 'media':
        path = `/media/${contentId}`;
        break;
      case 'quote':
        path = `/quotes/${contentId}`;
        break;
      case 'ai':
        path = `/ai-content/${contentId}`;
        break;
      default:
        console.warn(`No path defined for content type: ${contentType}`);
        return;
    }
    
    // Track view if possible
    if (contentType === 'media') {
      try {
        supabase.rpc('increment_media_views', { media_id: contentId })
          .then(({ error }) => {
            if (error) console.error('Error tracking view:', error);
          });
      } catch (err) {
        console.error('Error tracking view:', err);
      }
    }
    
    navigate(path);
  };

  return {
    feedItems,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    handleContentClick
  };
};
