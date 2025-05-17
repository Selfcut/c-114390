
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { MediaPost } from "@/utils/mediaUtils";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ThumbsUp, MessageSquare, Share, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { YoutubeEmbed } from "@/components/media/YoutubeEmbed";
import { ImagePost } from "@/components/media/ImagePost";
import { DocumentPost } from "@/components/media/DocumentPost";
import { TextPost } from "@/components/media/TextPost";

const MediaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch the media post
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["mediaPost", id],
    queryFn: async () => {
      if (!id) throw new Error("Media ID is required");
      
      // First fetch the media post
      const { data: postData, error: postError } = await supabase
        .from("media_posts")
        .select("*")
        .eq("id", id)
        .single();
        
      if (postError) throw postError;
      if (!postData) throw new Error("Media post not found");
      
      // Then fetch the author profile separately
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, avatar_url, username")
        .eq("id", postData.user_id)
        .maybeSingle();
      
      // Create the post object with author information
      const completePost: MediaPost = {
        ...postData,
        author: {
          name: profileData?.name || "Unknown User",
          avatar_url: profileData?.avatar_url,
          username: profileData?.username
        }
      };
      
      return completePost;
    },
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching media post:", err);
        toast({
          title: "Error",
          description: "Failed to load the media post",
          variant: "destructive"
        });
      }
    }
  });
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  // Render the appropriate media content
  const renderMediaContent = (post: MediaPost) => {
    switch (post.type) {
      case "youtube":
        return <YoutubeEmbed url={post.url || ""} />;
      case "image":
        return <ImagePost url={post.url || ""} alt={post.title} />;
      case "document":
        return <DocumentPost url={post.url || ""} title={post.title} />;
      case "text":
      default:
        return <TextPost content={post.content || ""} />;
    }
  };
  
  // Format date
  const formatDate = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "some time ago";
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  // Error state
  if (isError || !post) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to Media
          </Button>
          
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium">Media Not Found</h3>
              <p className="mt-2 text-muted-foreground">
                The media you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleBack} className="mt-6">
                Return to Media
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back to Media
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.author?.avatar_url} />
                  <AvatarFallback>
                    {post.author?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Posted by {post.author?.name || "Unknown"} • {formatDate(post.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="max-w-3xl mx-auto">
              {renderMediaContent(post)}
            </div>
            
            {post.content && (
              <div className="mt-6">
                <p className="whitespace-pre-line">{post.content}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-4">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <ThumbsUp size={16} className="mr-1" />
                <span>{post.likes || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <MessageSquare size={16} className="mr-1" />
                <span>{post.comments || 0}</span>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied",
                  description: "The link has been copied to your clipboard",
                });
              }}
              className="flex items-center space-x-1"
            >
              <Share size={16} className="mr-1" />
              <span>Share</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MediaDetail;
