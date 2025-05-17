
import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useMediaPosts } from "@/hooks/useMediaPosts";
import { PageLayout } from "@/components/layouts/PageLayout";
import { MediaHeader } from "@/components/media/MediaHeader";
import { MediaFilters } from "@/components/media/MediaFilters";
import { MediaSearchBar } from "@/components/media/MediaSearchBar";
import { CreatePostDialog } from "@/components/media/CreatePostDialog";
import { MediaEmptyState } from "@/components/media/MediaEmptyState";
import { MediaErrorDisplay } from "@/components/media/MediaErrorDisplay";
import { MediaFeed } from "@/components/media/MediaFeed";

export const MediaContainer = () => {
  const { user } = useAuth();
  const [mediaType, setMediaType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    postsData,
    isLoading,
    isError,
    error,
    refetch,
    loadMore,
    createPostMutation,
    handleCreatePost
  } = useMediaPosts(user?.id, mediaType, sortBy, sortOrder, searchTerm);

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <MediaHeader onCreatePost={() => setIsCreateDialogOpen(true)} />
        
        <div className="mb-6 p-4 bg-background border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MediaSearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
            
            <MediaFilters 
              filterType={mediaType}
              setFilterType={setMediaType}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
        
        {isError ? (
          <MediaErrorDisplay 
            message={error instanceof Error ? error.message : "Failed to load media posts"} 
            onRetry={refetch}
            isRetrying={isLoading}
          />
        ) : postsData?.posts?.length === 0 && !isLoading ? (
          <MediaEmptyState onCreatePost={() => setIsCreateDialogOpen(true)} />
        ) : (
          <MediaFeed 
            posts={postsData?.posts || []}
            isLoading={isLoading}
            hasMore={postsData?.hasMore || false}
            loadMore={loadMore}
            currentUser={user}
            error={postsData?.error ? "Error loading content" : undefined}
          />
        )}
        
        <CreatePostDialog 
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreatePost}
          isSubmitting={createPostMutation.isPending}
        />
      </div>
    </PageLayout>
  );
};
