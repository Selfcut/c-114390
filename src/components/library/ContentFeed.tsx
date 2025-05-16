
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ContentFeedItem } from './ContentFeedItem';
import { ContentFeedSkeleton } from './ContentFeedSkeleton';
import { ContentType } from './ContentTypeFilter';
import { ViewMode } from './ViewSwitcher';
import { ContentItemProps, ContentItemType } from './UnifiedContentItem';

interface ContentFeedProps {
  contentType: ContentType;
  viewMode: ViewMode;
}

export const ContentFeed: React.FC<ContentFeedProps> = ({ contentType, viewMode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  
  // Fetch content based on type
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let allContent: ContentItemProps[] = [];
        
        // Helper function to format date strings
        const formatDate = (dateStr: string) => new Date(dateStr);
        
        // Fetch knowledge entries if requested
        if (contentType === 'all' || contentType === 'knowledge') {
          const { data: knowledgeData, error: knowledgeError } = await supabase
            .from('knowledge_entries')
            .select('*, profiles:user_id(*)')
            .order('created_at', { ascending: false })
            .range(page * 10, (page + 1) * 10 - 1);
            
          if (knowledgeError) throw knowledgeError;
          
          if (knowledgeData) {
            const knowledgeItems: ContentItemProps[] = knowledgeData.map((item: any) => ({
              id: item.id,
              type: 'knowledge',
              title: item.title,
              summary: item.summary,
              author: {
                name: item.profiles?.name || 'Unknown Author',
                avatar: item.profiles?.avatar_url,
                username: item.profiles?.username,
              },
              createdAt: formatDate(item.created_at),
              metrics: {
                views: item.views || 0,
                likes: item.likes || 0,
                comments: item.comments || 0,
              },
              tags: item.categories || [],
              coverImage: item.cover_image,
              viewMode,
            }));
            
            allContent = [...allContent, ...knowledgeItems];
          }
        }
        
        // Fetch media posts if requested
        if (contentType === 'all' || contentType === 'media') {
          const { data: mediaData, error: mediaError } = await supabase
            .from('media_posts')
            .select('*, profiles:user_id(*)')
            .order('created_at', { ascending: false })
            .range(page * 10, (page + 1) * 10 - 1);
            
          if (mediaError) throw mediaError;
          
          if (mediaData) {
            const mediaItems: ContentItemProps[] = mediaData.map((item: any) => ({
              id: item.id,
              type: 'media',
              title: item.title,
              content: item.content,
              author: {
                name: item.profiles?.name || 'Unknown Author',
                avatar: item.profiles?.avatar_url,
                username: item.profiles?.username,
              },
              createdAt: formatDate(item.created_at),
              metrics: {
                likes: item.likes || 0,
                comments: item.comments || 0,
              },
              mediaUrl: item.url,
              mediaType: item.type as 'image' | 'video' | 'document' | 'youtube' | 'text',
              viewMode,
            }));
            
            allContent = [...allContent, ...mediaItems];
          }
        }
        
        // Fetch quotes if requested
        if (contentType === 'all' || contentType === 'quotes') {
          const { data: quotesData, error: quotesError } = await supabase
            .from('quotes')
            .select('*, profiles:user_id(*)')
            .order('created_at', { ascending: false })
            .range(page * 10, (page + 1) * 10 - 1);
            
          if (quotesError) throw quotesError;
          
          if (quotesData) {
            const quoteItems: ContentItemProps[] = quotesData.map((item: any) => ({
              id: item.id,
              type: 'quote',
              title: item.author,
              content: item.text,
              summary: item.source,
              author: {
                name: item.profiles?.name || 'Unknown Author',
                avatar: item.profiles?.avatar_url,
                username: item.profiles?.username,
              },
              createdAt: formatDate(item.created_at),
              metrics: {
                likes: item.likes || 0,
                comments: item.comments || 0,
                bookmarks: item.bookmarks || 0,
              },
              tags: item.tags || [],
              viewMode,
            }));
            
            allContent = [...allContent, ...quoteItems];
          }
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
  
  // Check if user has liked or bookmarked items
  const checkUserInteractions = async (itemIds: string[]) => {
    try {
      // Check likes
      const { data: likesData } = await supabase
        .from('content_likes')
        .select('content_id')
        .eq('user_id', user?.id)
        .in('content_id', itemIds);
        
      if (likesData) {
        const likes: Record<string, boolean> = {};
        likesData.forEach(item => {
          likes[item.content_id] = true;
        });
        setUserLikes(prev => ({...prev, ...likes}));
      }
      
      // Check bookmarks
      const { data: bookmarksData } = await supabase
        .from('content_bookmarks')
        .select('content_id')
        .eq('user_id', user?.id)
        .in('content_id', itemIds);
        
      if (bookmarksData) {
        const bookmarks: Record<string, boolean> = {};
        bookmarksData.forEach(item => {
          bookmarks[item.content_id] = true;
        });
        setUserBookmarks(prev => ({...prev, ...bookmarks}));
      }
    } catch (err) {
      console.error('Error checking user interactions:', err);
    }
  };
  
  // Determine content type for an item
  const getContentTypeString = (itemType: ContentItemType): string => {
    switch(itemType) {
      case 'knowledge':
        return 'knowledge';
      case 'media':
        return 'media';
      case 'quote':
        return 'quote';
      default:
        return 'knowledge';
    }
  };
  
  // Handle like interaction
  const handleLike = async (id: string, itemType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like content",
        variant: "destructive"
      });
      return;
    }
    
    const isLiked = userLikes[id];
    const contentTypeStr = getContentTypeString(itemType);
    
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('content_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', id);
          
        setUserLikes(prev => ({...prev, [id]: false}));
      } else {
        // Like
        await supabase
          .from('content_likes')
          .insert({
            user_id: user.id,
            content_id: id,
            content_type: contentTypeStr
          });
          
        setUserLikes(prev => ({...prev, [id]: true}));
      }
      
      // Update content metrics
      setContent(prev => 
        prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                metrics: { 
                  ...item.metrics, 
                  likes: (item.metrics?.likes || 0) + (isLiked ? -1 : 1) 
                }
              }
            : item
        )
      );
      
    } catch (err) {
      console.error('Error updating like:', err);
      toast({
        title: "Action failed",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };
  
  // Handle bookmark interaction
  const handleBookmark = async (id: string, itemType: ContentItemType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark content",
        variant: "destructive"
      });
      return;
    }
    
    const isBookmarked = userBookmarks[id];
    const contentTypeStr = getContentTypeString(itemType);
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('content_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', id);
          
        setUserBookmarks(prev => ({...prev, [id]: false}));
      } else {
        // Add bookmark
        await supabase
          .from('content_bookmarks')
          .insert({
            user_id: user.id,
            content_id: id,
            content_type: contentTypeStr
          });
          
        setUserBookmarks(prev => ({...prev, [id]: true}));
      }
      
      // Update content metrics if applicable
      setContent(prev => 
        prev.map(item => 
          item.id === id && item.metrics?.bookmarks !== undefined
            ? { 
                ...item, 
                metrics: { 
                  ...item.metrics, 
                  bookmarks: (item.metrics.bookmarks || 0) + (isBookmarked ? -1 : 1) 
                }
              }
            : item
        )
      );
      
    } catch (err) {
      console.error('Error updating bookmark:', err);
      toast({
        title: "Action failed",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    }
  };
  
  // Handle content item click
  const handleContentClick = (id: string, itemType: ContentItemType) => {
    // Different behavior based on content type
    if (itemType === 'knowledge') {
      window.location.href = `/library/entry/${id}`;
    } else if (itemType === 'media') {
      window.location.href = `/library/media/${id}`;
    } else if (itemType === 'quote') {
      // Open quote detail modal or page
      console.log('Open quote detail', id);
    }
  };
  
  // Handle loading more content
  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-4"
      }>
        {isLoading && page === 0 ? (
          <ContentFeedSkeleton viewMode={viewMode} />
        ) : content.length > 0 ? (
          content.map(item => (
            <ContentFeedItem
              key={item.id}
              item={item}
              userLikes={userLikes}
              userBookmarks={userBookmarks}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onClick={handleContentClick}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground mb-4">No content found matching the selected filters.</p>
            <Button onClick={() => window.location.reload()}>Show all content</Button>
          </div>
        )}
      </div>
      
      {hasMore && !isLoading && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            onClick={loadMore} 
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
      
      {isLoading && page > 0 && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};
