
import React from 'react';
import { MediaPost } from '@/utils/mediaUtils';
import { UserProfile } from '@/types/user';
import { useMediaInteractions } from '@/hooks/useMediaInteractions';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { MediaFeedItem } from './MediaFeedItem';

interface MediaFeedProps {
  posts: MediaPost[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  currentUser: UserProfile | null;
  error?: string;
  onRetry?: () => void;
}

export const MediaFeed: React.FC<MediaFeedProps> = ({
  posts,
  isLoading,
  hasMore,
  loadMore,
  currentUser,
  error,
  onRetry
}) => {
  if (error) {
    return (
      <ResponsiveContainer>
        <ErrorMessage
          title="Failed to Load Posts"
          message={error}
          onRetry={onRetry}
        />
      </ResponsiveContainer>
    );
  }

  if (isLoading && posts.length === 0) {
    return (
      <ResponsiveContainer>
        <LoadingSkeleton variant="card" count={3} />
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {posts.map((post) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { interactions, isLoading: interactionsLoading, toggleLike, toggleBookmark } = useMediaInteractions(
            post.id,
            {
              likesCount: post.likes,
              commentsCount: post.comments,
              viewsCount: post.views,
            }
          );

          return (
            <MediaFeedItem
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={toggleLike}
              onBookmark={toggleBookmark}
              interactions={interactions}
              isLoading={interactionsLoading}
            />
          );
        })}

        {isLoading && posts.length > 0 && (
          <div className="text-center py-8">
            <LoadingSkeleton variant="card" count={2} />
          </div>
        )}

        {!isLoading && hasMore && (
          <div className="text-center py-4">
            <AccessibleButton 
              onClick={loadMore} 
              variant="outline"
              ariaLabel="Load more posts"
            >
              Load More
            </AccessibleButton>
          </div>
        )}

        {!isLoading && !hasMore && posts.length > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            You've reached the end
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
};
