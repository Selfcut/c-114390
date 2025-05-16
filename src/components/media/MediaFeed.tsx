
import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, Loader2, AlertCircle } from "lucide-react";
import { ImageCard } from "./media-cards/ImageCard";
import { VideoCard } from "./media-cards/VideoCard";
import { DocumentCard } from "./media-cards/DocumentCard";
import { YouTubeCard } from "./media-cards/YouTubeCard";
import { MediaPost } from "@/pages/Media";
import { UserProfile } from "@/types/user";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MediaFeedProps {
  posts: MediaPost[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  currentUser: UserProfile | null;
  error?: string | null;
}

export const MediaFeed = ({
  posts,
  isLoading,
  hasMore,
  loadMore,
  currentUser,
  error
}: MediaFeedProps) => {
  const { ref, inView } = useInView();

  // Load more posts when scrolled to the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  // Render media content based on type
  const renderMediaContent = (post: MediaPost) => {
    switch (post.type) {
      case 'image':
        return <ImageCard url={post.url || ""} title={post.title} />;
      case 'video':
        return <VideoCard url={post.url || ""} title={post.title} />;
      case 'youtube':
        return <YouTubeCard url={post.url || ""} title={post.title} />;
      case 'document':
        return <DocumentCard url={post.url || ""} title={post.title} />;
      case 'text':
      default:
        return <p className="whitespace-pre-line">{post.content}</p>;
    }
  };

  // Show error if there's one
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-6 my-6">
        {[1, 2, 3].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (posts.length === 0 && !isLoading) {
    return (
      <Card className="my-6">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No posts found</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Be the first to create a post in the community
          </p>
          <Button>Create a post</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 my-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden group">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage 
                  src={post.profiles?.avatar_url || ""} 
                  alt={post.profiles?.name || "User"} 
                />
                <AvatarFallback>
                  {(post.profiles?.name?.charAt(0) || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.profiles?.name || "Unknown User"}</div>
                <div className="text-sm text-muted-foreground">
                  {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            {renderMediaContent(post)}
          </CardContent>
          
          <CardFooter className="py-3">
            <div className="flex justify-between w-full">
              <Button variant="ghost" size="sm">
                <ThumbsUp size={16} className="mr-2" />
                {post.likes || 0}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare size={16} className="mr-2" />
                {post.comments || 0} Comments
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      
      {/* Load more trigger element */}
      {hasMore && (
        <div ref={ref} className="py-4 text-center">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <Button variant="outline" onClick={loadMore}>
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
