
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaPost, validateMediaType } from "@/utils/mediaUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MediaQueryParams } from "./types";

export const useFetchMediaPosts = (
  mediaType: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  searchTerm: string,
  page: number
) => {
  const { toast } = useToast();
  
  // Create a memoized query key
  const queryKey = ['mediaPosts', mediaType, sortBy, sortOrder, searchTerm, page];
  
  // Query function to fetch media posts
  const fetchMediaPostsQuery = useCallback(async () => {
    // Start building the query
    let query = supabase.from('media_posts').select('*');
    
    // Add filters
    if (mediaType !== 'all') {
      query = query.eq('type', mediaType);
    }
    
    // Add search
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }
    
    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Add pagination
    const limit = 10;
    const offset = page * limit;
    query = query.range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: rawPosts, error } = await query;
    
    if (error) throw error;

    // Interface for raw post data
    interface RawPost {
      id: string;
      title: string;
      content?: string;
      url?: string;
      type: string;
      user_id: string;
      created_at: string;
      updated_at: string;
      likes: number;
      comments: number;
      author?: { name: string; avatar_url?: string };
    }
    
    // Get user profiles separately
    const posts = rawPosts as RawPost[];
    if (posts && posts.length > 0) {
      const userIds = [...new Set(posts.map(post => post.user_id))];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);
        
      const profileMap = profiles?.reduce((map: Record<string, any>, profile: any) => {
        map[profile.id] = profile;
        return map;
      }, {}) || {};
      
      // Attach author info to each post and validate types
      posts.forEach(post => {
        // Validate and convert the post type to a valid MediaPostType
        post.type = validateMediaType(post.type);
        
        // Add author information as a separate property
        post.author = profileMap[post.user_id] 
          ? {
              name: profileMap[post.user_id].name || 'Unknown',
              avatar_url: profileMap[post.user_id].avatar_url
            }
          : {
              name: 'Unknown User',
              avatar_url: undefined
            };
      });
    }
    
    // Check if there's more content
    const { count } = await supabase
      .from('media_posts')
      .select('*', { count: 'exact', head: true });
      
    const hasMore = offset + (posts?.length || 0) < (count || 0);
    
    // Cast the response to MediaPost[] since we've validated and transformed the data
    return {
      posts: posts as unknown as MediaPost[],
      hasMore,
      error: null
    };
  }, [mediaType, sortBy, sortOrder, searchTerm, page]);

  // Fetch media posts using react-query
  return useQuery({
    queryKey,
    queryFn: fetchMediaPostsQuery,
    staleTime: 1000 * 60, // Cache for 1 minute
    placeholderData: (previousData) => previousData,
    meta: {
      onError: (err: any) => {
        console.error('Error fetching media posts:', err);
        toast({
          title: "Error loading media",
          description: "There was a problem connecting to the database. Please try again later.",
          variant: "destructive"
        });
      }
    }
  });
};
