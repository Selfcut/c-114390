
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType, UnifiedContentItem } from '@/types/unified-content-types';
import { useAuth } from '@/lib/auth';

interface ContentFetchOptions {
  contentType?: ContentType;
  limit?: number;
  offset?: number;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'most_liked';
  searchQuery?: string;
  category?: string;
  tags?: string[];
}

export const useContentFetchDataFixed = (options: ContentFetchOptions = {}) => {
  const { user } = useAuth();
  const [content, setContent] = useState<UnifiedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const {
    contentType = ContentType.All,
    limit = 20,
    offset = 0,
    sortBy = 'newest',
    searchQuery,
    category,
    tags
  } = options;

  const fetchQuotes = async (): Promise<UnifiedContentItem[]> => {
    let query = supabase
      .from('quotes')
      .select(`
        *,
        profiles!inner(id, username, name, avatar_url)
      `);

    if (searchQuery) {
      query = query.or(`text.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'most_liked':
        query = query.order('likes', { ascending: false });
        break;
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const quotes: UnifiedContentItem[] = (data || []).map((quote: any) => ({
      id: quote.id,
      type: ContentType.Quote,
      title: `Quote by ${quote.author}`,
      content: quote.text,
      author: {
        id: quote.profiles?.id || quote.user_id || 'unknown',
        name: quote.profiles?.name || quote.profiles?.username || 'Anonymous',
        avatar: quote.profiles?.avatar_url,
        username: quote.profiles?.username
      },
      createdAt: new Date(quote.created_at),
      metrics: {
        likes: quote.likes || 0,
        comments: quote.comments || 0,
        bookmarks: quote.bookmarks || 0,
        views: 0
      },
      tags: quote.tags || [],
      viewMode: 'grid'
    }));

    if (count !== null) {
      setTotalCount(count);
    }

    return quotes;
  };

  const fetchForumPosts = async (): Promise<UnifiedContentItem[]> => {
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        profiles!inner(id, username, name, avatar_url)
      `);

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'most_liked':
        query = query.order('upvotes', { ascending: false });
        break;
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const posts: UnifiedContentItem[] = (data || []).map((post: any) => ({
      id: post.id,
      type: ContentType.Forum,
      title: post.title,
      content: post.content,
      summary: post.content.substring(0, 200) + '...',
      author: {
        id: post.profiles?.id || post.user_id || 'unknown',
        name: post.profiles?.name || post.profiles?.username || 'Anonymous',
        avatar: post.profiles?.avatar_url,
        username: post.profiles?.username
      },
      createdAt: new Date(post.created_at),
      metrics: {
        upvotes: post.upvotes || 0,
        comments: post.comments || 0,
        views: post.views || 0,
        likes: post.upvotes || 0
      },
      tags: post.tags || [],
      viewMode: 'list'
    }));

    if (count !== null) {
      setTotalCount(count);
    }

    return posts;
  };

  const fetchMediaPosts = async (): Promise<UnifiedContentItem[]> => {
    let query = supabase
      .from('media_posts')
      .select(`
        *,
        profiles!inner(id, username, name, avatar_url)
      `);

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'most_liked':
        query = query.order('likes', { ascending: false });
        break;
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const posts: UnifiedContentItem[] = (data || []).map((post: any) => ({
      id: post.id,
      type: ContentType.Media,
      title: post.title,
      content: post.content,
      author: {
        id: post.profiles?.id || post.user_id || 'unknown',
        name: post.profiles?.name || post.profiles?.username || 'Anonymous',
        avatar: post.profiles?.avatar_url,
        username: post.profiles?.username
      },
      createdAt: new Date(post.created_at),
      metrics: {
        likes: post.likes || 0,
        comments: post.comments || 0,
        views: post.views || 0
      },
      viewMode: 'grid',
      mediaUrl: post.url,
      mediaType: post.type
    }));

    if (count !== null) {
      setTotalCount(count);
    }

    return posts;
  };

  const fetchKnowledgeEntries = async (): Promise<UnifiedContentItem[]> => {
    let query = supabase
      .from('knowledge_entries')
      .select(`
        *,
        profiles!inner(id, username, name, avatar_url)
      `);

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    if (category) {
      query = query.contains('categories', [category]);
    }

    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'most_liked':
        query = query.order('likes', { ascending: false });
        break;
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const entries: UnifiedContentItem[] = (data || []).map((entry: any) => ({
      id: entry.id,
      type: ContentType.Knowledge,
      title: entry.title,
      content: entry.content,
      summary: entry.summary,
      author: {
        id: entry.profiles?.id || entry.user_id || 'unknown',
        name: entry.profiles?.name || entry.profiles?.username || 'Anonymous',
        avatar: entry.profiles?.avatar_url,
        username: entry.profiles?.username
      },
      createdAt: new Date(entry.created_at),
      metrics: {
        likes: entry.likes || 0,
        comments: entry.comments || 0,
        views: entry.views || 0
      },
      categories: entry.categories || [],
      viewMode: 'list',
      coverImage: entry.cover_image
    }));

    if (count !== null) {
      setTotalCount(count);
    }

    return entries;
  };

  const fetchContent = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      let fetchedContent: UnifiedContentItem[] = [];

      switch (contentType) {
        case ContentType.Quote:
          fetchedContent = await fetchQuotes();
          break;
        case ContentType.Forum:
          fetchedContent = await fetchForumPosts();
          break;
        case ContentType.Media:
          fetchedContent = await fetchMediaPosts();
          break;
        case ContentType.Knowledge:
          fetchedContent = await fetchKnowledgeEntries();
          break;
        case ContentType.All:
          // Fetch from all content types and merge
          const [quotes, forum, media, knowledge] = await Promise.all([
            fetchQuotes(),
            fetchForumPosts(),
            fetchMediaPosts(),
            fetchKnowledgeEntries()
          ]);
          fetchedContent = [...quotes, ...forum, ...media, ...knowledge];
          // Sort by creation date for mixed content
          fetchedContent.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        default:
          fetchedContent = await fetchQuotes();
      }

      if (offset === 0) {
        setContent(fetchedContent);
      } else {
        setContent(prev => [...prev, ...fetchedContent]);
      }

      setHasMore(fetchedContent.length === limit);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setContent([]);
    setHasMore(true);
    setTotalCount(0);
    fetchContent();
  }, [contentType, searchQuery, category, sortBy, JSON.stringify(tags)]);

  const refetch = () => {
    setContent([]);
    setHasMore(true);
    setTotalCount(0);
    fetchContent();
  };

  return {
    content,
    isLoading,
    error,
    hasMore,
    totalCount,
    refetch,
    loadMore: () => {
      if (!isLoading && hasMore) {
        fetchContent();
      }
    }
  };
};
