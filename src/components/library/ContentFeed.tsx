
import React from 'react';
import { useContentFeed } from '@/hooks/useContentFeed';
import { ContentFeedSkeleton } from './ContentFeedSkeleton';
import { ContentFeedError } from './ContentFeedError';
import { ContentFeedEmpty } from './ContentFeedEmpty';
import { ContentFeedLoading, LoadMoreButton } from './ContentFeedLoading';
import { ContentFeedItem } from './ContentFeedItem';
import { ContentType } from './ContentTypeFilter';
import { ViewMode } from './ViewSwitcher';

interface ContentFeedProps {
  contentType: ContentType;
  viewMode: ViewMode;
}

export const ContentFeed: React.FC<ContentFeedProps> = ({ contentType, viewMode }) => {
  const {
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
  } = useContentFeed({ contentType, viewMode });

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
        {isLoading && content.length === 0 ? (
          <ContentFeedSkeleton viewMode={viewMode} />
        ) : content.length > 0 ? (
          // Content items
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
          // Empty state
          <ContentFeedEmpty onRefresh={() => window.location.reload()} />
        )}
      </div>
      
      {/* Load more button */}
      {hasMore && !isLoading && content.length > 0 && (
        <LoadMoreButton isLoading={false} onClick={loadMore} />
      )}
      
      {/* Loading more indicator */}
      {isLoading && content.length > 0 && (
        <ContentFeedLoading />
      )}
    </>
  );
};
