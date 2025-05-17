
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaPost, validateMediaType } from "@/utils/mediaUtils";
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
        
        let query = supabase.from('media_posts')
          .select(`
            *,
            profiles(name, avatar_url, username)
          `)
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
        const { data, error } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Check if there are more posts
        const { count } = await supabase
          .from('media_posts')
          .select('*', { count: 'exact', head: true });
          
        const hasMore = (startIndex + data.length) < (count || 0);
        
        // Map data to MediaPost type
        const posts: MediaPost[] = data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          url: post.url,
          type: validateMediaType(post.type),
          user_id: post.user_id,
          created_at: post.created_at,
          updated_at: post.updated_at,
          likes: post.likes,
          comments: post.comments,
          author: post.profiles ? {
            name: post.profiles.name || 'Unknown',
            avatar_url: post.profiles.avatar_url,
            username: post.profiles.username
          } : {
            name: 'Unknown',
            avatar_url: null,
            username: null
          }
        }));
        
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
    placeholderData: (previousData) => previousData // This replaces keepPreviousData in newer versions
  });
};
