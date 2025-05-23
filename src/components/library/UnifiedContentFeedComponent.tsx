
import React, { useState } from 'react';
import { useUnifiedContentFeed } from '@/hooks/useUnifiedContentFeed';
import { UnifiedContentCard } from './UnifiedContentCard';
import { ContentType, ContentViewMode } from '@/types/unified-content-types';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnifiedContentFeedComponentProps {
  contentType?: ContentType;
  viewMode?: ContentViewMode;
}

export const UnifiedContentFeedComponent: React.FC<UnifiedContentFeedComponentProps> = ({
  contentType = ContentType.All,
  viewMode = 'list'
}) => {
  const navigate = useNavigate();
  const {
    items,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    userInteractions,
    handleLike,
    handleBookmark
  } = useUnifiedContentFeed({ contentType });

  const handleContentClick = (id: string, type: ContentType) => {
    switch (type) {
      case ContentType.Knowledge:
        navigate(`/knowledge/${id}`);
        break;
      case ContentType.Media:
        navigate(`/media/${id}`);
        break;
      case ContentType.Quote:
        navigate(`/quotes/${id}`);
        break;
      case ContentType.Forum:
        navigate(`/forum/${id}`);
        break;
      default:
        navigate(`/content/${id}`);
    }
  };

  // Filter items based on content type
  const filteredItems = contentType === ContentType.All 
    ? items 
    : items.filter(item => item.type === contentType);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading && filteredItems.length === 0) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading content...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No content found</p>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
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
          const isLiked = userInteractions[`like_${stateKey}`] || false;
          const isBookmarked = userInteractions[`bookmark_${stateKey}`] || false;
          
          return (
            <UnifiedContentCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLike={() => handleLike(item.id, item.type)}
              onBookmark={() => handleBookmark(item.id, item.type)}
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
