
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { ContentFeedItem } from '@/components/library/ContentFeedItem';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { useNavigate } from 'react-router-dom';

// Mock data for demo purposes
const generateMockFeedItems = (): ContentFeedItem[] => {
  return [
    {
      id: '1',
      type: ContentItemType.Knowledge,
      title: 'Understanding Quantum Mechanics',
      summary: 'An introduction to quantum mechanics concepts for beginners',
      author: {
        name: 'Dr. Richard Feynman',
        avatar: '/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png'
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Physics', 'Quantum', 'Science'],
      metrics: {
        likes: 42,
        views: 1024,
        comments: 13
      }
    },
    {
      id: '2',
      type: ContentItemType.Media,
      title: 'Mathematical Beauty in Nature',
      summary: 'Exploring the Fibonacci sequence and golden ratio in natural patterns',
      author: {
        name: 'Prof. Ada Lovelace',
        avatar: '/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png'
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: '/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png',
      mediaType: 'image',
      tags: ['Mathematics', 'Nature', 'Patterns'],
      metrics: {
        likes: 89,
        views: 2456,
        comments: 32
      }
    },
    {
      id: '3',
      type: ContentItemType.Quote,
      title: 'On the Nature of Knowledge',
      content: "The true sign of intelligence is not knowledge but imagination.",
      author: {
        name: 'Albert Einstein',
        avatar: '/lovable-uploads/fab013d4-833b-4739-a13d-9492c0dea259.png'
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Wisdom', 'Intelligence', 'Knowledge'],
      metrics: {
        likes: 276,
        views: 5432,
        bookmarks: 54
      }
    },
    {
      id: '4',
      type: ContentItemType.AI,
      title: 'Future of Machine Learning',
      summary: 'AI-generated exploration of the next decade in machine learning advancements',
      author: {
        name: 'AI Assistant',
        avatar: '/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png',
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['AI', 'Machine Learning', 'Future Tech'],
      metrics: {
        likes: 127,
        views: 3218,
        comments: 48
      }
    }
  ];
};

export const useContentFeed = () => {
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  
  // Fetch content items
  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, we would fetch from the backend with pagination
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate pagination
      const mockData = generateMockFeedItems();
      const totalItems = 20; // In a real app, this would be the total count from backend
      
      const itemsPerPage = 4;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = mockData.slice(0, end); // Simulate growing set of items
      
      setFeedItems(prevItems => {
        if (page === 1) {
          return pageItems;
        }
        // Avoid duplicates when adding more items
        const existingIds = new Set(prevItems.map(item => item.id));
        const newItems = pageItems.filter(item => !existingIds.has(item.id));
        return [...prevItems, ...newItems];
      });
      
      setHasMore(pageItems.length < totalItems);
      
      // Simulate user likes and bookmarks
      if (user) {
        setUserLikes({
          '1': Math.random() > 0.5,
          '3': Math.random() > 0.5
        });
        
        setUserBookmarks({
          '2': Math.random() > 0.5,
          '4': Math.random() > 0.5
        });
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [page, user]);
  
  // Load initial content
  useEffect(() => {
    // Only run on initial load or when page changes
    fetchContent();
  }, [fetchContent, page]);
  
  // Function to load more content
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading, hasMore]);
  
  // Refresh content (reset and fetch again)
  const refetch = useCallback(() => {
    setPage(1);
    fetchContent();
  }, [fetchContent]);
  
  // Handle like action
  const handleLike = useCallback((contentId: string, contentType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return;
    }
    
    setUserLikes(prev => ({
      ...prev,
      [contentId]: !prev[contentId]
    }));
    
    // Update like count in the feed item
    setFeedItems(prevItems => prevItems.map(item => {
      if (item.id === contentId) {
        const currentLikes = item.metrics?.likes || 0;
        const delta = userLikes[contentId] ? -1 : 1;
        
        return {
          ...item,
          metrics: {
            ...item.metrics,
            likes: Math.max(0, currentLikes + delta)
          }
        };
      }
      return item;
    }));
    
    toast({
      description: userLikes[contentId]
        ? `You unliked this ${contentType}`
        : `You liked this ${contentType}`
    });
    
    // In a real app, we would call an API to update the like status
    console.log(`User ${userLikes[contentId] ? 'unliked' : 'liked'} ${contentType} ${contentId}`);
  }, [user, userLikes, toast]);
  
  // Handle bookmark action
  const handleBookmark = useCallback((contentId: string, contentType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark content",
        variant: "destructive"
      });
      return;
    }
    
    setUserBookmarks(prev => ({
      ...prev,
      [contentId]: !prev[contentId]
    }));
    
    // Update bookmark count in the feed item
    setFeedItems(prevItems => prevItems.map(item => {
      if (item.id === contentId) {
        const currentBookmarks = item.metrics?.bookmarks || 0;
        const delta = userBookmarks[contentId] ? -1 : 1;
        
        return {
          ...item,
          metrics: {
            ...item.metrics,
            bookmarks: Math.max(0, currentBookmarks + delta)
          }
        };
      }
      return item;
    }));
    
    toast({
      description: userBookmarks[contentId]
        ? `Removed from your bookmarks`
        : `Added to your bookmarks`
    });
    
    // In a real app, we would call an API to update the bookmark status
    console.log(`User ${userBookmarks[contentId] ? 'removed' : 'added'} bookmark for ${contentType} ${contentId}`);
  }, [user, userBookmarks, toast]);
  
  // Handle content click (navigation)
  const handleContentClick = useCallback((contentId: string, contentType: ContentItemType) => {
    // Determine the appropriate route based on content type
    let route;
    switch (contentType) {
      case 'knowledge':
        route = `/knowledge/${contentId}`;
        break;
      case 'media':
        route = `/media/${contentId}`;
        break;
      case 'quote':
        route = `/quotes/${contentId}`;
        break;
      case 'ai':
        route = `/ai/${contentId}`;
        break;
      default:
        route = '/';
    }
    
    navigate(route);
  }, [navigate]);
  
  return {
    feedItems,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    handleContentClick
  };
};
