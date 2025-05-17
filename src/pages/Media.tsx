
import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { MediaPost, createMediaPost } from "@/utils/mediaUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/layouts/PageLayout";
import { MediaHeader } from "@/components/media/MediaHeader";
import { MediaFilters } from "@/components/media/MediaFilters";
import { MediaSearchBar } from "@/components/media/MediaSearchBar";
import { CreatePostDialog } from "@/components/media/CreatePostDialog";
import { MediaEmptyState } from "@/components/media/MediaEmptyState";
import { MediaErrorDisplay } from "@/components/media/MediaErrorDisplay";
import { MediaFeed } from "@/components/media/MediaFeed";
import { extractYoutubeId, isValidYoutubeUrl } from "@/utils/youtubeUtils";

// Improved fetch function with proper typing and caching
const fetchMediaPostsQuery = async ({ 
  type = 'all', 
  page = 0, 
  sortBy = 'created_at', 
  sortOrder = 'desc', 
  searchTerm = '' 
}) => {
  const response = await fetch(`/api/media-posts?type=${type}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${encodeURIComponent(searchTerm)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch media posts');
  }
  return response.json();
};

const Media = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [mediaType, setMediaType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create post states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Create a memoized query key
  const queryKey = ['mediaPosts', mediaType, sortBy, sortOrder, searchTerm, page];
  
  // Fetch media posts using react-query with better caching
  const { data: postsData, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
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
      const { data: posts, error } = await query;
      
      if (error) throw error;
      
      // Get user profiles separately
      if (posts && posts.length > 0) {
        const userIds = [...new Set(posts.map(post => post.user_id))];
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', userIds);
          
        const profileMap = profiles?.reduce((map, profile) => {
          map[profile.id] = profile;
          return map;
        }, {}) || {};
        
        // Attach author info to each post
        posts.forEach(post => {
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
      
      return {
        posts,
        hasMore,
        error: null
      };
    },
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
            name: user?.name || 'You',
            avatar_url: user?.avatar
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
      setIsCreateDialogOpen(false);
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
    if (!user) {
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
        userId: user.id
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    }
  }, [user, toast, createPostMutation]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isLoading]);

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <MediaHeader onCreatePost={() => setIsCreateDialogOpen(true)} />
        
        <div className="mb-6 p-4 bg-background border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MediaSearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
            
            <MediaFilters 
              filterType={mediaType}
              setFilterType={setMediaType}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
        
        {isError ? (
          <MediaErrorDisplay 
            message={error instanceof Error ? error.message : "Failed to load media posts"} 
            onRetry={refetch}
            isRetrying={isLoading}
          />
        ) : postsData?.posts?.length === 0 && !isLoading ? (
          <MediaEmptyState onCreatePost={() => setIsCreateDialogOpen(true)} />
        ) : (
          <MediaFeed 
            posts={postsData?.posts || []}
            isLoading={isLoading}
            hasMore={postsData?.hasMore || false}
            loadMore={loadMore}
            currentUser={user}
            error={postsData?.error ? "Error loading content" : undefined}
          />
        )}
        
        <CreatePostDialog 
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreatePost}
          isSubmitting={createPostMutation.isPending}
        />
      </div>
    </PageLayout>
  );
};

export default Media;
