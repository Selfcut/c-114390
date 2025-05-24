
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

      // Fetch quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
      }

      // Fetch forum posts (corrected table name)
      const { data: forumPosts, error: forumError } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (forumError) {
        console.error('Error fetching forum posts:', forumError);
      }

      const items: UnifiedContentItem[] = [];

      // Transform quotes
      if (quotes) {
        quotes.forEach(quote => {
          items.push({
            id: quote.id,
            type: ContentType.Quote,
            title: quote.text.substring(0, 50) + '...',
            content: quote.text,
            author: {
              name: quote.author || 'Unknown',
              username: quote.author || 'unknown'
            },
            createdAt: new Date(quote.created_at),
            metrics: {
              likes: quote.likes || 0,
              comments: quote.comments || 0,
              bookmarks: quote.bookmarks || 0,
              views: 0
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
            author: {
              name: 'User',
              username: 'user'
            },
            createdAt: new Date(post.created_at),
            metrics: {
              likes: post.upvotes || 0,
              comments: post.comments || 0,
              views: post.views || 0,
              upvotes: post.upvotes || 0
            },
            tags: post.tags || [],
            viewMode: viewMode,
            categories: []
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
