
import React from 'react';
import { useUnifiedContentFeed } from '@/hooks/useUnifiedContentFeed';
import { UnifiedContentCard } from './UnifiedContentCard';
import { ContentFeedSkeleton } from './ContentFeedSkeleton';
import { ContentFeedError } from './ContentFeedError';
import { ContentEmptyState } from './ContentEmptyState';
import { ContentType, ContentViewMode, ContentTypeValues } from '@/types/unified-content-types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnifiedContentFeedComponentProps {
  contentType?: ContentType;
  viewMode?: ContentViewMode;
  onCreateContent?: () => void;
}

export const UnifiedContentFeedComponent: React.FC<UnifiedContentFeedComponentProps> = ({
  contentType = ContentTypeValues.All,
  viewMode = 'list',
  onCreateContent
}) => {
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
    handleBookmark
  } = useUnifiedContentFeed(contentType, viewMode);

  const handleContentClick = (id: string, type: ContentType) => {
    try {
      switch (type) {
        case 'knowledge':
          navigate(`/knowledge/${id}`);
          break;
        case 'media':
          navigate(`/media/${id}`);
          break;
        case 'quote':
          navigate(`/quotes/${id}`);
          break;
        case 'forum':
          navigate(`/forum/${id}`);
          break;
        default:
          navigate(`/content/${id}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Filter items based on content type
  const filteredItems = contentType === 'all' 
    ? feedItems 
    : feedItems.filter(item => item.type === contentType);

  // Error state
  if (error) {
    return (
      <ContentFeedError
        message={error}
        onRetry={refetch}
      />
    );
  }

  // Loading state
  if (isLoading && filteredItems.length === 0) {
    return <ContentFeedSkeleton viewMode={viewMode} />;
  }

  // Empty state
  if (filteredItems.length === 0) {
    return (
      <ContentEmptyState
        contentType={contentType}
        onRefresh={refetch}
        onCreateContent={onCreateContent}
      />
    );
  }

  const containerClassName = viewMode === 'grid' 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
    : "space-y-4";

  return (
    <div className="space-y-6">
      <div className={containerClassName}>
        {filteredItems.map(item => {
          const stateKey = `${item.type}:${item.id}`;
          const isLiked = userLikes[stateKey] || false;
          const isBookmarked = userBookmarks[stateKey] || false;
          
          return (
            <UnifiedContentCard
              key={`${item.type}-${item.id}`}
              item={item}
              viewMode={viewMode}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLike={() => handleLike(item.id, item.type as any)}
              onBookmark={() => handleBookmark(item.id, item.type as any)}
              onClick={() => handleContentClick(item.id, item.type)}
            />
          );
        })}
      </div>
      
      {hasMore && (
        <div className="text-center py-4">
          <Button 
            onClick={loadMore} 
            disabled={isLoading}
            variant="outline"
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
