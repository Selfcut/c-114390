
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType, ContentViewMode, UnifiedContentItem } from '@/types/unified-content-types';
import { useAuth } from '@/lib/auth';
import { checkUserContentInteractions } from '@/lib/utils/interactions/user-interactions-check';
import { toggleUserInteraction } from '@/lib/utils/interactions/toggle-interactions';

export const useUnifiedContentFeed = (
  contentType: ContentType = ContentType.All,
  viewMode: ContentViewMode = 'list',
  limit: number = 20
) => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<UnifiedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        profiles (id, name, username, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map((quote: any) => ({
      id: quote.id,
      type: ContentType.Quote,
      title: quote.text.length > 50 ? quote.text.substring(0, 50) + '...' : quote.text,
      content: quote.text,
      author: {
        id: quote.profiles?.id || quote.user_id || 'unknown',
        name: quote.profiles?.name || quote.author || 'Unknown',
        username: quote.profiles?.username || 'unknown',
        avatar: quote.profiles?.avatar_url
      },
      createdAt: new Date(quote.created_at),
      metrics: {
        likes: quote.likes || 0,
        comments: quote.comments || 0,
        views: 0,
        bookmarks: quote.bookmarks || 0
      },
      tags: quote.tags || [],
      viewMode,
      categories: [quote.category]
    }));
  };

  const fetchForumPosts = async () => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        profiles (id, name, username, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map((post: any) => ({
      id: post.id,
      type: ContentType.Forum,
      title: post.title,
      content: post.content,
      summary: post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content,
      author: {
        id: post.profiles?.id || post.user_id || 'unknown',
        name: post.profiles?.name || 'User',
        username: post.profiles?.username || 'user',
        avatar: post.profiles?.avatar_url
      },
      createdAt: new Date(post.created_at),
      metrics: {
        likes: post.upvotes || 0,
        comments: post.comments || 0,
        views: post.views || 0,
        upvotes: post.upvotes || 0
      },
      tags: post.tags || [],
      viewMode
    }));
  };

  const fetchMediaPosts = async () => {
    const { data, error } = await supabase
      .from('media_posts')
      .select(`
        *,
        profiles (id, name, username, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map((media: any) => ({
      id: media.id,
      type: ContentType.Media,
      title: media.title,
      content: media.content,
      author: {
        id: media.profiles?.id || media.user_id || 'unknown',
        name: media.profiles?.name || 'User',
        username: media.profiles?.username || 'user',
        avatar: media.profiles?.avatar_url
      },
      createdAt: new Date(media.created_at),
      metrics: {
        likes: media.likes || 0,
        comments: media.comments || 0,
        views: media.views || 0
      },
      mediaUrl: media.url,
      mediaType: media.type as 'image' | 'video' | 'youtube' | 'document' | 'text',
      viewMode
    }));
  };

  const fetchKnowledgeEntries = async () => {
    const { data, error } = await supabase
      .from('knowledge_entries')
      .select(`
        *,
        profiles (id, name, username, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map((entry: any) => ({
      id: entry.id,
      type: ContentType.Knowledge,
      title: entry.title,
      summary: entry.summary,
      content: entry.content,
      author: {
        id: entry.profiles?.id || entry.user_id || 'unknown',
        name: entry.profiles?.name || 'User',
        username: entry.profiles?.username || 'user',
        avatar: entry.profiles?.avatar_url
      },
      createdAt: new Date(entry.created_at),
      metrics: {
        likes: entry.likes || 0,
        comments: entry.comments || 0,
        views: entry.views || 0
      },
      coverImage: entry.cover_image,
      categories: entry.categories || [],
      viewMode
    }));
  };

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let items: UnifiedContentItem[] = [];

      switch (contentType) {
        case ContentType.Quote:
          items = await fetchQuotes();
          break;
        case ContentType.Forum:
          items = await fetchForumPosts();
          break;
        case ContentType.Media:
          items = await fetchMediaPosts();
          break;
        case ContentType.Knowledge:
          items = await fetchKnowledgeEntries();
          break;
        case ContentType.All:
          const [quotes, forum, media, knowledge] = await Promise.all([
            fetchQuotes(),
            fetchForumPosts(),
            fetchMediaPosts(),
            fetchKnowledgeEntries()
          ]);
          items = [...quotes, ...forum, ...media, ...knowledge]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          items = await fetchQuotes();
      }

      setFeedItems(items);
      
      // Check user interactions if items exist and user is authenticated
      if (items.length > 0 && user) {
        const interactions = await checkUserContentInteractions(user.id, items.map(item => item.id));
        setUserLikes(interactions.likes);
        setUserBookmarks(interactions.bookmarks);
      }

    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }, [contentType, viewMode, limit, user]);

  const handleLike = useCallback(async (contentId: string, contentType: ContentType) => {
    if (!user) return;

    try {
      const stateKey = `${contentType}:${contentId}`;
      const newLikedState = await toggleUserInteraction('like', user.id, contentId, contentType);
      
      setUserLikes(prev => ({ ...prev, [stateKey]: newLikedState }));
      
      // Update the feed item metrics
      setFeedItems(prev => prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              metrics: { 
                ...item.metrics, 
                likes: (item.metrics.likes || 0) + (newLikedState ? 1 : -1) 
              } 
            }
          : item
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [user]);

  const handleBookmark = useCallback(async (contentId: string, contentType: ContentType) => {
    if (!user) return;

    try {
      const stateKey = `${contentType}:${contentId}`;
      const newBookmarkedState = await toggleUserInteraction('bookmark', user.id, contentId, contentType);
      
      setUserBookmarks(prev => ({ ...prev, [stateKey]: newBookmarkedState }));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, [user]);

  const handleContentClick = useCallback((contentId: string, contentType: ContentType) => {
    // Navigate to content detail page based on type
    switch (contentType) {
      case ContentType.Quote:
        window.location.href = `/quotes/${contentId}`;
        break;
      case ContentType.Forum:
        window.location.href = `/forum/${contentId}`;
        break;
      case ContentType.Media:
        window.location.href = `/media/${contentId}`;
        break;
      case ContentType.Knowledge:
        window.location.href = `/knowledge/${contentId}`;
        break;
      case ContentType.Wiki:
        window.location.href = `/wiki/${contentId}`;
        break;
    }
  }, []);

  const loadMore = useCallback(() => {
    // TODO: Implement pagination
    console.log('Load more items');
  }, []);

  const refetch = useCallback(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    fetchContent();
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
