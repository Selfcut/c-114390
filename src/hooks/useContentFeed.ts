
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { useNavigate } from 'react-router-dom';
import { useContentInteractions } from './useContentInteractions';

// Define the content feed item structure
export interface ContentFeedItem {
  id: string;
  type: ContentItemType;
  title: string;
  summary?: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: string;
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    bookmarks?: number;
  };
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'youtube' | 'document' | 'text';
}

// Generate mock data for demo purposes
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
  const navigate = useNavigate();
  
  // Use the content interactions hook
  const {
    userLikes,
    userBookmarks,
    handleLike,
    handleBookmark,
    checkUserInteractions
  } = useContentInteractions({ userId: user?.id });
  
  // Fetch content items
  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock data
      const mockData = generateMockFeedItems();
      const totalItems = 20; // Total available items
      
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
      
      // Check user interactions for the items if user is logged in
      if (user && pageItems.length > 0) {
        const itemIds = pageItems.map(item => item.id);
        await checkUserInteractions(itemIds, 'default');
      }
      
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [page, user, checkUserInteractions]);
  
  // Load initial content
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);
  
  // Function to load more content
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading, hasMore]);
  
  // Refresh content (reset and fetch again)
  const refetch = useCallback(() => {
    setPage(1);
    setFeedItems([]);
    fetchContent();
  }, [fetchContent]);
  
  // Handle content click (navigation)
  const handleContentClick = useCallback((contentId: string, contentType: ContentItemType) => {
    // Determine the appropriate route based on content type
    let route;
    switch (contentType) {
      case ContentItemType.Knowledge:
        route = `/knowledge/${contentId}`;
        break;
      case ContentItemType.Media:
        route = `/media/${contentId}`;
        break;
      case ContentItemType.Quote:
        route = `/quotes/${contentId}`;
        break;
      case ContentItemType.AI:
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
