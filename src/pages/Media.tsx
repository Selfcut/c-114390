import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { MediaPost, fetchMediaPosts, createMediaPost } from "@/utils/mediaUtils";
import { MediaFeed } from "@/components/media/MediaFeed";
import { Plus, Image as ImageIcon, FileText, Loader2, Upload, Youtube } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [postType, setPostType] = useState<'image' | 'video' | 'document' | 'youtube' | 'text'>('text');

  // Fetch media posts using react-query
  const { data: postsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['mediaPosts', mediaType, sortBy, sortOrder, searchTerm, page],
    queryFn: () => fetchMediaPosts({
      type: mediaType, 
      page, 
      sortBy, 
      sortOrder, 
      searchQuery: searchTerm
    }),
    // Replace keepPreviousData with placeholderData in v5
    placeholderData: (previousData) => previousData 
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (newPost: {
      title: string;
      content?: string;
      url?: string;
      type: 'image' | 'video' | 'document' | 'youtube' | 'text';
      userId: string;
    }) => createMediaPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaPosts'] });
      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      setPage(0);
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Post",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  });

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
          return;
        }
        finalUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Create post
      createPostMutation.mutate({
        title: postTitle,
        content: postContent,
        url: finalUrl,
        type: postType,
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
  };

  // Reset form after submission
  const resetForm = () => {
    setPostTitle("");
    setPostContent("");
    setPostUrl("");
    setPostType("text");
  };

  // Load more posts
  const loadMore = () => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Create empty state components for better UX
  const EmptyState = () => (
    <div className="text-center py-10">
      <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
        <ImageIcon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No media posts yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        Be the first to share content with the community
      </p>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Post
      </Button>
    </div>
  );

  return (
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
          className="flex items-center gap-2 hover-lift"
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
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="likes">Most Popular</SelectItem>
                  <SelectItem value="title">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isError ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <div className="mx-auto w-16 h-16 bg-red-50 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Error Loading Media Posts</h3>
              <p className="mt-2 text-sm">{error instanceof Error ? error.message : "An error occurred while fetching posts"}</p>
              <Button className="mt-4" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (!postsData?.posts || postsData.posts.length === 0) && !isLoading ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState />
          </CardContent>
        </Card>
      ) : (
        <MediaFeed 
          posts={postsData?.posts || []}
          isLoading={isLoading}
          hasMore={postsData?.hasMore || false}
          loadMore={loadMore}
          currentUser={user}
        />
      )}
      
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
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={createPostMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={createPostMutation.isPending} className="flex items-center gap-2">
              {createPostMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              {createPostMutation.isPending ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Media;
