
import { useState } from "react";
import { useFetchMediaPosts } from "./useFetchMediaPosts";
import { useCreateMediaPost } from "./useCreateMediaPost";
import { UseMediaPostsReturn } from "./types";

export const useMediaPosts = (
  userId: string | undefined,
  mediaType: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  searchTerm: string
): UseMediaPostsReturn => {
  const [page, setPage] = useState(0);

  // Use the fetch media posts hook
  const { 
    data: postsData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useFetchMediaPosts(mediaType, sortBy, sortOrder, searchTerm, page);

  // Use the create post hook
  const { createPostMutation, handleCreatePost } = useCreateMediaPost(userId, setPage);

  // Load more posts
  const loadMore = () => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return {
    postsData,
    isLoading,
    isError,
    error,
    refetch,
    loadMore,
    page,
    createPostMutation,
    handleCreatePost
  };
};
