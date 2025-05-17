import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useMediaPosts } from "@/hooks/useMediaPosts";
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
    createPostMutation,
    handleCreatePost
  } = useMediaPosts(mediaType, sortBy, sortOrder, searchTerm);

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

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <MediaHeader onCreatePost={handleOpenCreateDialog} />
        
        <MediaFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={mediaType}
          setFilterType={setMediaType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
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
