
import React from "react";
import { UseMediaPostsReturn } from "@/hooks/media/types";
import { UserProfile } from "@/types/user"; // Use the centralized type
import { MediaEmptyState } from "@/components/media/MediaEmptyState";
import { MediaErrorDisplay } from "@/components/media/MediaErrorDisplay";
import { MediaFeed } from "@/components/media/MediaFeed";

interface MediaContentProps {
  mediaData: Pick<UseMediaPostsReturn, 'postsData' | 'isLoading' | 'isError' | 'error' | 'refetch' | 'loadMore'>;
  currentUser: UserProfile | null;
  onCreatePost: () => void;
}

export const MediaContent: React.FC<MediaContentProps> = ({
  mediaData,
  currentUser,
  onCreatePost
}) => {
  const { postsData, isLoading, isError, error, refetch, loadMore } = mediaData;

  if (isError) {
    return (
      <MediaErrorDisplay 
        message={error instanceof Error ? error.message : "Failed to load media posts"} 
        onRetry={refetch}
        isRetrying={isLoading}
      />
    );
  }
  
  if (!isLoading && (!postsData?.posts || postsData.posts.length === 0)) {
    return <MediaEmptyState onCreatePost={onCreatePost} />;
  }
  
  return (
    <MediaFeed 
      posts={postsData?.posts || []}
      isLoading={isLoading}
      hasMore={postsData?.hasMore || false}
      loadMore={loadMore}
      currentUser={currentUser}
      error={postsData?.error ? "Error loading content" : undefined}
    />
  );
};
