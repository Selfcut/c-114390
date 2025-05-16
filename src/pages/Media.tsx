
import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { MediaHeader } from "../components/media/MediaHeader";
import { MediaFilters } from "../components/media/MediaFilters";
import { MediaFeed } from "../components/media/MediaFeed";
import { CreatePostDialog } from "../components/media/CreatePostDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Define the media post type
export interface MediaPost {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  url?: string;
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  // Join with profiles
  profiles?: {
    name: string;
    username: string;
    avatar_url?: string;
  } | null;
}

const Media = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from Supabase
  const fetchPosts = async (page = 0, append = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const pageSize = 10;
      const startIndex = page * pageSize;
      
      let query = supabase
        .from('media_posts')
        .select('*, profiles(name, username, avatar_url)')
        .range(startIndex, startIndex + pageSize - 1);
      
      // Apply filters
      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'popular') {
        query = query.order('likes', { ascending: false });
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Transform data to match our interface
      const transformedData: MediaPost[] = (data || []).map(item => {
        let profileData = null;
        
        // Handle the profiles relationship with null checks
        if (item.profiles && typeof item.profiles === 'object') {
          profileData = {
            name: item.profiles?.name || 'Unknown User',
            username: item.profiles?.username || 'unknown',
            avatar_url: item.profiles?.avatar_url
          };
        }
        
        return {
          id: item.id,
          user_id: item.user_id,
          title: item.title,
          content: item.content,
          // Ensure type is properly cast to one of the allowed types
          type: (item.type as 'image' | 'video' | 'document' | 'youtube' | 'text'),
          url: item.url,
          likes: item.likes || 0,
          comments: item.comments || 0,
          created_at: item.created_at,
          updated_at: item.updated_at,
          profiles: profileData
        };
      });

      setPosts(prev => (append ? [...prev, ...transformedData] : transformedData));
      setHasMore(transformedData.length === pageSize);
      
    } catch (err: any) {
      console.error("Error fetching media posts:", err);
      setError("Failed to load media posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(0, false);
  }, [filterType, sortBy]);

  // Load more posts
  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPosts(nextPage, true);
  };

  // Handle post creation
  const handleCreatePost = async (postData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create posts",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload file if present
      let fileUrl = null;
      if (postData.file) {
        const fileExt = postData.file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Create storage bucket if it doesn't exist (this would normally be done via SQL)
        try {
          const { data: bucketData } = await supabase
            .storage
            .getBucket('media');
            
          if (!bucketData) {
            // In a real app, you would create the bucket via SQL migrations
            console.error("Media bucket doesn't exist. Please create it via SQL migrations.");
          }
        } catch (error) {
          console.error("Error checking bucket:", error);
        }
        
        const { error: uploadError, data } = await supabase
          .storage
          .from('media')
          .upload(filePath, postData.file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('media')
          .getPublicUrl(filePath);
          
        fileUrl = publicUrl;
      }

      // Create the media post
      const { error: insertError, data } = await supabase
        .from('media_posts')
        .insert({
          user_id: user.id,
          title: postData.title,
          content: postData.content,
          // Ensure we're using a valid type
          type: (postData.type as 'image' | 'video' | 'document' | 'youtube' | 'text'),
          url: postData.type === 'youtube' ? postData.youtubeUrl : fileUrl,
          likes: 0,
          comments: 0
        })
        .select();
        
      if (insertError) throw insertError;

      // Add the new post to state with profile data
      if (data && data.length > 0) {
        const newPost: MediaPost = {
          ...data[0],
          type: (data[0].type as 'image' | 'video' | 'document' | 'youtube' | 'text'),
          profiles: {
            name: user.name,
            username: user.username,
            avatar_url: user.avatar
          }
        };
        
        setPosts(prev => [newPost, ...prev]);
      }

      setIsCreateDialogOpen(false);
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully!"
      });
      
    } catch (err: any) {
      console.error("Error creating post:", err);
      toast({
        title: "Post creation failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <MediaHeader onCreatePost={() => setIsCreateDialogOpen(true)} />
        
        <MediaFilters 
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {error ? (
          <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <MediaFeed 
            posts={posts}
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            currentUser={user}
          />
        )}

        <CreatePostDialog 
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreatePost}
          isSubmitting={isSubmitting}
        />
      </div>
    </PageLayout>
  );
};

export default Media;
