
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MediaPost, MediaPostType, createMediaPost } from "@/utils/mediaUtils";
import { validateMediaType } from "@/utils/mediaUtils";
import { isValidYoutubeUrl, extractYoutubeId } from "@/utils/youtubeUtils";

// Define interface for query parameters
export interface MediaQueryParams {
  type?: string;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

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
  createPostMutation: ReturnType<typeof useMutation>;
  handleCreatePost: (postData: any) => Promise<void>;
}

export const useMediaPosts = (
  userId: string | undefined,
  mediaType: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  searchTerm: string
): UseMediaPostsReturn => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  // Create a memoized query key
  const queryKey = ['mediaPosts', mediaType, sortBy, sortOrder, searchTerm, page];
  
  // Query function to fetch media posts
  const fetchMediaPostsQuery = useCallback(async () => {
    const supabase = (await import('@/integrations/supabase/client')).supabase;
    
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
  const { 
    data: postsData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
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

  // Create post mutation with optimistic updates
  const createPostMutation = useMutation({
    mutationFn: (newPost: {
      title: string;
      content?: string;
      url?: string;
      type: 'image' | 'video' | 'document' | 'youtube' | 'text';
      userId: string;
    }) => createMediaPost(newPost),
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);
      
      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        const optimisticPost = {
          ...newPost,
          id: 'temp-id-' + new Date().getTime(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes: 0,
          comments: 0,
          author: {
            name: 'You',
            avatar_url: undefined
          }
        };
        
        return {
          ...old,
          posts: [optimisticPost, ...(old?.posts || [])]
        };
      });
      
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaPosts'] });
      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      });
      setPage(0);
    },
    onError: (error: any, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKey, context?.previousData);
      
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  });

  // Handle post creation with improved validation
  const handleCreatePost = useCallback(async (postData: any) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts",
        variant: "destructive"
      });
      return;
    }

    try {
      // Process YouTube URL if applicable
      let finalUrl = postData.url || '';
      if (postData.type === 'youtube') {
        if (!isValidYoutubeUrl(finalUrl)) {
          toast({
            title: "Invalid YouTube URL",
            description: "Please enter a valid YouTube video URL",
            variant: "destructive"
          });
          return;
        }
        
        const videoId = extractYoutubeId(finalUrl);
        if (videoId) {
          finalUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Create post
      createPostMutation.mutate({
        title: postData.title,
        content: postData.content,
        url: finalUrl,
        type: postData.type,
        userId: userId
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    }
  }, [userId, toast, createPostMutation]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading]);

  return {
    postsData,
    isLoading,
    isError,
    error,
    refetch,
    loadMore,
    page,
    createPostMutation,
    handleCreatePost
  };
};
