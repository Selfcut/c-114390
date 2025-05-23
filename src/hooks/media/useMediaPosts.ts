
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MediaPost, validateMediaType } from '@/utils/mediaUtils';
import { CreatePostData } from './types';
import { useAuth } from '@/lib/auth';

export interface MediaPosts {
  posts: MediaPost[];
  hasMore: boolean;
  total: number;
  error: string | null;
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

export const useMediaPosts = (
  mediaType = 'all',
  sortBy = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc',
  searchTerm = ''
): UseMediaPostsReturn => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const pageSize = 10;
  
  // Fetch media posts
  const fetchPosts = async (): Promise<MediaQueryResult> => {
    try {
      let query = supabase
        .from('media_posts')
        .select('*', { count: 'exact' });
      
      if (mediaType !== 'all') {
        query = query.eq('type', mediaType);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }
      
      const from = (page - 1) * pageSize;
      const to = page * pageSize - 1;
      
      const { data: posts, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
      
      if (error) throw new Error(error.message);
      
      // Get user profiles for authors
      const userIds = posts?.map(post => post.user_id) || [];
      const uniqueUserIds = [...new Set(userIds)];
      
      let userProfiles: Record<string, any> = {};
      
      if (uniqueUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, username')
          .in('id', uniqueUserIds);
          
        if (profiles) {
          userProfiles = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, any>);
        }
      }
      
      const mappedPosts: MediaPost[] = (posts || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content || '',
        url: post.url || '',
        type: validateMediaType(post.type),
        user_id: post.user_id,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes: post.likes || 0,
        comments: post.comments || 0,
        views: post.views || 0,
        author: userProfiles[post.user_id] 
          ? {
              name: userProfiles[post.user_id].name || 'Unknown',
              avatar_url: userProfiles[post.user_id].avatar_url,
              username: userProfiles[post.user_id].username
            }
          : {
              name: 'Unknown',
              avatar_url: null,
              username: null
            }
      }));
      
      const hasMorePosts = count !== undefined ? from + mappedPosts.length < count : false;
      setHasMore(hasMorePosts);
      
      return { 
        posts: mappedPosts,
        hasMore: hasMorePosts,
        total: count || 0,
        error: null,
      };
    } catch (error: any) {
      console.error('Error fetching media posts:', error);
      return { 
        posts: [],
        hasMore: false,
        total: 0,
        error: error.message || 'Failed to fetch posts',
      };
    }
  };
  
  const { data, isLoading, error, refetch, isPending } = useQuery({
    queryKey: ['media-posts', page, pageSize, mediaType, sortBy, sortOrder, searchTerm],
    queryFn: fetchPosts,
  });
  
  // Create a new media post
  const createPostMutation = useMutation({
    mutationFn: async (postData: CreatePostData) => {
      if (!user?.id) {
        throw new Error('User must be authenticated to create a post');
      }

      // Upload file if included
      let fileUrl = '';
      if (postData.file) {
        const fileExt = postData.file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `media/${fileName}`;
        
        // Create storage bucket if it doesn't exist
        const { data: buckets } = await supabase.storage.listBuckets();
        const mediaExists = buckets?.some(bucket => bucket.name === 'media');
        
        if (!mediaExists) {
          await supabase.storage.createBucket('media', {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*', 'application/pdf', 'application/msword'],
            fileSizeLimit: 10485760 // 10MB
          });
        }
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, postData.file, {
            upsert: false
          });
        
        if (uploadError) throw new Error(uploadError.message);
        
        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        fileUrl = data.publicUrl;
      }
      
      // Create the post with proper user ID
      const { data, error } = await supabase
        .from('media_posts')
        .insert({
          title: postData.title,
          content: postData.content,
          type: postData.type,
          url: postData.url || fileUrl || null,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      return data;
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      setUploadProgress(0);
    },
    onSettled: () => {
      setUploadProgress(0);
    }
  });
  
  const handleCreatePost = async (data: CreatePostData) => {
    return await createPostMutation.mutateAsync({
      ...data,
      user_id: user?.id || ''
    });
  };
  
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);
  
  const resetPage = useCallback(() => {
    setPage(1);
  }, []);
  
  return {
    postsData: data || {
      posts: [],
      hasMore: false,
      total: 0,
      error: null
    },
    isLoading: isLoading || isPending,
    isError: !!error,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
    loadMore,
    hasMore,
    total: data?.total || 0,
    resetPage,
    createPostMutation,
    handleCreatePost,
    uploadProgress
  };
};
