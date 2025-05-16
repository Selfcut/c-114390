import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentTypeFilter, type ContentType } from './ContentTypeFilter';
import { ViewSwitcher, type ViewMode } from './ViewSwitcher';
import { UnifiedContentItem, type ContentItemProps, type ContentItemType } from './UnifiedContentItem';
import { useAuth } from '@/lib/auth';

interface UnifiedContentFeedProps {
  defaultContentType?: ContentType;
  defaultViewMode?: ViewMode;
}

export const UnifiedContentFeed = ({ 
  defaultContentType = 'all', 
  defaultViewMode = 'list' 
}: UnifiedContentFeedProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contentType, setContentType] = useState<ContentType>(defaultContentType);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
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
            .select(`
              *,
              profiles:user_id(name, username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .range(page * 10, (page + 1) * 10 - 1);
            
          if (knowledgeError) throw knowledgeError;
          
          if (knowledgeData) {
            const knowledgeItems: ContentItemProps[] = knowledgeData.map(item => ({
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
            .select(`
              *,
              profiles:user_id(name, username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .range(page * 10, (page + 1) * 10 - 1);
            
          if (mediaError) throw mediaError;
          
          if (mediaData) {
            const mediaItems: ContentItemProps[] = mediaData.map(item => ({
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
            .select(`
              *,
              profiles:user_id(name, username, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .range(page * 10, (page + 1) * 10 - 1);
            
          if (quotesError) throw quotesError;
          
          if (quotesData) {
            const quoteItems: ContentItemProps[] = quotesData.map(item => ({
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
  
  // Handle like interaction
  const handleLike = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like content",
        variant: "destructive"
      });
      return;
    }
    
    const isLiked = userLikes[id];
    
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
  const handleBookmark = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark content",
        variant: "destructive"
      });
      return;
    }
    
    const isBookmarked = userBookmarks[id];
    
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
  
  // Handle loading more content
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  // Handle content item click
  const handleContentClick = (id: string) => {
    const item = content.find(c => c.id === id);
    if (!item) return;
    
    // Different behavior based on content type
    if (item.type === 'knowledge') {
      window.location.href = `/library/entry/${id}`;
    } else if (item.type === 'media') {
      window.location.href = `/library/media/${id}`;
    } else if (item.type === 'quote') {
      // Open quote detail modal or page
      console.log('Open quote detail', id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <ContentTypeFilter 
          activeType={contentType} 
          onChange={setContentType} 
          className="mb-2"
        />
        <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />
      </div>
      
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-4"
          }>
            {isLoading && page === 0 ? (
              // Loading skeletons
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-video w-full bg-muted" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center mt-4">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : content.length > 0 ? (
              content.map(item => (
                <UnifiedContentItem
                  key={item.id}
                  {...item}
                  viewMode={viewMode}
                  isLiked={!!userLikes[item.id]}
                  isBookmarked={!!userBookmarks[item.id]}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onClick={handleContentClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground mb-4">No content found matching the selected filters.</p>
                <Button onClick={() => setContentType('all')}>Show all content</Button>
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
      )}
    </div>
  );
};
