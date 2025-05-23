
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ContentType, ContentViewMode, UnifiedContentItem, ContentFilters, ContentFeedState, UserInteractionState } from '@/types/unified-content-types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';

const ITEMS_PER_PAGE = 10;

// Define valid table names to ensure type safety
type ValidTableName = 'quotes' | 'knowledge_entries' | 'media_posts' | 'forum_posts' | 'wiki_articles' | 'research_papers';

export const useUnifiedContentFeed = (
  contentType: ContentType = 'all',
  viewMode: ContentViewMode = 'list'
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Feed state
  const [feedState, setFeedState] = useState<ContentFeedState>({
    items: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 0,
    totalCount: 0
  });

  // User interaction state
  const [userState, setUserState] = useState<UserInteractionState>({
    likes: {},
    bookmarks: {},
    loadingStates: {}
  });

  // Filters
  const [filters, setFilters] = useState<ContentFilters>({
    contentType,
    sortBy: 'newest'
  });

  // Helper function to normalize content type for database queries
  const getTableName = useCallback((type: ContentType): ValidTableName => {
    switch (type) {
      case 'quote': return 'quotes';
      case 'knowledge': return 'knowledge_entries';
      case 'media': return 'media_posts';
      case 'forum': return 'forum_posts';
      case 'wiki': return 'wiki_articles';
      case 'research': return 'research_papers';
      default: return 'quotes';
    }
  }, []);

  // Fetch content items with proper joins
  const fetchContentItems = useCallback(async (
    type: ContentType,
    page: number = 0,
    reset: boolean = false
  ): Promise<UnifiedContentItem[]> => {
    if (type === 'all') {
      // Fetch from multiple tables and combine
      const [quotes, knowledge, media] = await Promise.all([
        fetchSpecificContent('quote', page),
        fetchSpecificContent('knowledge', page),
        fetchSpecificContent('media', page)
      ]);
      
      return [...quotes, ...knowledge, ...media]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, ITEMS_PER_PAGE);
    } else {
      return fetchSpecificContent(type, page);
    }
  }, []);

  const fetchSpecificContent = useCallback(async (
    type: ContentType,
    page: number
  ): Promise<UnifiedContentItem[]> => {
    const tableName = getTableName(type);
    const offset = page * ITEMS_PER_PAGE;

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          *,
          profiles:user_id(name, avatar_url, username)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (error) throw error;

      return (data || []).map((item: any): UnifiedContentItem => ({
        id: item.id,
        type: type,
        title: item.title || item.author || 'Untitled',
        content: item.content || item.text,
        summary: item.summary,
        author: {
          name: item.profiles?.name || 'Unknown Author',
          avatar: item.profiles?.avatar_url,
          username: item.profiles?.username,
        },
        createdAt: new Date(item.created_at),
        metrics: {
          likes: item.likes || 0,
          comments: item.comments || 0,
          bookmarks: item.bookmarks || 0,
          views: item.views || 0,
          upvotes: item.upvotes || 0,
        },
        tags: item.tags || item.categories || [],
        viewMode,
        mediaUrl: item.url,
        mediaType: item.type,
        coverImage: item.cover_image || item.image_url,
        categories: item.categories
      }));
    } catch (error) {
      console.error(`Error fetching ${type} content:`, error);
      return [];
    }
  }, [getTableName, viewMode]);

  // Load more items
  const loadMore = useCallback(async () => {
    if (feedState.isLoading || !feedState.hasMore) return;

    setFeedState(prev => ({ ...prev, isLoading: true }));

    try {
      const newItems = await fetchContentItems(
        filters.contentType || 'all',
        feedState.page + 1
      );

      setFeedState(prev => ({
        ...prev,
        items: [...prev.items, ...newItems],
        page: prev.page + 1,
        hasMore: newItems.length === ITEMS_PER_PAGE,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error loading more items:', error);
      setFeedState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load more content'
      }));
    }
  }, [feedState.isLoading, feedState.hasMore, feedState.page, filters.contentType, fetchContentItems]);

  // Refresh feed
  const refetch = useCallback(async () => {
    setFeedState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      page: 0 
    }));

    try {
      const items = await fetchContentItems(filters.contentType || 'all', 0, true);
      
      setFeedState({
        items,
        isLoading: false,
        error: null,
        hasMore: items.length === ITEMS_PER_PAGE,
        page: 0,
        totalCount: items.length
      });

      // Fetch user interactions for the new items
      if (user && items.length > 0) {
        await fetchUserInteractions(items.map(item => item.id));
      }
    } catch (error) {
      console.error('Error refetching content:', error);
      setFeedState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load content'
      }));
    }
  }, [filters.contentType, fetchContentItems, user]);

  // Fetch user interactions
  const fetchUserInteractions = useCallback(async (itemIds: string[]) => {
    if (!user || itemIds.length === 0) return;

    try {
      // Fetch likes and bookmarks in parallel
      const [likesData, bookmarksData] = await Promise.all([
        supabase
          .from('content_likes')
          .select('content_id')
          .in('content_id', itemIds)
          .eq('user_id', user.id),
        supabase
          .from('content_bookmarks')
          .select('content_id')
          .in('content_id', itemIds)
          .eq('user_id', user.id)
      ]);

      const likes = likesData.data?.reduce((acc, like) => {
        acc[like.content_id] = true;
        return acc;
      }, {} as Record<string, boolean>) || {};

      const bookmarks = bookmarksData.data?.reduce((acc, bookmark) => {
        acc[bookmark.content_id] = true;
        return acc;
      }, {} as Record<string, boolean>) || {};

      setUserState(prev => ({
        ...prev,
        likes: { ...prev.likes, ...likes },
        bookmarks: { ...prev.bookmarks, ...bookmarks }
      }));
    } catch (error) {
      console.error('Error fetching user interactions:', error);
    }
  }, [user]);

  // Handle like toggle
  const handleLike = useCallback(async (itemId: string, itemType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return;
    }

    const isCurrentlyLiked = userState.likes[itemId];
    
    // Optimistic update
    setUserState(prev => ({
      ...prev,
      likes: { ...prev.likes, [itemId]: !isCurrentlyLiked },
      loadingStates: {
        ...prev.loadingStates,
        [itemId]: { ...prev.loadingStates[itemId], isLikeLoading: true }
      }
    }));

    try {
      if (isCurrentlyLiked) {
        // Remove like
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', itemId)
          .eq('user_id', user.id);
      } else {
        // Add like
        await supabase
          .from('content_likes')
          .insert({
            content_id: itemId,
            user_id: user.id,
            content_type: itemType.toString().toLowerCase()
          });
      }

      // Update counter in appropriate table
      const tableName = getTableName(itemType.toString().toLowerCase() as ContentType);
      await supabase.rpc(
        isCurrentlyLiked ? 'decrement_counter_fn' : 'increment_counter_fn',
        {
          row_id: itemId,
          column_name: 'likes',
          table_name: tableName
        }
      );

    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update
      setUserState(prev => ({
        ...prev,
        likes: { ...prev.likes, [itemId]: isCurrentlyLiked }
      }));
      
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setUserState(prev => ({
        ...prev,
        loadingStates: {
          ...prev.loadingStates,
          [itemId]: { ...prev.loadingStates[itemId], isLikeLoading: false }
        }
      }));
    }
  }, [user, userState.likes, getTableName, toast]);

  // Handle bookmark toggle
  const handleBookmark = useCallback(async (itemId: string, itemType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required", 
        description: "Please sign in to bookmark content",
        variant: "destructive"
      });
      return;
    }

    const isCurrentlyBookmarked = userState.bookmarks[itemId];
    
    // Optimistic update
    setUserState(prev => ({
      ...prev,
      bookmarks: { ...prev.bookmarks, [itemId]: !isCurrentlyBookmarked },
      loadingStates: {
        ...prev.loadingStates,
        [itemId]: { ...prev.loadingStates[itemId], isBookmarkLoading: true }
      }
    }));

    try {
      if (isCurrentlyBookmarked) {
        // Remove bookmark
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', itemId)
          .eq('user_id', user.id);
      } else {
        // Add bookmark
        await supabase
          .from('content_bookmarks')
          .insert({
            content_id: itemId,
            user_id: user.id,
            content_type: itemType.toString().toLowerCase()
          });
      }

    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert optimistic update
      setUserState(prev => ({
        ...prev,
        bookmarks: { ...prev.bookmarks, [itemId]: isCurrentlyBookmarked }
      }));
      
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    } finally {
      setUserState(prev => ({
        ...prev,
        loadingStates: {
          ...prev.loadingStates,
          [itemId]: { ...prev.loadingStates[itemId], isBookmarkLoading: false }
        }
      }));
    }
  }, [user, userState.bookmarks, toast]);

  // Handle content click navigation
  const handleContentClick = useCallback((itemId: string, itemType: ContentItemType) => {
    const path = itemType === ContentItemType.Quote ? `/quotes/${itemId}` :
                 itemType === ContentItemType.Knowledge ? `/knowledge/${itemId}` :
                 itemType === ContentItemType.Media ? `/media/${itemId}` :
                 itemType === ContentItemType.Forum ? `/forum/${itemId}` : '/';
    
    window.location.href = path;
  }, []);

  // Initial load
  useEffect(() => {
    setFilters(prev => ({ ...prev, contentType }));
    refetch();
  }, [contentType, refetch]);

  // Memoized return values
  const feedItems = useMemo(() => feedState.items, [feedState.items]);
  const userLikes = useMemo(() => userState.likes, [userState.likes]);
  const userBookmarks = useMemo(() => userState.bookmarks, [userState.bookmarks]);

  return {
    feedItems,
    isLoading: feedState.isLoading,
    error: feedState.error,
    hasMore: feedState.hasMore,
    loadMore,
    refetch,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    handleContentClick
  };
};
