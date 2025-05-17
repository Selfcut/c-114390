
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { KnowledgeEntry, MediaPost, Quote } from '@/lib/supabase-types';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'media' | 'quotes' | 'ai';
  image?: string;
  author?: string;
  date: string;
  likes: number;
  views?: number;
  bookmarks?: number;
  comments?: number;
  tags?: string[];
  category?: string;
}

interface UseContentFeedProps {
  contentType: 'all' | 'knowledge' | 'media' | 'quotes' | 'ai';
  viewMode: 'grid' | 'list' | 'feed';
}

export const useContentFeed = ({ contentType, viewMode }: UseContentFeedProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchContent = useCallback(async (reset = true) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let newContent: ContentItem[] = [];
      const pageSize = 9;
      const currentPage = reset ? 1 : page;
      const startRange = (currentPage - 1) * pageSize;
      const endRange = startRange + pageSize - 1;
      
      // Fetch knowledge entries if needed
      if (contentType === 'all' || contentType === 'knowledge') {
        const { data: knowledgeData, error: knowledgeError } = await supabase
          .from('knowledge_entries')
          .select('*, profiles:user_id(*)')
          .order('created_at', { ascending: false })
          .range(startRange, endRange);
          
        if (knowledgeError) {
          throw knowledgeError;
        }
        
        if (knowledgeData) {
          const formattedKnowledge: ContentItem[] = knowledgeData.map((item: KnowledgeEntry) => ({
            id: item.id,
            title: item.title,
            description: item.summary,
            type: 'knowledge',
            image: item.cover_image || undefined,
            author: item.profiles?.name || 'Anonymous',
            date: item.created_at,
            likes: item.likes || 0,
            views: item.views || 0,
            comments: item.comments || 0,
            tags: item.categories,
          }));
          
          newContent = [...newContent, ...formattedKnowledge];
        }
      }
      
      // Fetch media posts if needed
      if (contentType === 'all' || contentType === 'media') {
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_posts')
          .select('*, profiles:user_id(*)')
          .order('created_at', { ascending: false })
          .range(startRange, endRange);
          
        if (mediaError) {
          throw mediaError;
        }
        
        if (mediaData) {
          const formattedMedia: ContentItem[] = mediaData.map((item: MediaPost) => ({
            id: item.id,
            title: item.title,
            description: item.content || '',
            type: 'media',
            image: item.url,
            author: item.profiles?.name || 'Anonymous',
            date: item.created_at,
            likes: item.likes || 0,
            views: item.views || 0,
            comments: item.comments || 0,
          }));
          
          newContent = [...newContent, ...formattedMedia];
        }
      }
      
      // Fetch quotes if needed
      if (contentType === 'all' || contentType === 'quotes') {
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*, profiles:user_id(*)')
          .order('created_at', { ascending: false })
          .range(startRange, endRange);
          
        if (quotesError) {
          throw quotesError;
        }
        
        if (quotesData) {
          const formattedQuotes: ContentItem[] = quotesData.map((item: Quote) => ({
            id: item.id,
            title: item.text,
            description: item.source || '',
            type: 'quotes',
            author: item.author,
            date: item.created_at,
            likes: item.likes || 0,
            bookmarks: item.bookmarks || 0,
            comments: item.comments || 0,
            category: item.category,
            tags: item.tags,
          }));
          
          newContent = [...newContent, ...formattedQuotes];
        }
      }
      
      // For AI content, we'd need a separate table, for now we'll just use knowledge entries marked as AI-generated
      if (contentType === 'all' || contentType === 'ai') {
        const { data: aiData, error: aiError } = await supabase
          .from('knowledge_entries')
          .select('*, profiles:user_id(*)')
          .eq('is_ai_generated', true)
          .order('created_at', { ascending: false })
          .range(startRange, endRange);
          
        if (aiError) {
          throw aiError;
        }
        
        if (aiData) {
          const formattedAi: ContentItem[] = aiData.map((item: KnowledgeEntry) => ({
            id: item.id,
            title: item.title,
            description: item.summary,
            type: 'ai',
            image: item.cover_image || undefined,
            author: item.profiles?.name || 'AI',
            date: item.created_at,
            likes: item.likes || 0,
            views: item.views || 0,
            comments: item.comments || 0,
            tags: item.categories,
          }));
          
          newContent = [...newContent, ...formattedAi];
        }
      }
      
      // Sort all content by date
      newContent.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Fetch user likes and bookmarks if user is logged in
      if (user) {
        const { data: likesData } = await supabase
          .from('content_likes')
          .select('content_id')
          .eq('user_id', user.id);
          
        const { data: bookmarksData } = await supabase
          .from('content_bookmarks')
          .select('content_id')
          .eq('user_id', user.id);
          
        if (likesData) {
          setUserLikes(likesData.map(item => item.content_id));
        }
        
        if (bookmarksData) {
          setUserBookmarks(bookmarksData.map(item => item.content_id));
        }
      }
      
      // Update state
      if (reset) {
        setContent(newContent);
      } else {
        setContent(prevContent => [...prevContent, ...newContent]);
      }
      
      setHasMore(newContent.length === pageSize);
      if (!reset) {
        setPage(currentPage + 1);
      } else {
        setPage(2);
      }
      
    } catch (error: any) {
      console.error('Error fetching content:', error);
      setError(error.message || 'Failed to load content');
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }, [contentType, page, user]);
  
  // Load content when contentType changes
  useEffect(() => {
    fetchContent(true);
  }, [contentType, fetchContent]);
  
  // Handle like button click
  const handleLike = useCallback(async (contentId: string, contentType: string) => {
    if (!user) {
      toast.error('Please sign in to like content');
      return;
    }
    
    try {
      const hasLiked = userLikes.includes(contentId);
      
      if (hasLiked) {
        // Remove like
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id);
          
        // Decrement like count in content table
        await supabase.rpc('decrement_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: contentType === 'quotes' ? 'quotes' : contentType === 'media' ? 'media_posts' : 'knowledge_entries'
        });
        
        setUserLikes(prev => prev.filter(id => id !== contentId));
        
        // Update local state
        setContent(prev => prev.map(item => 
          item.id === contentId ? { ...item, likes: Math.max(0, item.likes - 1) } : item
        ));
        
      } else {
        // Add like
        await supabase
          .from('content_likes')
          .insert({
            content_id: contentId,
            user_id: user.id,
            content_type: contentType === 'quotes' ? 'quotes' : contentType === 'media' ? 'media' : 'knowledge'
          });
          
        // Increment like count in content table
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'likes',
          table_name: contentType === 'quotes' ? 'quotes' : contentType === 'media' ? 'media_posts' : 'knowledge_entries'
        });
        
        setUserLikes(prev => [...prev, contentId]);
        
        // Update local state
        setContent(prev => prev.map(item => 
          item.id === contentId ? { ...item, likes: item.likes + 1 } : item
        ));
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Failed to update like');
    }
  }, [user, userLikes]);
  
  // Handle bookmark button click
  const handleBookmark = useCallback(async (contentId: string, contentType: string) => {
    if (!user) {
      toast.error('Please sign in to bookmark content');
      return;
    }
    
    try {
      const hasBookmarked = userBookmarks.includes(contentId);
      
      if (hasBookmarked) {
        // Remove bookmark
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id);
          
        // Decrement bookmark count in quotes table if it's a quote
        if (contentType === 'quotes') {
          await supabase.rpc('decrement_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
        }
        
        setUserBookmarks(prev => prev.filter(id => id !== contentId));
        
        // Update local state for quotes
        if (contentType === 'quotes') {
          setContent(prev => prev.map(item => 
            item.id === contentId ? { ...item, bookmarks: Math.max(0, (item.bookmarks || 0) - 1) } : item
          ));
        }
        
      } else {
        // Add bookmark
        await supabase
          .from('content_bookmarks')
          .insert({
            content_id: contentId,
            user_id: user.id,
            content_type: contentType === 'quotes' ? 'quotes' : contentType === 'media' ? 'media' : 'knowledge'
          });
          
        // Increment bookmark count in quotes table if it's a quote
        if (contentType === 'quotes') {
          await supabase.rpc('increment_counter_fn', {
            row_id: contentId,
            column_name: 'bookmarks',
            table_name: 'quotes'
          });
        }
        
        setUserBookmarks(prev => [...prev, contentId]);
        
        // Update local state for quotes
        if (contentType === 'quotes') {
          setContent(prev => prev.map(item => 
            item.id === contentId ? { ...item, bookmarks: (item.bookmarks || 0) + 1 } : item
          ));
        }
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  }, [user, userBookmarks]);
  
  // Handle content click (increments view count)
  const handleContentClick = useCallback(async (contentId: string, contentType: string) => {
    try {
      // Increment view count based on content type
      if (contentType === 'knowledge' || contentType === 'ai') {
        await supabase.rpc('increment_counter_fn', {
          row_id: contentId,
          column_name: 'views',
          table_name: 'knowledge_entries'
        });
      } else if (contentType === 'media') {
        await supabase.rpc('increment_media_views', { media_id: contentId });
      }
      
      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId && item.views !== undefined ? { ...item, views: item.views + 1 } : item
      ));
      
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // We don't need to show an error toast for view counting failures
    }
  }, []);
  
  // Handle load more
  const loadMore = () => {
    fetchContent(false);
  };
  
  return {
    content,
    isLoading,
    error,
    hasMore,
    loadMore,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    handleContentClick,
    refetch: () => fetchContent(true)
  };
};
