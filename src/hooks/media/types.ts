
import { MediaPost } from "@/utils/mediaUtils";

export interface MediaQueryParams {
  mediaType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  page: number;
}

export interface MediaQueryResult {
  posts: MediaPost[];
  hasMore: boolean;
  error: string | null;
}

export interface UseMediaPostsReturn {
  postsData: MediaQueryResult | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  loadMore: () => void;
  page: number;
  createPostMutation: any;
  handleCreatePost: (data: any) => Promise<void>;
  uploadProgress: number;
}
