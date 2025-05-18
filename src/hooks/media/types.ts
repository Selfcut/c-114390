
import { MediaPost } from '@/utils/mediaUtils';

export interface CreatePostData {
  title: string;
  content: string;
  type: string;
  user_id: string;
  file?: File;
}

export interface MediaQueryResult {
  posts: MediaPost[];
  hasMore: boolean;
  total: number;
  error: string | null;
}

export interface UseMediaPostsReturn {
  postsData: MediaQueryResult;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: any;
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  resetPage: () => void;
  createPostMutation: any;
  handleCreatePost: (data: CreatePostData) => Promise<any>;
  uploadProgress: number;
}
