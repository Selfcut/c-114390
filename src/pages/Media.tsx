
import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { MediaHeader } from "../components/media/MediaHeader";
import { MediaFilters } from "../components/media/MediaFilters";
import { MediaFeed } from "../components/media/MediaFeed";
import { CreatePostDialog } from "../components/media/CreatePostDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const Media = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch posts from Supabase
  const fetchPosts = async (page = 0, append = false) => {
    try {
      setIsLoading(true);
      
      const pageSize = 10;
      const startIndex = page * pageSize;
      
      let query = supabase
        .from('media_posts')
        .select('*, profiles(name, username, avatar_url)')
        .range(startIndex, startIndex + pageSize - 1)
        .order(sortBy === 'newest' ? 'created_at' : 'likes', { ascending: sortBy === 'oldest' });
      
      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setPosts(prev => (append ? [...prev, ...(data || [])] : (data || [])));
      setHasMore((data || []).length === pageSize);
      
    } catch (err) {
      console.error("Error fetching media posts:", err);
      toast({
        title: "Error loading content",
        description: "There was a problem loading media posts.",
        variant: "destructive"
      });
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
  const handleCreatePost = async (postData) => {
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
      const { error: insertError } = await supabase
        .from('media_posts')
        .insert({
          user_id: user.id,
          title: postData.title,
          content: postData.content,
          type: postData.type,
          url: postData.type === 'youtube' ? postData.youtubeUrl : fileUrl,
          likes: 0,
          comments: 0
        });
        
      if (insertError) throw insertError;

      // Refresh the feed
      fetchPosts(0, false);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully!"
      });
      
    } catch (err) {
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
        
        <MediaFeed 
          posts={posts}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
          currentUser={user}
        />

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
