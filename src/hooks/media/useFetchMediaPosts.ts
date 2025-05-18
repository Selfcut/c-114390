
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaPost } from "@/utils/mediaUtils";
import { MediaQueryParams, MediaQueryResult } from "./types";

export const useFetchMediaPosts = (
  mediaType: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  searchTerm: string,
  page: number
) => {
  const queryKey = [`media-posts`, { mediaType, sortBy, sortOrder, searchTerm, page }];
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<MediaQueryResult> => {
      try {
        const pageSize = 10;
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize - 1;
        
        // Build the query with proper selection
        let query = supabase.from('media_posts')
          .select('*', { count: 'exact' })
          .range(startIndex, endIndex);
        
        // Apply filters
        if (mediaType !== 'all') {
          query = query.eq('type', mediaType);
        }
        
        // Apply search
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
        }
        
        // Apply sorting
        query = query.order(sortBy || 'created_at', { ascending: sortOrder === 'asc' });
        
        // Execute query
        const { data, error, count } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Get user profiles for each post in a separate query
        const userIds = data.map(post => post.user_id).filter(Boolean);
        let profiles: Record<string, any> = {};
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, username, avatar_url')
            .in('id', userIds);
            
          if (!profilesError && profilesData) {
            profiles = profilesData.reduce((acc: Record<string, any>, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {});
          }
        }
        
        // Check if there are more posts
        const hasMore = (startIndex + data.length) < (count || 0);
        
        // Map data to MediaPost type with proper type safety
        const posts: MediaPost[] = data.map(post => {
          const profileData = profiles[post.user_id] || null;
          
          return {
            id: post.id,
            title: post.title,
            content: post.content,
            url: post.url,
            type: post.type,
            user_id: post.user_id,
            created_at: post.created_at,
            updated_at: post.updated_at,
            likes: post.likes || 0,
            comments: post.comments || 0,
            views: post.views || 0,
            author: profileData ? {
              name: profileData.name || 'Unknown',
              avatar_url: profileData.avatar_url,
              username: profileData.username
            } : {
              name: 'Unknown',
              avatar_url: null,
              username: null
            }
          };
        });
        
        return {
          posts,
          hasMore,
          error: null
        };
      } catch (err) {
        console.error("Error fetching media posts:", err);
        return {
          posts: [],
          hasMore: false,
          error: err instanceof Error ? err.message : "Unknown error occurred"
        };
      }
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false
  });
};
