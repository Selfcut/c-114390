
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ContentItemProps, ContentItemType } from '@/components/library/content-items/ContentItemTypes';
import { ContentType } from '@/components/library/ContentTypeFilter';
import { ViewMode } from '@/components/library/ViewSwitcher';
import { useFetchKnowledgeEntries } from './useFetchKnowledgeEntries';
import { useFetchMediaPosts } from './useFetchMediaPosts';
import { useFetchQuotes } from './useFetchQuotes';
import { useContentInteractions } from './useContentInteractions';
import { useContentNavigation } from './useContentNavigation';
import { useToast } from '@/hooks/use-toast';

interface UseContentFeedProps {
  contentType: ContentType;
  viewMode: ViewMode;
}

interface UseContentFeedReturn {
  content: ContentItemProps[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  handleLike: (id: string, itemType: ContentItemType) => Promise<void>;
  handleBookmark: (id: string, itemType: ContentItemType) => Promise<void>;
  handleContentClick: (id: string, itemType: ContentItemType) => void;
}

export const useContentFeed = ({ contentType, viewMode }: UseContentFeedProps): UseContentFeedReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Import the smaller hooks
  const { fetchKnowledgeEntries } = useFetchKnowledgeEntries();
  const { fetchMediaPosts } = useFetchMediaPosts();
  const { fetchQuotes } = useFetchQuotes();
  const { userLikes, userBookmarks, handleLike: interactionHandleLike, 
          handleBookmark: interactionHandleBookmark, checkUserInteractions } = useContentInteractions({ userId: user?.id });
  const { handleContentClick } = useContentNavigation();
  
  // Fetch content based on type
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let allContent: ContentItemProps[] = [];
        
        // Fetch knowledge entries if requested
        if (contentType === 'all' || contentType === 'knowledge') {
          const knowledgeItems = await fetchKnowledgeEntries(page, viewMode);
          allContent = [...allContent, ...knowledgeItems];
        }
        
        // Fetch media posts if requested
        if (contentType === 'all' || contentType === 'media') {
          const mediaItems = await fetchMediaPosts(page, viewMode);
          allContent = [...allContent, ...mediaItems];
        }
        
        // Fetch quotes if requested
        if (contentType === 'all' || contentType === 'quotes') {
          const quoteItems = await fetchQuotes(page, viewMode);
          allContent = [...allContent, ...quoteItems];
        }
        
        // Sort all content by created date
        allContent.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        
        setContent(prev => page === 0 ? allContent : [...prev, ...allContent]);
        setHasMore(allContent.length === 10);
        
        // Check user likes and bookmarks
        if (user) {
          await checkUserInteractions(allContent.map(item => item.id));
        }
        
      } catch (err: any) {
        console.error('Error fetching content:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [contentType, page, viewMode, user?.id]);
  
  // Handle like interaction wrapper
  const handleLike = async (id: string, itemType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like content",
        variant: "destructive"
      });
      return;
    }
    
    const result = await interactionHandleLike(id, itemType);
    if (result) {
      // Update content metrics
      setContent(prev => 
        prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                metrics: { 
                  ...item.metrics, 
                  likes: (item.metrics?.likes || 0) + (result.isLiked ? 1 : -1) 
                }
              }
            : item
        )
      );
    }
  };
  
  // Handle bookmark interaction wrapper
  const handleBookmark = async (id: string, itemType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark content",
        variant: "destructive"
      });
      return;
    }
    
    const result = await interactionHandleBookmark(id, itemType);
    if (result) {
      // Update content metrics if applicable
      setContent(prev => 
        prev.map(item => 
          item.id === id && item.metrics?.bookmarks !== undefined
            ? { 
                ...item, 
                metrics: { 
                  ...item.metrics, 
                  bookmarks: (item.metrics.bookmarks || 0) + (result.isBookmarked ? 1 : -1) 
                }
              }
            : item
        )
      );
    }
  };
  
  // Handle loading more content
  const loadMore = () => {
    setPage(prev => prev + 1);
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
    handleContentClick
  };
};
