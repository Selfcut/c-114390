
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMediaPost } from "@/utils/mediaUtils";
import { useToast } from "@/hooks/use-toast";
import { isValidYoutubeUrl, extractYoutubeId } from "@/utils/youtubeUtils";
import { CreatePostInput } from "./types";

export const useCreateMediaPost = (userId: string | undefined, setPage: (page: number) => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create post mutation with optimistic updates
  const createPostMutation = useMutation({
    mutationFn: (newPost: CreatePostInput) => createMediaPost(newPost),
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['mediaPosts'] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['mediaPosts']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['mediaPosts'], (old: any) => {
        const optimisticPost = {
          ...newPost,
          id: 'temp-id-' + new Date().getTime(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes: 0,
          comments: 0,
          author: {
            name: 'You',
            avatar_url: undefined
          }
        };
        
        return {
          ...old,
          posts: [optimisticPost, ...(old?.posts || [])]
        };
      });
      
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaPosts'] });
      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      });
      setPage(0);
    },
    onError: (error: any, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['mediaPosts'], context?.previousData);
      
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  });

  // Handle post creation with improved validation
  const handleCreatePost = useCallback(async (postData: any) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts",
        variant: "destructive"
      });
      return;
    }

    try {
      // Process YouTube URL if applicable
      let finalUrl = postData.url || '';
      if (postData.type === 'youtube') {
        if (!isValidYoutubeUrl(finalUrl)) {
          toast({
            title: "Invalid YouTube URL",
            description: "Please enter a valid YouTube video URL",
            variant: "destructive"
          });
          return;
        }
        
        const videoId = extractYoutubeId(finalUrl);
        if (videoId) {
          finalUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Create post
      createPostMutation.mutate({
        title: postData.title,
        content: postData.content,
        url: finalUrl,
        type: postData.type,
        userId: userId
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    }
  }, [userId, toast, createPostMutation]);

  return {
    createPostMutation,
    handleCreatePost
  };
};
