
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export interface ContentFeedItem {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'media' | 'quotes' | 'ai';
  image?: string;
  author: string;
  date: string;
  likes?: number;
  views?: number;
  comments?: number;
  bookmarks?: number;
  category?: string;
  tags?: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  likes?: number;
  views?: number;
  comments?: number;
}

interface UseContentFeedReturn {
  feedItems: ContentFeedItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  userLikes: string[];
  userBookmarks: string[];
  handleLike: (contentId: string, contentType: string) => void;
  handleBookmark: (contentId: string, contentType: string) => void;
  handleContentClick: (contentId: string, contentType: string) => void;
}

export const useContentFeed = (): UseContentFeedReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchContentData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch knowledge entries
      const { data: knowledgeData, error: knowledgeError } = await supabase
        .from('knowledge_entries')
        .select(`
          id, title, summary, content, categories, cover_image, 
          likes, views, comments, is_ai_generated, user_id,
          created_at, updated_at, 
          profiles:user_id (id, username, name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(page * 5, (page + 1) * 5 - 1);

      // Fetch media posts
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_posts')
        .select(`
          id, title, content, type, url, likes, views, comments,
          user_id, created_at, updated_at,
          profiles:user_id (id, username, name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(page * 5, (page + 1) * 5 - 1);

      // Fetch quotes
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select(`
          id, text, author, source, category, tags, 
          likes, comments, bookmarks, user_id, 
          created_at, updated_at,
          profiles:user_id (id, username, name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(page * 5, (page + 1) * 5 - 1);

      // Process knowledge entries
      const knowledgeItems: ContentFeedItem[] = knowledgeData 
        ? knowledgeData.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.summary,
            type: 'knowledge',
            image: item.cover_image || '',
            author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
            date: item.created_at,
            likes: item.likes,
            views: item.views,
            comments: item.comments,
            tags: item.categories
          }))
        : [];

      // Process media posts
      const mediaItems: ContentFeedItem[] = mediaData 
        ? mediaData.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.content || '',
            type: 'media',
            image: item.url || '',
            author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
            date: item.created_at,
            likes: item.likes,
            views: item.views || 0,
            comments: item.comments
          }))
        : [];

      // Process quotes
      const quoteItems: ContentFeedItem[] = quoteData 
        ? quoteData.map((item: any) => ({
            id: item.id,
            title: item.author,
            description: item.text,
            type: 'quotes',
            author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
            date: item.created_at,
            likes: item.likes,
            bookmarks: item.bookmarks,
            comments: item.comments,
            category: item.category,
            tags: item.tags
          }))
        : [];

      // Get AI generated content
      const aiContent: ContentFeedItem[] = knowledgeData 
        ? knowledgeData
            .filter((item: any) => item.is_ai_generated)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.summary,
              type: 'ai',
              image: item.cover_image || '',
              author: item.profiles ? (item.profiles.name || item.profiles.username || 'AI Assistant') : 'AI Assistant',
              date: item.created_at,
              likes: item.likes,
              views: item.views,
              comments: item.comments,
              tags: item.categories
            }))
        : [];

      // Combine all items
      let allItems: ContentFeedItem[];
      
      if (page === 0) {
        // First page - replace all items
        allItems = [...knowledgeItems, ...mediaItems, ...quoteItems, ...aiContent];
      } else {
        // Additional pages - append to existing items
        allItems = [...feedItems, ...knowledgeItems, ...mediaItems, ...quoteItems, ...aiContent];
      }
      
      // Sort by date
      const sortedItems = allItems.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // Update state
      setFeedItems(sortedItems);
      setHasMore(knowledgeItems.length >= 5 || mediaItems.length >= 5 || quoteItems.length >= 5);

      // Check for errors
      if (knowledgeError || mediaError || quoteError) {
        console.error('Error fetching content:', { knowledgeError, mediaError, quoteError });
        setError('Failed to load some content');
      }

      // Fetch user interactions if logged in
      if (user) {
        fetchUserInteractions();
      }
    } catch (err) {
      console.error('Error in content feed:', err);
      setError('Failed to load content feed');
    } finally {
      setIsLoading(false);
    }
  }, [page, user]);

  const fetchUserInteractions = async () => {
    if (!user) return;
    
    try {
      // Fetch user likes
      const { data: likesData, error: likesError } = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', user.id);

      // Fetch user bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', user.id);

      if (likesError) {
        console.error('Error fetching user likes:', likesError);
      } else if (likesData) {
        setUserLikes(likesData.map(item => item.content_id));
      }

      if (bookmarksError) {
        console.error('Error fetching user bookmarks:', bookmarksError);
      } else if (bookmarksData) {
        setUserBookmarks(bookmarksData.map(item => item.content_id));
      }
    } catch (err) {
      console.error('Error fetching user interactions:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchContentData();
  }, [fetchContentData]);

  // Refetch when user auth changes
  useEffect(() => {
    if (user) {
      fetchUserInteractions();
    } else {
      setUserLikes([]);
      setUserBookmarks([]);
    }
  }, [user]);

  // Load more content
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Refresh content
  const refetch = () => {
    setPage(0);
    fetchContentData();
  };

  // Handle like action
  const handleLike = async (contentId: string, contentType: string) => {
    if (!user) {
      setError('You must be logged in to like content');
      return;
    }

    try {
      // Optimistically update UI
      const isLiked = userLikes.includes(contentId);
      
      if (isLiked) {
        // Remove like from UI
        setUserLikes(prev => prev.filter(id => id !== contentId));
        setFeedItems(prev => prev.map(item => 
          item.id === contentId 
            ? { 
                ...item, 
                likes: (item.likes || 0) - 1 
              }
            : item
        ));
        
        // Remove like from database
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id);
          
        // Decrement counter in DB
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: determineTableName(contentType)
        });
      } else {
        // Add like to UI
        setUserLikes(prev => [...prev, contentId]);
        setFeedItems(prev => prev.map(item => 
          item.id === contentId 
            ? { 
                ...item, 
                likes: (item.likes || 0) + 1 
              }
            : item
        ));
        
        // Add like to database
        await supabase
          .from('content_likes')
          .insert({
            content_id: contentId,
            content_type: contentType,
            user_id: user.id
          });
          
        // Increment counter in DB
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: determineTableName(contentType)
        });
      }
    } catch (err) {
      console.error('Error handling like:', err);
      // Revert optimistic update
      fetchContentData();
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  // Handle bookmark action
  const handleBookmark = async (contentId: string, contentType: string) => {
    if (!user) {
      setError('You must be logged in to bookmark content');
      return;
    }

    try {
      // Optimistically update UI
      const isBookmarked = userBookmarks.includes(contentId);
      
      if (isBookmarked) {
        // Remove bookmark from UI
        setUserBookmarks(prev => prev.filter(id => id !== contentId));
        setFeedItems(prev => prev.map(item => 
          item.id === contentId && typeof item.bookmarks !== 'undefined'
            ? { 
                ...item, 
                bookmarks: (item.bookmarks || 0) - 1 
              }
            : item
        ));
        
        // Remove bookmark from database
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id);
          
        // Decrement counter for quotes
        if (contentType === 'quotes') {
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
        }
      } else {
        // Add bookmark to UI
        setUserBookmarks(prev => [...prev, contentId]);
        setFeedItems(prev => prev.map(item => 
          item.id === contentId && typeof item.bookmarks !== 'undefined'
            ? { 
                ...item, 
                bookmarks: (item.bookmarks || 0) + 1 
              }
            : item
        ));
        
        // Add bookmark to database
        await supabase
          .from('content_bookmarks')
          .insert({
            content_id: contentId,
            content_type: contentType,
            user_id: user.id
          });
          
        // Increment counter for quotes
        if (contentType === 'quotes') {
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
        }
      }
    } catch (err) {
      console.error('Error handling bookmark:', err);
      // Revert optimistic update
      fetchContentData();
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    }
  };

  // Helper function to determine table name
  const determineTableName = (contentType: string): string => {
    switch (contentType) {
      case 'knowledge':
        return 'knowledge_entries';
      case 'media':
        return 'media_posts';
      case 'quotes':
        return 'quotes';
      case 'ai':
        return 'knowledge_entries';
      default:
        return 'knowledge_entries';
    }
  };

  // Handle content click
  const handleContentClick = (contentId: string, contentType: string) => {
    // Navigate to content detail page
    let path = '';
    
    switch (contentType) {
      case 'knowledge':
        path = `/knowledge/${contentId}`;
        break;
      case 'media':
        path = `/media/${contentId}`;
        break;
      case 'quotes':
        path = `/quotes/${contentId}`;
        break;
      case 'ai':
        path = `/ai-content/${contentId}`;
        break;
      default:
        console.warn(`No path defined for content type: ${contentType}`);
        return;
    }
    
    // Use this for navigation - will be implemented by the app
    window.location.href = path;
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
