
import React, { useEffect, useCallback } from 'react';
import { ContentFeedSkeleton } from './ContentFeedSkeleton';
import { ContentFeedError } from './ContentFeedError';
import { ContentFeedEmpty } from './ContentFeedEmpty';
import { ContentFeedLoading, LoadMoreButton } from './ContentFeedLoading';
import { ContentFeedItemComponent } from './ContentFeedItem';
import { ContentViewMode, ContentType } from '@/types/unified-content-types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUnifiedContentFeed } from '@/hooks/useUnifiedContentFeed';

interface ContentFeedProps {
  contentType: ContentType;
  viewMode: ContentViewMode;
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
  } = useUnifiedContentFeed(contentType, viewMode);

  // Refetch when content type or manual refresh changes
  useEffect(() => {
    if (lastRefresh) {
      refetch();
    }
  }, [lastRefresh, refetch]);
  
  // Handle authentication required actions
  const handleAuthAction = useCallback((action: () => void) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to perform this action",
        variant: "destructive"
      });
      return;
    }
    action();
  }, [user, toast]);
  
  const handleLikeWithAuth = useCallback((contentId: string, contentType: ContentType) => {
    handleAuthAction(() => handleLike(contentId, contentType));
  }, [handleAuthAction, handleLike]);
  
  const handleBookmarkWithAuth = useCallback((contentId: string, contentType: ContentType) => {
    handleAuthAction(() => handleBookmark(contentId, contentType));
  }, [handleAuthAction, handleBookmark]);
  
  // Custom content click handler that can include analytics
  const handleItemClick = useCallback((contentId: string, contentType: ContentType) => {
    try {
      console.log(`User clicked ${contentType} content: ${contentId}`);
      handleContentClick(contentId, contentType);
    } catch (err) {
      console.error("Error handling content click:", err);
      // Fallback navigation
      const path = contentType === ContentType.Knowledge ? `/knowledge/${contentId}` :
                   contentType === ContentType.Media ? `/media/${contentId}` :
                   contentType === ContentType.Quote ? `/quotes/${contentId}` :
                   contentType === ContentType.Forum ? `/forum/${contentId}` : '/';
      navigate(path);
    }
  }, [handleContentClick, navigate]);

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
        {isLoading && feedItems.length === 0 ? (
          <ContentFeedSkeleton viewMode={viewMode} />
        ) : feedItems.length > 0 ? (
          // Content items
          feedItems.map(item => (
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
      {hasMore && !isLoading && feedItems.length > 0 && (
        <LoadMoreButton isLoading={false} onClick={loadMore} />
      )}
      
      {/* Loading more indicator */}
      {isLoading && feedItems.length > 0 && (
        <ContentFeedLoading />
      )}
    </>
  );
};
