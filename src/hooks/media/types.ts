
import { MediaPost, MediaType } from "@/utils/mediaUtils";

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

export interface CreatePostData {
  title: string;
  content?: string;
  file?: File;
  type: string;
  tags?: string[];
  user_id: string;
}

export interface CreatePostResponse {
  id: string;
  [key: string]: any;
}

export interface UseMediaPostsReturn {
  postsData: MediaQueryResult | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  loadMore: () => void;
  resetPage: () => void;
  page: number;
  createPostMutation: any;
  handleCreatePost: (data: CreatePostData) => Promise<CreatePostResponse | null>;
  uploadProgress: number;
}
