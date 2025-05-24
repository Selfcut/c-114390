
import { useState, useEffect, useCallback } from 'react';
import { UnifiedContentItem, ContentViewMode, ContentType } from '@/types/unified-content-types';
import { supabase } from '@/integrations/supabase/client';

interface UseContentFetchDataProps {
  userId?: string;
  checkUserInteractions: (itemIds: string[]) => Promise<void>;
  viewMode: ContentViewMode;
}

export const useContentFetchData = ({
  userId,
  checkUserInteractions,
  viewMode
}: UseContentFetchDataProps) => {
  const [feedItems, setFeedItems] = useState<UnifiedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch quotes with profiles using proper foreign key reference
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles!inner(id, name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
      }

      // Fetch forum posts with profiles using proper foreign key reference
      const { data: forumPosts, error: forumError } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles!inner(id, name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (forumError) {
        console.error('Error fetching forum posts:', forumError);
      }

      // Fetch media posts with profiles using proper foreign key reference
      const { data: mediaPosts, error: mediaError } = await supabase
        .from('media_posts')
        .select(`
          *,
          profiles!inner(id, name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (mediaError) {
        console.error('Error fetching media posts:', mediaError);
      }

      // Fetch knowledge entries with profiles using proper foreign key reference
      const { data: knowledgeEntries, error: knowledgeError } = await supabase
        .from('knowledge_entries')
        .select(`
          *,
          profiles!inner(id, name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (knowledgeError) {
        console.error('Error fetching knowledge entries:', knowledgeError);
      }

      const items: UnifiedContentItem[] = [];

      // Transform quotes
      if (quotes) {
        quotes.forEach(quote => {
          items.push({
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
            viewMode: viewMode,
            categories: [quote.category]
          });
        });
      }

      // Transform forum posts
      if (forumPosts) {
        forumPosts.forEach(post => {
          items.push({
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
            viewMode: viewMode
          });
        });
      }

      // Transform media posts
      if (mediaPosts) {
        mediaPosts.forEach(media => {
          items.push({
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
            viewMode: viewMode
          });
        });
      }

      // Transform knowledge entries
      if (knowledgeEntries) {
        knowledgeEntries.forEach(entry => {
          items.push({
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
            viewMode: viewMode
          });
        });
      }

      // Sort by creation date
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFeedItems(items);
      
      // Check user interactions if items exist
      if (items.length > 0 && userId) {
        await checkUserInteractions(items.map(item => item.id));
      }

    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [userId, checkUserInteractions, viewMode]);

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
    isInitialLoad
  };
};
