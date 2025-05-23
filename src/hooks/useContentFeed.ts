
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/contentTypes';
import { toggleLike, toggleBookmark } from '@/lib/utils/content-operations';

// Define the content feed item structure
export interface ContentFeedItem {
  id: string;
  type: ContentItemType;
  title: string;
  summary?: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: string;
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    bookmarks?: number;
  };
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'youtube' | 'document' | 'text';
}

export const useContentFeed = () => {
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get state key for content items
  const getStateKey = useCallback((id: string, type: ContentItemType | string) => {
    return `${type}:${id}`;
  }, []);
  
  // Check user interactions for content items
  const checkUserInteractions = useCallback(async (items: ContentFeedItem[]) => {
    if (!user || items.length === 0) return;
    
    try {
      const likesPromises = [];
      const bookmarksPromises = [];
      
      // Process each content item
      for (const item of items) {
        // Check for quote likes
        if (item.type === ContentItemType.Quote) {
          const { data: likesData } = await supabase
            .from('quote_likes')
            .select('id')
            .eq('quote_id', item.id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          const { data: bookmarksData } = await supabase
            .from('quote_bookmarks')
            .select('id')
            .eq('quote_id', item.id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          const key = getStateKey(item.id, item.type);
          setUserLikes(prev => ({ ...prev, [key]: !!likesData }));
          setUserBookmarks(prev => ({ ...prev, [key]: !!bookmarksData }));
        } 
        // Check for other content types
        else {
          const { data: likesData } = await supabase
            .from('content_likes')
            .select('id')
            .eq('content_id', item.id)
            .eq('user_id', user.id)
            .eq('content_type', item.type.toString())
            .maybeSingle();
            
          const { data: bookmarksData } = await supabase
            .from('content_bookmarks')
            .select('id')
            .eq('content_id', item.id)
            .eq('user_id', user.id)
            .eq('content_type', item.type.toString())
            .maybeSingle();
            
          const key = getStateKey(item.id, item.type);
          setUserLikes(prev => ({ ...prev, [key]: !!likesData }));
          setUserBookmarks(prev => ({ ...prev, [key]: !!bookmarksData }));
        }
      }
    } catch (err) {
      console.error('Error checking user interactions:', err);
    }
  }, [user, getStateKey]);
  
  // Map knowledge entry to feed item
  const mapKnowledgeEntry = useCallback((item: any): ContentFeedItem => {
    return {
      id: item.id,
      type: ContentItemType.Knowledge,
      title: item.title,
      summary: item.summary,
      content: item.content,
      author: {
        name: item.profiles?.name || 'Unknown',
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
    };
  }, []);
  
  // Map quote to feed item
  const mapQuote = useCallback((item: any): ContentFeedItem => {
    return {
      id: item.id,
      type: ContentItemType.Quote,
      title: item.author,
      content: item.text,
      summary: item.source,
      author: {
        name: item.profiles?.name || 'Unknown',
        avatar: item.profiles?.avatar_url,
        username: item.profiles?.username
      },
      createdAt: item.created_at,
      metrics: {
        likes: item.likes || 0,
        comments: item.comments || 0,
        bookmarks: item.bookmarks || 0
      },
      tags: item.tags || []
    };
  }, []);
  
  // Map media post to feed item
  const mapMediaPost = useCallback((item: any): ContentFeedItem => {
    return {
      id: item.id,
      type: ContentItemType.Media,
      title: item.title,
      content: item.content,
      author: {
        name: item.profiles?.name || 'Unknown',
        avatar: item.profiles?.avatar_url,
        username: item.profiles?.username
      },
      createdAt: item.created_at,
      metrics: {
        likes: item.likes || 0,
        comments: item.comments || 0,
        views: item.views || 0
      },
      mediaUrl: item.url,
      mediaType: item.type
    };
  }, []);
  
  // Fetch content from database
  const fetchContent = useCallback(async (reset: boolean = false) => {
    if (reset) {
      setPage(0);
      setFeedItems([]);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const pageSize = 10;
      const currentPage = reset ? 0 : page;
      
      // Fetch knowledge entries
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
      
      // Fetch quotes
      const { data: quotesData, error: quotesError } = await supabase
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
      
      // Fetch media posts
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          tags,
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
      
      // Handle errors
      if (knowledgeError && quotesError && mediaError) {
        throw new Error('Failed to fetch content from any source');
      }
      
      // Map data to content items
      const knowledgeItems = knowledgeData ? knowledgeData.map(mapKnowledgeEntry) : [];
      const quoteItems = quotesData ? quotesData.map(mapQuote) : [];
      const mediaItems = mediaData ? mediaData.map(mapMediaPost) : [];
      
      // Combine and sort items
      const allItems = [...knowledgeItems, ...quoteItems, ...mediaItems]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Update state
      setFeedItems(prev => reset ? allItems : [...prev, ...allItems]);
      setHasMore(allItems.length >= pageSize);
      setPage(prev => reset ? 1 : prev + 1);
      
      // Check user interactions
      if (user) {
        await checkUserInteractions(allItems);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, user, mapKnowledgeEntry, mapQuote, mapMediaPost, checkUserInteractions]);
  
  // Initial content fetch
  useEffect(() => {
    fetchContent(true);
  }, []);
  
  // Handle like action
  const handleLike = useCallback(async (contentId: string, contentType: ContentItemType) => {
    if (!user) return;
    
    try {
      const key = getStateKey(contentId, contentType);
      const currentState = userLikes[key] || false;
      
      // Optimistic update
      setUserLikes(prev => ({ ...prev, [key]: !currentState }));
      
      // Perform database update
      const success = await toggleLike(user.id, contentId, contentType.toString());
      
      // Revert if unsuccessful
      if (!success) {
        setUserLikes(prev => ({ ...prev, [key]: currentState }));
      }
    } catch (err) {
      console.error('Error handling like:', err);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  }, [user, userLikes, getStateKey, toast]);
  
  // Handle bookmark action
  const handleBookmark = useCallback(async (contentId: string, contentType: ContentItemType) => {
    if (!user) return;
    
    try {
      const key = getStateKey(contentId, contentType);
      const currentState = userBookmarks[key] || false;
      
      // Optimistic update
      setUserBookmarks(prev => ({ ...prev, [key]: !currentState }));
      
      // Perform database update
      const success = await toggleBookmark(user.id, contentId, contentType.toString());
      
      // Revert if unsuccessful
      if (!success) {
        setUserBookmarks(prev => ({ ...prev, [key]: currentState }));
      }
    } catch (err) {
      console.error('Error handling bookmark:', err);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    }
  }, [user, userBookmarks, getStateKey, toast]);
  
  // Handle content click (navigation)
  const handleContentClick = useCallback((contentId: string, contentType: ContentItemType) => {
    let route = '/';
    
    switch (contentType) {
      case ContentItemType.Knowledge:
        route = `/knowledge/${contentId}`;
        break;
      case ContentItemType.Media:
        route = `/media/${contentId}`;
        break;
      case ContentItemType.Quote:
        route = `/quotes/${contentId}`;
        break;
      case ContentItemType.AI:
        route = `/ai-content/${contentId}`;
        break;
      case ContentItemType.Forum:
        route = `/forum/post/${contentId}`;
        break;
      case ContentItemType.Wiki:
        route = `/wiki/${contentId}`;
        break;
      default:
        route = '/';
    }
    
    navigate(route);
  }, [navigate]);
  
  // Load more content
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchContent(false);
    }
  }, [isLoading, hasMore, fetchContent]);
  
  // Refetch content
  const refetch = useCallback(() => {
    fetchContent(true);
  }, [fetchContent]);
  
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
