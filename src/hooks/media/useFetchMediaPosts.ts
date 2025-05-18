
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MediaPost, validateMediaType } from '@/utils/mediaUtils';

export interface MediaPosts {
  posts: MediaPost[];
  hasMore: boolean;
  error?: string;
  total?: number;
}

export const useFetchMediaPosts = (
  page = 1, 
  pageSize = 10, 
  mediaType = 'all', 
  sortBy = 'created_at', 
  sortOrder: 'asc' | 'desc' = 'desc',
  searchTerm = ''
) => {
  const [hasMore, setHasMore] = useState(true);
  
  const fetchPosts = async (): Promise<MediaPosts> => {
    try {
      // Start building the query
      let query = supabase
        .from('media_posts')
        .select('*', { count: 'exact' });
      
      // Filter by media type if not 'all'
      if (mediaType !== 'all') {
        query = query.eq('type', mediaType);
      }
      
      // Add search filter if searchTerm is provided
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }
      
      // Calculate pagination ranges
      const from = (page - 1) * pageSize;
      const to = page * pageSize - 1;
      
      // Add sorting and pagination
      const { data: posts, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (error) throw error;

      // Get user profiles for authors
      const userIds = posts?.map(post => post.user_id) || [];
      const uniqueUserIds = [...new Set(userIds)];
      
      let userProfiles: any = {};
      
      if (uniqueUserIds.length) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, username')
          .in('id', uniqueUserIds);
          
        if (profiles) {
          userProfiles = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as any);
        }
      }
      
      // Map posts with author information and validate types
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
      
      // Update hasMore state
      const hasMorePosts = count !== undefined ? from + mappedPosts.length < count : false;
      setHasMore(hasMorePosts);
      
      return {
        posts: mappedPosts,
        hasMore: hasMorePosts,
        total: count
      };
    } catch (error: any) {
      console.error('Error fetching media posts:', error);
      return {
        posts: [],
        hasMore: false,
        error: error.message || 'Failed to fetch posts'
      };
    }
  };

  const { data, isLoading, error, refetch, isPending } = useQuery({
    queryKey: ['media-posts', page, pageSize, mediaType, sortBy, sortOrder, searchTerm],
    queryFn: fetchPosts,
  });

  return {
    posts: data?.posts || [],
    hasMore: data?.hasMore || false,
    total: data?.total || 0,
    error: error ? String(error) : data?.error,
    isLoading: isLoading || isPending,
    refetch
  };
};
