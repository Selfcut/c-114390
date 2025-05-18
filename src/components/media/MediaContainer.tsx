
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useMediaPosts } from "@/hooks/media/useMediaPosts";
import { PageLayout } from "@/components/layouts/PageLayout";
import { MediaHeader } from "@/components/media/MediaHeader";
import { MediaFilterBar } from "@/components/media/MediaFilterBar";
import { MediaContent } from "@/components/media/MediaContent";
import { CreatePostDialog } from "@/components/media/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostData } from "@/hooks/media/types";
import { UserProfile, UserStatus } from "@/types/user";

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
    handleCreatePost,
    uploadProgress
  } = useMediaPosts(mediaType, sortBy, sortOrder, searchTerm);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    resetPage();
  }, [mediaType, sortBy, sortOrder, searchTerm, resetPage]);

  // Track page view
  useEffect(() => {
    try {
      if (user?.id) {
        // Record user activity for media page view
        supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            event_type: 'page_view',
            metadata: { page: 'media', filters: { mediaType, sortBy, sortOrder, searchTerm } }
          })
          .then(({ error }) => {
            if (error) console.error('Error tracking page view:', error);
          });
      }
    } catch (err) {
      console.error('Error tracking media page view:', err);
    }
  }, [user?.id, mediaType, sortBy, sortOrder, searchTerm]);

  // Create a normalized user profile for the media content
  const normalizedUser = user ? {
    ...user,
    name: user.name || "Anonymous",
    username: user.username || "user",
    email: user.email || "",
    avatar: user.avatar || user.avatar_url || "",
    status: user.status || "online" as UserStatus,
    role: user.role || 'user',
    isGhostMode: user.isGhostMode || false,
    isAdmin: user.isAdmin || false,
    id: user.id
  } : null;

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

  const handlePostCreationSuccess = (postId: string) => {
    toast({
      title: "Post Created",
      description: "Your post has been created successfully."
    });
    refetch();
    handleCloseCreateDialog();
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
          mediaData={{
            postsData: postsData || { 
              posts: [], 
              hasMore: false, 
              total: 0,
              error: null 
            },
            isLoading,
            isError,
            error: error instanceof Error ? error : new Error(String(error || "Unknown error")),
            refetch,
            loadMore
          }}
          currentUser={normalizedUser}
          onCreatePost={handleOpenCreateDialog}
        />
        
        {user && (
          <CreatePostDialog 
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={async (data: CreatePostData) => {
              try {
                const response = await handleCreatePost(data);
                if (response && response.id) {
                  handlePostCreationSuccess(response.id);
                }
                return response;
              } catch (err) {
                console.error("Error handling post creation:", err);
                toast({
                  title: "Error",
                  description: "Failed to create post. Please try again.",
                  variant: "destructive"
                });
                return null;
              }
            }}
            isSubmitting={createPostMutation?.isPending}
          />
        )}
      </div>
    </PageLayout>
  );
};
