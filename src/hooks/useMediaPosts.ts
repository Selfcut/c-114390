
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseMediaPostsReturn } from "@/hooks/media/types";
import { MediaPost } from "@/utils/mediaUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const ITEMS_PER_PAGE = 12;

export const useMediaPosts = (
  mediaType: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  searchTerm: string
): UseMediaPostsReturn => {
  const [page, setPage] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const [createPostMutation, setCreatePostMutation] = useState<any>(null);

  const fetchPosts = async ({ pageParam = 1 }) => {
    let query = supabase
      .from('media_posts')
      .select(`*, profiles(username, name, avatar_url)`)
      .eq('type', mediaType)
      .ilike('title', `%${searchTerm}%`)
      .range((pageParam - 1) * ITEMS_PER_PAGE, pageParam * ITEMS_PER_PAGE - 1);

    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }

    return { data, page: pageParam };
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [mediaType, sortBy, sortOrder, searchTerm, 'mediaPosts'],
    queryFn: () => fetchPosts({ pageParam: page }),
    staleTime: 5000,
  });

  const postsData = data ? {
    posts: data.data as MediaPost[],
    hasMore: data.data?.length === ITEMS_PER_PAGE,
    error: null,
  } : undefined;

  const loadMore = () => {
    if (postsData?.hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleCreatePost = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return Promise.reject("User not authenticated");
    }

    const newPost = {
      ...data,
      user_id: user.id,
      type: mediaType,
    };

    try {
      const { data: createdPost, error: postError } = await supabase
        .from('media_posts')
        .insert([newPost])
        .select()
        .single();

      if (postError) {
        console.error("Error creating post:", postError);
        toast({
          title: "Error",
          description: `Failed to create post: ${postError.message}`,
          variant: "destructive",
        });
        return Promise.reject(postError);
      }

      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      await refetch();
      return createdPost;
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return Promise.reject(err);
    }
  };

  return {
    postsData,
    isLoading,
    isError,
    error: error instanceof Error ? error : new Error("Unknown error"),
    refetch,
    loadMore,
    page,
    createPostMutation,
    handleCreatePost,
    uploadProgress,
  };
};
