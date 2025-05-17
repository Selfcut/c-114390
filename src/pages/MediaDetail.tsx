
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { MediaPost, validateMediaType, trackMediaView } from "@/utils/mediaUtils";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaDetailHeader } from "@/components/media/MediaDetailHeader";
import { MediaDetailContent } from "@/components/media/MediaDetailContent";
import { MediaDetailFooter } from "@/components/media/MediaDetailFooter";

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
      
      // Track view
      await trackMediaView(id, user?.id);
      
      // Create the post object with author information
      const completePost: MediaPost = {
        ...postData,
        // Validate the media type to ensure it's a valid MediaPostType
        type: validateMediaType(postData.type),
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
        <Card>
          <CardHeader>
            <MediaDetailHeader post={post} handleBack={handleBack} />
          </CardHeader>
          
          <CardContent>
            <MediaDetailContent post={post} />
          </CardContent>
          
          <CardFooter>
            <MediaDetailFooter post={post} />
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MediaDetail;
