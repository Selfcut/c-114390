
import React from 'react';
import { useContentFeed, ContentFeedItem } from '@/hooks/useContentFeed';
import { ContentFeedSkeleton } from './ContentFeedSkeleton';
import { ContentFeedError } from './ContentFeedError';
import { ContentFeedEmpty } from './ContentFeedEmpty';
import { ContentFeedLoading, LoadMoreButton } from './ContentFeedLoading';
import { ContentFeedItem as ContentFeedItemComponent } from './ContentFeedItem';
import { ContentType } from './ContentTypeFilter';
import { ViewMode } from './ViewSwitcher';

interface ContentFeedProps {
  contentType: ContentType;
  viewMode: ViewMode;
}

export const ContentFeed: React.FC<ContentFeedProps> = ({ contentType, viewMode }) => {
  const {
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
  } = useContentFeed();

  // Error state
  if (error) {
    return <ContentFeedError message={error} />;
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
              onLike={handleLike}
              onBookmark={handleBookmark}
              onClick={handleContentClick}
            />
          ))
        ) : (
          // Empty state
          <ContentFeedEmpty onRefresh={() => window.location.reload()} />
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
