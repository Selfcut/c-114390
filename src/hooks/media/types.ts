
import { MediaPost } from '@/utils/mediaUtils';

export interface CreatePostData {
  title: string;
  content?: string;
  type: string;
  url?: string;
  file?: File;
  user_id: string;
  tags?: string[];
}

export interface CreatePostResponse {
  id: string;
  title: string;
  content?: string;
  type: string;
  url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  views: number;
}

export interface UseMediaPostsReturn {
  postsData: {
    posts: MediaPost[];
    hasMore: boolean;
    total: number;
    error: string | null;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  resetPage: () => void;
  createPostMutation: any;
  handleCreatePost: (data: CreatePostData) => Promise<any>;
  uploadProgress: number;
}
