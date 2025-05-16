
import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, Loader2 } from "lucide-react";
import { ImageCard } from "./media-cards/ImageCard";
import { VideoCard } from "./media-cards/VideoCard";
import { DocumentCard } from "./media-cards/DocumentCard";
import { YouTubeCard } from "./media-cards/YouTubeCard";
import { MediaPost } from "@/pages/Media";
import { UserProfile } from "@/types/user";
import { useInView } from "react-intersection-observer";

interface MediaFeedProps {
  posts: MediaPost[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  currentUser: UserProfile | null;
}

export const MediaFeed = ({
  posts,
  isLoading,
  hasMore,
  loadMore,
  currentUser
}: MediaFeedProps) => {
  const { ref, inView } = useInView();

  // Load more posts when scrolled to the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading]);

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

  // Loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-6 my-6">
        {[1, 2, 3].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
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
          <p className="text-muted-foreground mt-2">
            There are no posts matching your criteria. Try adjusting your filters or create the first post.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 my-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url} />
                <AvatarFallback>
                  {post.profiles?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.profiles?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {post.created_at
                    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                    : "Recently"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            {renderMediaContent(post)}
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <ThumbsUp size={16} />
                <span>{post.likes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageSquare size={16} />
                <span>{post.comments || 0}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Loading more indicator */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-4">
          <Button variant="ghost" disabled className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more posts...</span>
          </Button>
        </div>
      )}
    </div>
  );
};
