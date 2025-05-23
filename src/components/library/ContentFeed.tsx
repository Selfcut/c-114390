
import React, { useEffect, useCallback } from 'react';
import { useContentFeed } from '@/hooks/useContentFeed';
import { ContentFeedSkeleton } from './ContentFeedSkeleton';
import { ContentFeedError } from './ContentFeedError';
import { ContentFeedEmpty } from './ContentFeedEmpty';
import { ContentFeedLoading, LoadMoreButton } from './ContentFeedLoading';
import { ContentFeedItemComponent } from './ContentFeedItem';
import { ContentType as UIContentType } from './ContentTypeFilter';
import { ViewMode } from './ViewSwitcher';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ContentItemType } from './content-items/ContentItemTypes';

interface ContentFeedProps {
  contentType: UIContentType;
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

  // Refetch when content type or manual refresh changes
  useEffect(() => {
    // Only refetch if we have explicit triggers to avoid infinite loops
    if (lastRefresh) {
      refetch();
    }
  }, [lastRefresh, refetch]);
  
  // Filter items based on content type
  const filteredItems = contentType === 'all' 
    ? feedItems 
    : feedItems.filter(item => {
        const itemTypeString = item.type.toString().toLowerCase();
        return contentType === 'quotes' ? itemTypeString === 'quote' : itemTypeString === contentType;
      });
    
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
  
  const handleLikeWithAuth = useCallback((contentId: string, contentType: ContentItemType) => {
    handleAuthAction(() => handleLike(contentId, contentType));
  }, [handleAuthAction, handleLike]);
  
  const handleBookmarkWithAuth = useCallback((contentId: string, contentType: ContentItemType) => {
    handleAuthAction(() => handleBookmark(contentId, contentType));
  }, [handleAuthAction, handleBookmark]);
  
  // Custom content click handler that can include analytics
  const handleItemClick = useCallback((contentId: string, contentType: ContentItemType) => {
    // Track content click
    try {
      console.log(`User clicked ${contentType} content: ${contentId}`);
      // Call the original handler
      handleContentClick(contentId,  contentType);
    } catch (err) {
      console.error("Error handling content click:", err);
      // Fallback if the main handler fails
      const path = contentType === 'knowledge' ? `/knowledge/${contentId}` :
                   contentType === 'media' ? `/media/${contentId}` :
                   contentType === 'quote' ? `/quotes/${contentId}` :
                   contentType === 'ai' ? `/ai-content/${contentId}` : '/';
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
