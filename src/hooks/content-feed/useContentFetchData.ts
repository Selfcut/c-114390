
import { useState, useEffect, useCallback } from 'react';
import { UnifiedContentItem, ContentViewMode } from '@/types/unified-content-types';
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
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch forum posts
      const { data: forumPosts } = await supabase
        .from('forum_discussions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const items: UnifiedContentItem[] = [];

      // Transform quotes
      if (quotes) {
        quotes.forEach(quote => {
          items.push({
            id: quote.id,
            type: 'quote',
            title: quote.text.substring(0, 50) + '...',
            content: quote.text,
            author: quote.author || 'Unknown',
            createdAt: quote.created_at,
            metadata: {
              category: quote.category,
              tags: quote.tags || []
            }
          });
        });
      }

      // Transform forum posts
      if (forumPosts) {
        forumPosts.forEach(post => {
          items.push({
            id: post.id,
            type: 'forum',
            title: post.title,
            content: post.content,
            author: post.author || 'Anonymous',
            createdAt: post.created_at,
            metadata: {
              category: post.category,
              tags: post.tags || []
            }
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
  }, [userId, checkUserInteractions]);

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
