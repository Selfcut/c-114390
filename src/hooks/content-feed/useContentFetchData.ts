
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

      // Fetch quotes with profiles using proper join syntax
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          profiles (id, name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
      }

      // Fetch forum posts with profiles using proper join syntax
      const { data: forumPosts, error: forumError } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles (id, name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (forumError) {
        console.error('Error fetching forum posts:', forumError);
      }

      // Fetch media posts with profiles using proper join syntax
      const { data: mediaPosts, error: mediaError } = await supabase
        .from('media_posts')
        .select(`
          *,
          profiles (id, name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (mediaError) {
        console.error('Error fetching media posts:', mediaError);
      }

      // Fetch knowledge entries with profiles using proper join syntax
      const { data: knowledgeEntries, error: knowledgeError } = await supabase
        .from('knowledge_entries')
        .select(`
          *,
          profiles (id, name, username, avatar_url)
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
          // Safely access profile data - it could be null if no profile exists
          const profile = Array.isArray(quote.profiles) ? quote.profiles[0] : quote.profiles;
          
          items.push({
            id: quote.id,
            type: ContentType.Quote,
            title: quote.text.length > 50 ? quote.text.substring(0, 50) + '...' : quote.text,
            content: quote.text,
            author: {
              id: profile?.id || quote.user_id || 'unknown',
              name: profile?.name || quote.author || 'Unknown',
              username: profile?.username || 'unknown',
              avatar: profile?.avatar_url
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
          const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
          
          items.push({
            id: post.id,
            type: ContentType.Forum,
            title: post.title,
            content: post.content,
            summary: post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content,
            author: {
              id: profile?.id || post.user_id || 'unknown',
              name: profile?.name || 'User',
              username: profile?.username || 'user',
              avatar: profile?.avatar_url
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
          const profile = Array.isArray(media.profiles) ? media.profiles[0] : media.profiles;
          
          items.push({
            id: media.id,
            type: ContentType.Media,
            title: media.title,
            content: media.content,
            author: {
              id: profile?.id || media.user_id || 'unknown',
              name: profile?.name || 'User',
              username: profile?.username || 'user',
              avatar: profile?.avatar_url
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
          const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
          
          items.push({
            id: entry.id,
            type: ContentType.Knowledge,
            title: entry.title,
            summary: entry.summary,
            content: entry.content,
            author: {
              id: profile?.id || entry.user_id || 'unknown',
              name: profile?.name || 'User',
              username: profile?.username || 'user',
              avatar: profile?.avatar_url
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
