
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

  const fetchContentWithProfiles = useCallback(async (reset = false) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const currentPage = reset ? 0 : state.page;
      const offset = currentPage * limit;
      
      let allItems: UnifiedContentItem[] = [];

      // Filter content types to fetch
      const typesToFetch = contentType === ContentType.All 
        ? [ContentType.Quote, ContentType.Knowledge, ContentType.Media, ContentType.Forum]
        : [contentType];

      // Fetch each content type efficiently
      for (const type of typesToFetch) {
        let data: any[] = [];
        let error: any = null;

        switch (type) {
          case ContentType.Quote:
            const quotesResult = await supabase
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
                profiles!inner(name, username, avatar_url)
              `)
              .order('created_at', { ascending: false })
              .range(offset, offset + limit - 1);
            data = quotesResult.data || [];
            error = quotesResult.error;
            break;

          case ContentType.Knowledge:
            const knowledgeResult = await supabase
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
                profiles!inner(name, username, avatar_url)
              `)
              .order('created_at', { ascending: false })
              .range(offset, offset + limit - 1);
            data = knowledgeResult.data || [];
            error = knowledgeResult.error;
            break;

          case ContentType.Media:
            const mediaResult = await supabase
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
                profiles!inner(name, username, avatar_url)
              `)
              .order('created_at', { ascending: false })
              .range(offset, offset + limit - 1);
            data = mediaResult.data || [];
            error = mediaResult.error;
            break;

          case ContentType.Forum:
            const forumResult = await supabase
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
                profiles!inner(name, username, avatar_url)
              `)
              .order('created_at', { ascending: false })
              .range(offset, offset + limit - 1);
            data = forumResult.data || [];
            error = forumResult.error;
            break;
        }

        if (error) {
          console.error(`Error fetching ${type}:`, error);
          continue;
        }

        // Transform data to unified format
        const transformedItems = data.map(item => {
          const profile = item.profiles;
          const baseItem = {
            id: item.id,
            type: type,
            createdAt: item.created_at,
            author: {
              name: profile?.name || 'Unknown',
              username: profile?.username,
              avatar: profile?.avatar_url
            }
          };

          switch (type) {
            case ContentType.Quote:
              return {
                ...baseItem,
                title: `"${item.text.substring(0, 50)}..."`,
                summary: item.text,
                content: item.text,
                metrics: {
                  likes: item.likes,
                  comments: item.comments,
                  bookmarks: item.bookmarks
                },
                tags: item.tags || []
              };

            case ContentType.Knowledge:
              return {
                ...baseItem,
                title: item.title,
                summary: item.summary,
                metrics: {
                  likes: item.likes,
                  comments: item.comments,
                  views: item.views
                },
                tags: item.categories || [],
                coverImage: item.cover_image
              };

            case ContentType.Media:
              return {
                ...baseItem,
                title: item.title,
                summary: item.content,
                metrics: {
                  likes: item.likes,
                  comments: item.comments,
                  views: item.views
                },
                mediaUrl: item.url,
                mediaType: item.type as any
              };

            case ContentType.Forum:
              return {
                ...baseItem,
                title: item.title,
                summary: item.content?.substring(0, 200) + '...',
                metrics: {
                  likes: item.upvotes,
                  comments: item.comments,
                  views: item.views
                },
                tags: item.tags || []
              };

            default:
              return baseItem;
          }
        });

        allItems.push(...transformedItems);
      }

      // Sort by creation date
      allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setState(prev => ({
        ...prev,
        items: reset ? allItems : [...prev.items, ...allItems],
        page: currentPage + 1,
        hasMore: allItems.length === limit,
        isLoading: false
      }));

      // Load user interactions if user is logged in
      if (user && allItems.length > 0) {
        await loadUserInteractions(allItems);
      }

    } catch (error) {
      console.error('Error fetching content:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load content. Please try again.',
        isLoading: false
      }));
    }
  }, [contentType, limit, user, state.page]);

  const loadUserInteractions = useCallback(async (items: UnifiedContentItem[]) => {
    if (!user) return;

    try {
      const interactions: Record<string, boolean> = {};
      
      // Batch check interactions for each content type
      for (const item of items) {
        const stateKey = `${item.type}:${item.id}`;
        
        try {
          if (item.type === ContentType.Quote) {
            const [likesResult, bookmarksResult] = await Promise.all([
              supabase
                .from('quote_likes')
                .select('id')
                .eq('quote_id', item.id)
                .eq('user_id', user.id)
                .maybeSingle(),
              supabase
                .from('quote_bookmarks')
                .select('id')
                .eq('quote_id', item.id)
                .eq('user_id', user.id)
                .maybeSingle()
            ]);
            
            interactions[`like_${stateKey}`] = !!likesResult.data;
            interactions[`bookmark_${stateKey}`] = !!bookmarksResult.data;
          } else {
            const [likesResult, bookmarksResult] = await Promise.all([
              supabase
                .from('content_likes')
                .select('id')
                .eq('content_id', item.id)
                .eq('user_id', user.id)
                .eq('content_type', item.type)
                .maybeSingle(),
              supabase
                .from('content_bookmarks')
                .select('id')
                .eq('content_id', item.id)
                .eq('user_id', user.id)
                .eq('content_type', item.type)
                .maybeSingle()
            ]);
            
            interactions[`like_${stateKey}`] = !!likesResult.data;
            interactions[`bookmark_${stateKey}`] = !!bookmarksResult.data;
          }
        } catch (error) {
          console.error(`Error checking interactions for ${item.id}:`, error);
          interactions[`like_${stateKey}`] = false;
          interactions[`bookmark_${stateKey}`] = false;
        }
      }
      
      setUserInteractions(prev => ({ ...prev, ...interactions }));
    } catch (error) {
      console.error('Error loading user interactions:', error);
    }
  }, [user]);

  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      fetchContentWithProfiles(false);
    }
  }, [fetchContentWithProfiles, state.isLoading, state.hasMore]);

  const refetch = useCallback(() => {
    setState(prev => ({ ...prev, page: 0, items: [] }));
    fetchContentWithProfiles(true);
  }, [fetchContentWithProfiles]);

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
        const tableName = type === ContentType.Forum ? 'forum_posts' : 
                         type === ContentType.Media ? 'media_posts' : 
                         type === ContentType.Knowledge ? 'knowledge_entries' : 'forum_posts';
        const columnName = type === ContentType.Forum ? 'upvotes' : 'likes';

        if (isLiked) {
          await supabase.from('content_likes').delete()
            .eq('content_id', id)
            .eq('user_id', user.id)
            .eq('content_type', type);
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: columnName,
            table_name: tableName
          });
        } else {
          await supabase.from('content_likes').insert({
            content_id: id,
            user_id: user.id,
            content_type: type
          });
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: columnName,
            table_name: tableName
          });
        }
      }

    } catch (error) {
      console.error('Error handling like:', error);
      // Revert optimistic update
      const stateKey = `${type}:${id}`;
      const isLiked = userInteractions[`like_${stateKey}`];
      setUserInteractions(prev => ({
        ...prev,
        [`like_${stateKey}`]: !isLiked
      }));
      
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
          await supabase.rpc('decrement_counter_fn', {
            row_id: id,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
        } else {
          await supabase.from('quote_bookmarks').insert({ quote_id: id, user_id: user.id });
          await supabase.rpc('increment_counter_fn', {
            row_id: id,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
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
      // Revert optimistic update
      const stateKey = `${type}:${id}`;
      const isBookmarked = userInteractions[`bookmark_${stateKey}`];
      setUserInteractions(prev => ({
        ...prev,
        [`bookmark_${stateKey}`]: !isBookmarked
      }));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    }
  }, [user, userInteractions, toast]);

  useEffect(() => {
    fetchContentWithProfiles(true);
  }, [contentType, limit]);

  return {
    ...state,
    loadMore,
    refetch,
    userInteractions,
    handleLike,
    handleBookmark
  };
};
