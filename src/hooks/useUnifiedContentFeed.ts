import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { ContentType, UnifiedContentItem, ContentFeedState } from '@/types/unified-content-types';
import { useToast } from '@/hooks/use-toast';

interface UseUnifiedContentFeedOptions {
  contentType?: ContentType;
  limit?: number;
}

interface UseUnifiedContentFeedReturn extends ContentFeedState {
  loadMore: () => void;
  refetch: () => void;
  userInteractions: Record<string, boolean>;
  handleLike: (id: string, type: ContentType) => Promise<void>;
  handleBookmark: (id: string, type: ContentType) => Promise<void>;
}

export const useUnifiedContentFeed = (options: UseUnifiedContentFeedOptions = {}): UseUnifiedContentFeedReturn => {
  const { contentType = ContentType.All, limit = 20 } = options;
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<ContentFeedState>({
    items: [],
    isLoading: true,
    error: null,
    hasMore: true,
    page: 0
  });
  
  const [userInteractions, setUserInteractions] = useState<Record<string, boolean>>({});

  const fetchContent = useCallback(async (reset = false) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const currentPage = reset ? 0 : state.page;
      const offset = currentPage * limit;
      
      // Fetch quotes with explicit join to profiles table
      const { data: quotes, error: quotesError } = await supabase
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
          user_id,
          profiles!inner (
            name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Fetch knowledge entries with explicit join to profiles table
      const { data: knowledge, error: knowledgeError } = await supabase
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
          user_id,
          profiles!inner (
            name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Fetch media posts with explicit join to profiles table
      const { data: media, error: mediaError } = await supabase
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
          user_id,
          profiles!inner (
            name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Fetch forum posts with explicit join to profiles table
      const { data: forum, error: forumError } = await supabase
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
          user_id,
          profiles!inner (
            name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (quotesError) console.error('Quotes error:', quotesError);
      if (knowledgeError) console.error('Knowledge error:', knowledgeError);
      if (mediaError) console.error('Media error:', mediaError);
      if (forumError) console.error('Forum error:', forumError);

      // Transform data to unified format with proper null safety
      const unifiedItems: UnifiedContentItem[] = [
        ...(quotes || []).map(quote => ({
          id: quote.id,
          type: ContentType.Quote,
          title: `"${quote.text.substring(0, 50)}..."`,
          summary: quote.text,
          content: quote.text,
          author: {
            name: Array.isArray(quote.profiles) ? quote.profiles[0]?.name : quote.profiles?.name || quote.author || 'Unknown',
            username: Array.isArray(quote.profiles) ? quote.profiles[0]?.username : quote.profiles?.username,
            avatar: Array.isArray(quote.profiles) ? quote.profiles[0]?.avatar_url : quote.profiles?.avatar_url
          },
          createdAt: quote.created_at,
          metrics: {
            likes: quote.likes,
            comments: quote.comments,
            bookmarks: quote.bookmarks
          },
          tags: quote.tags || []
        })),
        ...(knowledge || []).map(entry => ({
          id: entry.id,
          type: ContentType.Knowledge,
          title: entry.title,
          summary: entry.summary,
          author: {
            name: Array.isArray(entry.profiles) ? entry.profiles[0]?.name : entry.profiles?.name || 'Unknown',
            username: Array.isArray(entry.profiles) ? entry.profiles[0]?.username : entry.profiles?.username,
            avatar: Array.isArray(entry.profiles) ? entry.profiles[0]?.avatar_url : entry.profiles?.avatar_url
          },
          createdAt: entry.created_at,
          metrics: {
            likes: entry.likes,
            comments: entry.comments,
            views: entry.views
          },
          tags: entry.categories || [],
          coverImage: entry.cover_image
        })),
        ...(media || []).map(post => ({
          id: post.id,
          type: ContentType.Media,
          title: post.title,
          summary: post.content,
          author: {
            name: Array.isArray(post.profiles) ? post.profiles[0]?.name : post.profiles?.name || 'Unknown',
            username: Array.isArray(post.profiles) ? post.profiles[0]?.username : post.profiles?.username,
            avatar: Array.isArray(post.profiles) ? post.profiles[0]?.avatar_url : post.profiles?.avatar_url
          },
          createdAt: post.created_at,
          metrics: {
            likes: post.likes,
            comments: post.comments,
            views: post.views
          },
          mediaUrl: post.url,
          mediaType: post.type as any
        })),
        ...(forum || []).map(post => ({
          id: post.id,
          type: ContentType.Forum,
          title: post.title,
          summary: post.content?.substring(0, 200) + '...',
          author: {
            name: Array.isArray(post.profiles) ? post.profiles[0]?.name : post.profiles?.name || 'Unknown',
            username: Array.isArray(post.profiles) ? post.profiles[0]?.username : post.profiles?.username,
            avatar: Array.isArray(post.profiles) ? post.profiles[0]?.avatar_url : post.profiles?.avatar_url
          },
          createdAt: post.created_at,
          metrics: {
            likes: post.upvotes,
            comments: post.comments,
            views: post.views
          },
          tags: post.tags || []
        }))
      ];

      // Sort by creation date
      unifiedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setState(prev => ({
        ...prev,
        items: reset ? unifiedItems : [...prev.items, ...unifiedItems],
        page: currentPage + 1,
        hasMore: unifiedItems.length === limit,
        isLoading: false
      }));

      // Load user interactions if user is logged in
      if (user && unifiedItems.length > 0) {
        await loadUserInteractions(unifiedItems);
      }

    } catch (error) {
      console.error('Error fetching content:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load content',
        isLoading: false
      }));
    }
  }, [state.page, limit, user]);

  const loadUserInteractions = useCallback(async (items: UnifiedContentItem[]) => {
    if (!user) return;

    try {
      const interactions: Record<string, boolean> = {};
      
      // Check likes for each content type
      for (const item of items) {
        const stateKey = `${item.type}:${item.id}`;
        
        if (item.type === ContentType.Quote) {
          const { data: likes } = await supabase
            .from('quote_likes')
            .select('id')
            .eq('quote_id', item.id)
            .eq('user_id', user.id)
            .single();
          
          const { data: bookmarks } = await supabase
            .from('quote_bookmarks')
            .select('id')
            .eq('quote_id', item.id)
            .eq('user_id', user.id)
            .single();
          
          interactions[`like_${stateKey}`] = !!likes;
          interactions[`bookmark_${stateKey}`] = !!bookmarks;
        } else {
          const { data: likes } = await supabase
            .from('content_likes')
            .select('id')
            .eq('content_id', item.id)
            .eq('user_id', user.id)
            .eq('content_type', item.type)
            .single();
          
          const { data: bookmarks } = await supabase
            .from('content_bookmarks')
            .select('id')
            .eq('content_id', item.id)
            .eq('user_id', user.id)
            .eq('content_type', item.type)
            .single();
          
          interactions[`like_${stateKey}`] = !!likes;
          interactions[`bookmark_${stateKey}`] = !!bookmarks;
        }
      }
      
      setUserInteractions(prev => ({ ...prev, ...interactions }));
    } catch (error) {
      console.error('Error loading user interactions:', error);
    }
  }, [user]);

  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      fetchContent(false);
    }
  }, [fetchContent, state.isLoading, state.hasMore]);

  const refetch = useCallback(() => {
    setState(prev => ({ ...prev, page: 0 }));
    fetchContent(true);
  }, [fetchContent]);

  const handleLike = useCallback(async (id: string, type: ContentType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return;
    }

    try {
      const stateKey = `${type}:${id}`;
      const isLiked = userInteractions[`like_${stateKey}`];
      
      // Optimistic update
      setUserInteractions(prev => ({
        ...prev,
        [`like_${stateKey}`]: !isLiked
      }));

      if (type === ContentType.Quote) {
        if (isLiked) {
          await supabase.from('quote_likes').delete().eq('quote_id', id).eq('user_id', user.id);
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: 'likes',
            table_name: 'quotes'
          });
        } else {
          await supabase.from('quote_likes').insert({ quote_id: id, user_id: user.id });
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: 'likes',
            table_name: 'quotes'
          });
        }
      } else {
        if (isLiked) {
          await supabase.from('content_likes').delete()
            .eq('content_id', id)
            .eq('user_id', user.id)
            .eq('content_type', type);
        } else {
          await supabase.from('content_likes').insert({
            content_id: id,
            user_id: user.id,
            content_type: type
          });
        }
      }

    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  }, [user, userInteractions, toast]);

  const handleBookmark = useCallback(async (id: string, type: ContentType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "destructive"
      });
      return;
    }

    try {
      const stateKey = `${type}:${id}`;
      const isBookmarked = userInteractions[`bookmark_${stateKey}`];
      
      // Optimistic update
      setUserInteractions(prev => ({
        ...prev,
        [`bookmark_${stateKey}`]: !isBookmarked
      }));

      if (type === ContentType.Quote) {
        if (isBookmarked) {
          await supabase.from('quote_bookmarks').delete().eq('quote_id', id).eq('user_id', user.id);
        } else {
          await supabase.from('quote_bookmarks').insert({ quote_id: id, user_id: user.id });
        }
      } else {
        if (isBookmarked) {
          await supabase.from('content_bookmarks').delete()
            .eq('content_id', id)
            .eq('user_id', user.id)
            .eq('content_type', type);
        } else {
          await supabase.from('content_bookmarks').insert({
            content_id: id,
            user_id: user.id,
            content_type: type
          });
        }
      }

    } catch (error) {
      console.error('Error handling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    }
  }, [user, userInteractions, toast]);

  useEffect(() => {
    fetchContent(true);
  }, []);

  return {
    ...state,
    loadMore,
    refetch,
    userInteractions,
    handleLike,
    handleBookmark
  };
};
