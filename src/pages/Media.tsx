
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { MediaPost, fetchMediaPosts, createMediaPost } from "@/utils/mediaUtils";
import { MediaFeed } from "@/components/media/MediaFeed";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/layouts/PageLayout";
import { MediaHeader } from "@/components/media/MediaHeader";
import { MediaFilters } from "@/components/media/MediaFilters";
import { MediaSearchBar } from "@/components/media/MediaSearchBar";
import { CreatePostDialog } from "@/components/media/CreatePostDialog";
import { MediaEmptyState } from "@/components/media/MediaEmptyState";
import { MediaErrorDisplay } from "@/components/media/MediaErrorDisplay";

const Media = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [mediaType, setMediaType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create post states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch media posts using react-query with better error handling
  const { data: postsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['mediaPosts', mediaType, sortBy, sortOrder, searchTerm, page],
    queryFn: () => fetchMediaPosts({
      type: mediaType, 
      page, 
      sortBy, 
      sortOrder, 
      searchQuery: searchTerm
    }),
    retry: 1,
    placeholderData: (previousData) => previousData,
    meta: {
      onError: (err: any) => {
        console.error('Error fetching media posts:', err);
        toast({
          title: "Error loading media",
          description: "There was a problem connecting to the database. Please try again later.",
          variant: "destructive"
        });
      }
    }
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (newPost: {
      title: string;
      content?: string;
      url?: string;
      type: 'image' | 'video' | 'document' | 'youtube' | 'text';
      userId: string;
    }) => createMediaPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaPosts'] });
      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      });
      setIsCreateDialogOpen(false);
      setPage(0);
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  });

  // Extract YouTube video ID
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Handle post creation
  const handleCreatePost = async (postData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts",
        variant: "destructive"
      });
      return;
    }

    try {
      // Process YouTube URL if applicable
      let finalUrl = postData.youtubeUrl || '';
      if (postData.type === 'youtube') {
        const videoId = extractYoutubeId(finalUrl);
        if (!videoId) {
          toast({
            title: "Invalid YouTube URL",
            description: "Please enter a valid YouTube video URL",
            variant: "destructive"
          });
          return;
        }
        finalUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Create post
      createPostMutation.mutate({
        title: postData.title,
        content: postData.content,
        url: finalUrl,
        type: postData.type,
        userId: user.id
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    }
  };

  // Load more posts
  const loadMore = () => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <MediaHeader onCreatePost={() => setIsCreateDialogOpen(true)} />
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MediaSearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
              />
              
              <MediaFilters 
                filterType={mediaType}
                setFilterType={setMediaType}
                sortBy={sortBy as any}
                setSortBy={(value) => setSortBy(value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {isError ? (
          <MediaErrorDisplay 
            message={error instanceof Error ? error.message : "Failed to load media posts"} 
            onRetry={refetch}
          />
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

export default Media;
