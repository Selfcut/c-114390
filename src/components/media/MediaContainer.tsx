
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useMediaPosts } from "@/hooks/media/useMediaPosts";
import { PageLayout } from "@/components/layouts/PageLayout";
import { MediaHeader } from "@/components/media/MediaHeader";
import { MediaFilterBar } from "@/components/media/MediaFilterBar";
import { MediaContent } from "@/components/media/MediaContent";
import { CreatePostDialog } from "@/components/media/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";

export const MediaContainer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
    resetPage,
    createPostMutation,
    handleCreatePost
  } = useMediaPosts(mediaType, sortBy, sortOrder, searchTerm);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    resetPage();
  }, [mediaType, sortBy, sortOrder, searchTerm, resetPage]);

  const mediaData = {
    postsData,
    isLoading,
    isError,
    error,
    refetch,
    loadMore
  };

  const handleOpenCreateDialog = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post",
        variant: "destructive"
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };
  
  const handleCloseCreateDialog = () => setIsCreateDialogOpen(false);

  // Handle filter changes
  const handleMediaTypeChange = (value: string) => {
    setMediaType(value);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };
  
  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <MediaHeader onCreatePost={handleOpenCreateDialog} />
        
        <MediaFilterBar
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          filterType={mediaType}
          setFilterType={handleMediaTypeChange}
          sortBy={sortBy}
          setSortBy={handleSortByChange}
          sortOrder={sortOrder}
          setSortOrder={handleSortOrderChange}
        />
        
        <MediaContent
          mediaData={mediaData}
          currentUser={user}
          onCreatePost={handleOpenCreateDialog}
        />
        
        {user && (
          <CreatePostDialog 
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreatePost}
            isSubmitting={createPostMutation?.isPending}
          />
        )}
      </div>
    </PageLayout>
  );
};
