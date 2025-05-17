
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeEntry, MediaPost, Quote, ContentFeedItem, ContentItem } from '@/lib/content-types';
import { useAuth } from '@/lib/auth';

interface UseContentFeedReturn {
  feedItems: ContentFeedItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  userLikes: string[];
  userBookmarks: string[];
  handleLike: (contentId: string, contentType: string) => void;
  handleBookmark: (contentId: string, contentType: string) => void;
  handleContentClick: (contentId: string, contentType: string) => void;
}

export const useContentFeed = (): UseContentFeedReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch knowledge entries
        const { data: knowledgeData, error: knowledgeError } = await supabase
          .from('knowledge_entries')
          .select(`
            id, title, summary, content, categories, cover_image, 
            likes, views, comments, is_ai_generated, user_id,
            created_at, updated_at, 
            profiles:user_id (id, username, name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch media posts
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_posts')
          .select(`
            id, title, content, type, url, likes, views, comments,
            user_id, created_at, updated_at,
            profiles:user_id (id, username, name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch quotes
        const { data: quoteData, error: quoteError } = await supabase
          .from('quotes')
          .select(`
            id, text, author, source, category, tags, 
            likes, comments, bookmarks, user_id, 
            created_at, updated_at,
            profiles:user_id (id, username, name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Transform knowledge entries to feed items
        const knowledgeItems: ContentFeedItem[] = knowledgeData 
          ? knowledgeData.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.summary,
              type: 'knowledge',
              image: item.cover_image || '',
              author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
              date: item.created_at,
              likes: item.likes,
              views: item.views,
              comments: item.comments,
              tags: item.categories
            }))
          : [];

        // Transform media posts to feed items
        const mediaItems: ContentFeedItem[] = mediaData 
          ? mediaData.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.content || '',
              type: 'media',
              image: item.url || '',
              author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
              date: item.created_at,
              likes: item.likes,
              views: item.views || 0,
              comments: item.comments
            }))
          : [];

        // Transform quotes to feed items
        const quoteItems: ContentFeedItem[] = quoteData 
          ? quoteData.map((item: any) => ({
              id: item.id,
              title: item.author,
              description: item.text,
              type: 'quotes',
              author: item.profiles ? (item.profiles.name || item.profiles.username || 'Unknown') : 'Unknown',
              date: item.created_at,
              likes: item.likes,
              bookmarks: item.bookmarks,
              comments: item.comments,
              category: item.category,
              tags: item.tags
            }))
          : [];

        // Get AI generated content separately
        const aiContent: ContentFeedItem[] = knowledgeData 
          ? knowledgeData
              .filter((item: any) => item.is_ai_generated)
              .map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.summary,
                type: 'ai',
                image: item.cover_image || '',
                author: item.profiles ? (item.profiles.name || item.profiles.username || 'AI Assistant') : 'AI Assistant',
                date: item.created_at,
                likes: item.likes,
                views: item.views,
                comments: item.comments,
                tags: item.categories
              }))
          : [];

        // Combine all items into a single array
        const allItems = [...knowledgeItems, ...mediaItems, ...quoteItems, ...aiContent];
        
        // Sort by date (newest first)
        const sortedItems = allItems.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setFeedItems(sortedItems);
        setHasMore(sortedItems.length >= 15);

        if (knowledgeError || mediaError || quoteError) {
          console.error('Error fetching content:', { knowledgeError, mediaError, quoteError });
          setError('Failed to load some content');
        }

        // Fetch user likes and bookmarks if the user is logged in
        if (user) {
          fetchUserInteractions();
        }
      } catch (err) {
        console.error('Error in content feed:', err);
        setError('Failed to load content feed');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserInteractions = async () => {
      try {
        // Fetch user likes
        const { data: likesData } = await supabase
          .from('content_likes')
          .select('content_id')
          .eq('user_id', user?.id);

        // Fetch user bookmarks
        const { data: bookmarksData } = await supabase
          .from('content_bookmarks')
          .select('content_id')
          .eq('user_id', user?.id);

        if (likesData) {
          setUserLikes(likesData.map(item => item.content_id));
        }

        if (bookmarksData) {
          setUserBookmarks(bookmarksData.map(item => item.content_id));
        }
      } catch (err) {
        console.error('Error fetching user interactions:', err);
      }
    };

    fetchContentData();
  }, [user]);

  const loadMore = () => {
    // For now, just a placeholder function
    console.log('Load more content requested');
    // Would need to implement proper pagination
  };

  const handleLike = async (contentId: string, contentType: string) => {
    if (!user) {
      setError('You must be logged in to like content');
      return;
    }

    try {
      // Toggle like status
      const isLiked = userLikes.includes(contentId);
      
      if (isLiked) {
        // Remove like
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id);
        
        setUserLikes(userLikes.filter(id => id !== contentId));
      } else {
        // Add like
        await supabase
          .from('content_likes')
          .insert({
            content_id: contentId,
            content_type: contentType,
            user_id: user.id
          });
        
        setUserLikes([...userLikes, contentId]);
      }

      // Update the feed item
      setFeedItems(feedItems.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              likes: isLiked ? item.likes - 1 : item.likes + 1 
            }
          : item
      ));
    } catch (err) {
      console.error('Error handling like:', err);
    }
  };

  const handleBookmark = async (contentId: string, contentType: string) => {
    if (!user) {
      setError('You must be logged in to bookmark content');
      return;
    }

    try {
      // Toggle bookmark status
      const isBookmarked = userBookmarks.includes(contentId);
      
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id);
        
        setUserBookmarks(userBookmarks.filter(id => id !== contentId));
      } else {
        // Add bookmark
        await supabase
          .from('content_bookmarks')
          .insert({
            content_id: contentId,
            content_type: contentType,
            user_id: user.id
          });
        
        setUserBookmarks([...userBookmarks, contentId]);
      }

      // Update the feed item if it has bookmarks property
      setFeedItems(feedItems.map(item => 
        item.id === contentId && typeof item.bookmarks !== 'undefined'
          ? { 
              ...item, 
              bookmarks: isBookmarked ? (item.bookmarks || 0) - 1 : (item.bookmarks || 0) + 1 
            }
          : item
      ));
    } catch (err) {
      console.error('Error handling bookmark:', err);
    }
  };

  const handleContentClick = (contentId: string, contentType: string) => {
    // This would be replaced with actual navigation logic
    console.log(`Clicked on ${contentType} content with ID: ${contentId}`);
  };

  return { 
    feedItems, 
    isLoading, 
    error, 
    hasMore, 
    loadMore, 
    userLikes, 
    userBookmarks, 
    handleLike, 
    handleBookmark, 
    handleContentClick 
  };
};

// Export ContentItem type
export type { ContentFeedItem, ContentItem };
