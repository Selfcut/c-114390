
import React, { useEffect } from 'react';
import { useContentFeed, ContentFeedItem } from '@/hooks/useContentFeed';
import { ContentFeedSkeleton } from './ContentFeedSkeleton';
import { ContentFeedError } from './ContentFeedError';
import { ContentFeedEmpty } from './ContentFeedEmpty';
import { ContentFeedLoading, LoadMoreButton } from './ContentFeedLoading';
import { ContentFeedItem as ContentFeedItemComponent } from './ContentFeedItem';
import { ContentType } from './ContentTypeFilter';
import { ViewMode } from './ViewSwitcher';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ContentFeedProps {
  contentType: ContentType;
  viewMode: ViewMode;
  lastRefresh?: Date;
}

export const ContentFeed: React.FC<ContentFeedProps> = ({ 
  contentType, 
  viewMode,
  lastRefresh
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
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
  } = useContentFeed();

  // Refetch when content type changes or manual refresh is triggered
  useEffect(() => {
    refetch();
  }, [contentType, lastRefresh, refetch]);
  
  // Filter items based on content type
  const filteredItems = contentType === 'all' 
    ? feedItems 
    : feedItems.filter(item => item.type === contentType);
    
  // Handle authentication required actions
  const handleAuthAction = (action: () => void) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to perform this action",
        variant: "destructive"
      });
      
      // Optional: Navigate to login page
      // navigate('/login', { state: { returnUrl: window.location.pathname } });
      return;
    }
    action();
  };
  
  const handleLikeWithAuth = (contentId: string, contentType: string) => {
    handleAuthAction(() => handleLike(contentId, contentType));
  };
  
  const handleBookmarkWithAuth = (contentId: string, contentType: string) => {
    handleAuthAction(() => handleBookmark(contentId, contentType));
  };
  
  // Custom content click handler that can include analytics
  const handleItemClick = (contentId: string, contentType: string) => {
    // Optional: Track content click
    try {
      console.log(`User clicked ${contentType} content: ${contentId}`);
      // You could add analytics tracking here
      
      // Call the original handler
      handleContentClick(contentId, contentType);
    } catch (err) {
      console.error("Error handling content click:", err);
      // Fallback if the main handler fails
      const path = contentType === 'knowledge' ? `/knowledge/${contentId}` :
                   contentType === 'media' ? `/media/${contentId}` :
                   contentType === 'quotes' ? `/quotes/${contentId}` :
                   contentType === 'ai' ? `/ai-content/${contentId}` : '/';
      navigate(path);
    }
  };

  // Error state
  if (error) {
    return <ContentFeedError message={error} onRetry={refetch} />;
  }

  // Content container with grid or list layout
  const containerClassName = viewMode === 'grid' 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
    : "space-y-4";

  return (
    <>
      <div className={containerClassName}>
        {/* Initial loading state */}
        {isLoading && filteredItems.length === 0 ? (
          <ContentFeedSkeleton viewMode={viewMode} />
        ) : filteredItems.length > 0 ? (
          // Content items
          filteredItems.map(item => (
            <ContentFeedItemComponent
              key={item.id}
              item={item}
              userLikes={userLikes}
              userBookmarks={userBookmarks}
              onLike={handleLikeWithAuth}
              onBookmark={handleBookmarkWithAuth}
              onClick={handleItemClick}
              viewMode={viewMode}
            />
          ))
        ) : (
          // Empty state
          <ContentFeedEmpty onRefresh={refetch} />
        )}
      </div>
      
      {/* Load more button */}
      {hasMore && !isLoading && filteredItems.length > 0 && (
        <LoadMoreButton isLoading={false} onClick={loadMore} />
      )}
      
      {/* Loading more indicator */}
      {isLoading && filteredItems.length > 0 && (
        <ContentFeedLoading />
      )}
    </>
  );
};
