
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useContentInteractions } from './useContentInteractions';
import { ContentItemType } from '@/types/contentTypes';
import { useNavigate } from 'react-router-dom';

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

interface UseContentFeedReturn {
  feedItems: ContentFeedItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (id: string, type: ContentItemType) => Promise<void>;
  handleBookmark: (id: string, type: ContentItemType) => Promise<void>;
  handleContentClick: (id: string, type: ContentItemType) => void;
}

export const useContentFeed = (): UseContentFeedReturn => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const {
    userLikes,
    userBookmarks,
    handleLike: handleLikeInteraction,
    handleBookmark: handleBookmarkInteraction,
    checkUserInteractions
  } = useContentInteractions({ userId: user?.id });

  // Fetch content from multiple tables
  const fetchContent = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentOffset = reset ? 0 : offset;
      
      // Fetch from multiple content tables - we'll get profile data separately
      const [quotesResult, knowledgeResult, mediaResult, forumResult] = await Promise.all([
        // Quotes
        supabase
          .from('quotes')
          .select(`
            id,
            text,
            author,
            category,
            tags,
            likes,
            comments,
            bookmarks,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
          .range(currentOffset, currentOffset + limit - 1),

        // Knowledge entries
        supabase
          .from('knowledge_entries')
          .select(`
            id,
            title,
            summary,
            categories,
            likes,
            comments,
            views,
            cover_image,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
          .range(currentOffset, currentOffset + limit - 1),

        // Media posts
        supabase
          .from('media_posts')
          .select(`
            id,
            title,
            content,
            type,
            url,
            likes,
            comments,
            views,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
          .range(currentOffset, currentOffset + limit - 1),

        // Forum posts
        supabase
          .from('forum_posts')
          .select(`
            id,
            title,
            content,
            tags,
            upvotes,
            comments,
            views,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false })
          .range(currentOffset, currentOffset + limit - 1)
      ]);

      // Get all unique user IDs from the results
      const allUserIds = [
        ...(quotesResult.data || []).map(item => item.user_id),
        ...(knowledgeResult.data || []).map(item => item.user_id),
        ...(mediaResult.data || []).map(item => item.user_id),
        ...(forumResult.data || []).map(item => item.user_id)
      ].filter((id, index, array) => array.indexOf(id) === index && id);

      // Fetch profile data for all users
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url')
        .in('id', allUserIds);

      // Create a map for quick profile lookup
      const profilesMap = new Map();
      (profilesData || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Transform data to unified format
      const unifiedItems: ContentFeedItem[] = [
        // Quotes
        ...(quotesResult.data || []).map(quote => {
          const profile = profilesMap.get(quote.user_id);
          return {
            id: quote.id,
            type: ContentItemType.Quote,
            title: `"${quote.text.substring(0, 50)}..."`,
            summary: quote.text,
            content: quote.text,
            author: {
              name: profile?.name || quote.author || 'Unknown',
              username: profile?.username,
              avatar: profile?.avatar_url
            },
            createdAt: quote.created_at,
            metrics: {
              likes: quote.likes,
              comments: quote.comments,
              bookmarks: quote.bookmarks
            },
            tags: quote.tags || []
          };
        }),

        // Knowledge entries
        ...(knowledgeResult.data || []).map(entry => {
          const profile = profilesMap.get(entry.user_id);
          return {
            id: entry.id,
            type: ContentItemType.Knowledge,
            title: entry.title,
            summary: entry.summary,
            author: {
              name: profile?.name || 'Unknown',
              username: profile?.username,
              avatar: profile?.avatar_url
            },
            createdAt: entry.created_at,
            metrics: {
              likes: entry.likes,
              comments: entry.comments,
              views: entry.views
            },
            tags: entry.categories || [],
            coverImage: entry.cover_image
          };
        }),

        // Media posts
        ...(mediaResult.data || []).map(media => {
          const profile = profilesMap.get(media.user_id);
          return {
            id: media.id,
            type: ContentItemType.Media,
            title: media.title,
            summary: media.content,
            author: {
              name: profile?.name || 'Unknown',
              username: profile?.username,
              avatar: profile?.avatar_url
            },
            createdAt: media.created_at,
            metrics: {
              likes: media.likes,
              comments: media.comments,
              views: media.views
            },
            mediaUrl: media.url,
            mediaType: media.type as any
          };
        }),

        // Forum posts
        ...(forumResult.data || []).map(post => {
          const profile = profilesMap.get(post.user_id);
          return {
            id: post.id,
            type: ContentItemType.Forum,
            title: post.title,
            summary: post.content?.substring(0, 200) + '...',
            author: {
              name: profile?.name || 'Unknown',
              username: profile?.username,
              avatar: profile?.avatar_url
            },
            createdAt: post.created_at,
            metrics: {
              likes: post.upvotes,
              comments: post.comments,
              views: post.views
            },
            tags: post.tags || []
          };
        })
      ];

      // Sort by creation date
      unifiedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (reset) {
        setFeedItems(unifiedItems);
        setOffset(limit);
      } else {
        setFeedItems(prev => [...prev, ...unifiedItems]);
        setOffset(prev => prev + limit);
      }

      setHasMore(unifiedItems.length === limit);

      // Check user interactions for loaded items
      if (user?.id && unifiedItems.length > 0) {
        const itemIds = unifiedItems.map(item => item.id);
        await checkUserInteractions(itemIds);
      }

    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }, [offset, user?.id, checkUserInteractions]);

  // Initial load
  useEffect(() => {
    fetchContent(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchContent(false);
    }
  }, [fetchContent, isLoading, hasMore]);

  const refetch = useCallback(() => {
    setOffset(0);
    fetchContent(true);
  }, [fetchContent]);

  const handleLike = useCallback(async (id: string, type: ContentItemType) => {
    await handleLikeInteraction(id, type);
  }, [handleLikeInteraction]);

  const handleBookmark = useCallback(async (id: string, type: ContentItemType) => {
    await handleBookmarkInteraction(id, type);
  }, [handleBookmarkInteraction]);

  const handleContentClick = useCallback((id: string, type: ContentItemType) => {
    switch (type) {
      case ContentItemType.Knowledge:
        navigate(`/knowledge/${id}`);
        break;
      case ContentItemType.Media:
        navigate(`/media/${id}`);
        break;
      case ContentItemType.Quote:
        navigate(`/quotes/${id}`);
        break;
      case ContentItemType.Forum:
        navigate(`/forum/${id}`);
        break;
      default:
        navigate(`/content/${id}`);
    }
  }, [navigate]);

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
