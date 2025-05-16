
import React, { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { MediaFeed } from "@/components/media/MediaFeed";
import { Plus, Image as ImageIcon, FileText, Loader2, Upload, Youtube } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserStatus } from "@/types/user";

export interface MediaPost {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: 'image' | 'video' | 'document' | 'youtube' | 'text';
  created_at: string;
  user_id: string;
  likes?: number;
  comments?: number;
  views?: number;
  profiles?: {
    name?: string;
    avatar_url?: string;
  } | null;
}

const Media = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [mediaType, setMediaType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("new");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create post states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [postType, setPostType] = useState<'image' | 'video' | 'document' | 'youtube' | 'text'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch media posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('media_posts')
          .select(`
            *,
            profiles:user_id (name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .range(page * 10, (page + 1) * 10 - 1);
          
        // Apply media type filter
        if (mediaType !== "all") {
          query = query.eq('type', mediaType);
        }
        
        // Apply search filter if provided
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
        }
        
        // Apply sorting
        if (sortBy === "popular") {
          query = query.order('likes', { ascending: false });
        } else if (sortBy === "new") {
          query = query.order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;

        if (error) throw error;
        
        // Handle the case where profiles might be an error object
        const formattedData = data?.map(post => {
          // If profiles is an error object or undefined, provide default values
          if (!post.profiles || typeof post.profiles === 'string' || 'error' in post.profiles) {
            return {
              ...post,
              profiles: { name: "Unknown", avatar_url: undefined }
            } as MediaPost;
          }
          return post as MediaPost;
        }) || [];
        
        if (page === 0) {
          setPosts(formattedData);
        } else {
          setPosts(prev => [...prev, ...formattedData]);
        }
        
        setHasMore(data && data.length === 10);

      } catch (error: any) {
        console.error('Error fetching media posts:', error);
        toast({
          title: "Error loading posts",
          description: error.message || "Failed to load posts",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, mediaType, sortBy, searchTerm, toast]);

  // Load more posts
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Process YouTube URL to extract video ID
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts",
        variant: "destructive"
      });
      return;
    }

    if (!postTitle) {
      toast({
        title: "Title Required",
        description: "Please add a title for your post",
        variant: "destructive"
      });
      return;
    }

    // Additional validation based on post type
    if (postType === 'youtube' && !postUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Process YouTube URL if applicable
      let finalUrl = postUrl;
      if (postType === 'youtube') {
        const videoId = extractYoutubeId(postUrl);
        if (!videoId) {
          toast({
            title: "Invalid YouTube URL",
            description: "Please enter a valid YouTube video URL",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        finalUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Create post in Supabase
      const { data: post, error } = await supabase
        .from('media_posts')
        .insert({
          title: postTitle,
          content: postContent,
          url: finalUrl,
          type: postType,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      });
      
      // Close dialog and reset form
      setIsCreateDialogOpen(false);
      setPostTitle("");
      setPostContent("");
      setPostUrl("");
      setPostType("text");
      
      // Refresh posts
      setPage(0);
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ImageIcon size={28} className="text-primary" />
              Media Feed
            </h1>
            <p className="text-muted-foreground">Share and discover videos, images, and more</p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create Post</span>
          </Button>
        </div>

        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search media..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={mediaType} onValueChange={setMediaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="text">Text Posts</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <MediaFeed 
          posts={posts}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
          currentUser={user ? {
            id: user.id,
            username: user.username || '',
            name: user.name || '',
            email: user.email || '',
            avatar: user.avatar || '',
            bio: '',
            website: '',
            role: '',
            isAdmin: false,
            status: 'online' as UserStatus,
            isGhostMode: false
          } : null}
        />
        
        {/* Create Post Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share videos, documents, images or text with your community
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="text" value={postType} onValueChange={(v) => setPostType(v as any)}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="text" className="flex items-center gap-1">
                  <FileText size={14} />
                  Text
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center gap-1">
                  <Youtube size={14} />
                  YouTube
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-1">
                  <ImageIcon size={14} />
                  Image
                </TabsTrigger>
                <TabsTrigger value="document" className="flex items-center gap-1">
                  <FileText size={14} />
                  Document
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-4 mt-4">
                <div>
                  <label htmlFor="title" className="text-sm font-medium block mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="title"
                    placeholder="Enter post title" 
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                </div>
                
                <TabsContent value="text">
                  <div>
                    <label htmlFor="content" className="text-sm font-medium block mb-1">
                      Content<span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="content"
                      placeholder="Write your post..."
                      rows={6}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="youtube">
                  <div>
                    <label htmlFor="youtube-url" className="text-sm font-medium block mb-1">
                      YouTube URL<span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="youtube-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste the full YouTube video URL
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="youtube-description" className="text-sm font-medium block mb-1">
                      Description (Optional)
                    </label>
                    <Textarea
                      id="youtube-description"
                      placeholder="Add a description for this video..."
                      rows={3}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="image">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <ImageIcon size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Image uploads coming soon</p>
                    <p className="text-xs text-muted-foreground">For now, please use a URL for your image</p>
                    <Input
                      className="mt-4"
                      placeholder="Image URL"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Textarea
                      placeholder="Add an image description..."
                      rows={3}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="document">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Document uploads coming soon</p>
                    <p className="text-xs text-muted-foreground">For now, please use a URL for your document</p>
                    <Input
                      className="mt-4"
                      placeholder="Document URL"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Post"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default Media;
