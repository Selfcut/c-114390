
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetchMediaPosts } from './useFetchMediaPosts';
import { useCreateMediaPost } from './useCreateMediaPost';
import { useAuth } from '@/lib/auth';

export const useMediaPosts = (
  mediaType: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  searchTerm: string
) => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  
  // Use query for fetching media posts
  const { data, isLoading, isError, error, refetch } = useFetchMediaPosts(
    mediaType,
    sortBy,
    sortOrder,
    searchTerm,
    page
  );

  // Function to load more posts
  const loadMore = () => {
    if (data?.hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Reset to first page when filters change
  const resetPage = () => {
    setPage(0);
  };

  // Create post mutation using the custom hook
  const { createPostMutation, handleCreatePost, uploadProgress } = useCreateMediaPost(
    user?.id,
    () => {
      // Invalidate queries to refresh data after successful post creation
      queryClient.invalidateQueries({ queryKey: ['media-posts'] });
    }
  );

  return {
    postsData: data,
    isLoading,
    isError,
    error,
    refetch,
    loadMore,
    resetPage,
    createPostMutation,
    handleCreatePost,
    uploadProgress,
    page
  };
};
