
import { MediaPost, MediaPostType } from "@/utils/mediaUtils";
import { UseMutationResult } from "@tanstack/react-query";

// Query parameters for fetching media posts
export interface MediaQueryParams {
  type?: string;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

// Return type for useMediaPosts hook
export interface UseMediaPostsReturn {
  postsData: { 
    posts: MediaPost[];
    hasMore: boolean;
    error: any;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
  loadMore: () => void;
  page: number;
  createPostMutation: UseMutationResult<any, unknown, any, any>;
  handleCreatePost: (postData: any) => Promise<void>;
}

// Structure for post creation input
export interface CreatePostInput {
  title: string;
  content?: string;
  url?: string;
  type: MediaPostType;
  userId: string;
}
