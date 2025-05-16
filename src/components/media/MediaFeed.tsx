import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Share2, RefreshCw, FileQuestion } from 'lucide-react';
import { VideoCard } from './media-cards/VideoCard';
import { ImageCard } from './media-cards/ImageCard';
import { YouTubeCard } from './media-cards/YouTubeCard';
import { DocumentCard } from './media-cards/DocumentCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MediaFeedProps {
  posts: any[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  currentUser: any;
}

export const MediaFeed = ({ posts, isLoading, hasMore, loadMore, currentUser }: MediaFeedProps) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });
  const { toast } = useToast();

  // Load more posts when the user scrolls to the bottom
  React.useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  const handleLike = async (postId: string, currentLikes: number) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if the user has already liked this post
      // Using any type to bypass TypeScript errors since we know the tables exist in Supabase
      const { data: existingLike, error: likeCheckError } = await (supabase as any)
        .from('media_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', currentUser.id)
        .single();
        
      if (likeCheckError && likeCheckError.code !== 'PGRST116') {
        throw likeCheckError;
      }

      if (existingLike) {
        // User already liked this post, so unlike it
        const { error: unlikeError } = await (supabase as any)
          .from('media_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id);
          
        if (unlikeError) throw unlikeError;
        
        // Update post like count
        const { error: updateError } = await (supabase as any)
          .from('media_posts')
          .update({ likes: currentLikes - 1 })
          .eq('id', postId);
          
        if (updateError) throw updateError;
        
        // Update local state would be handled by the parent component
      } else {
        // User hasn't liked this post yet, so like it
        const { error: likeError } = await (supabase as any)
          .from('media_likes')
          .insert({ post_id: postId, user_id: currentUser.id });
          
        if (likeError) throw likeError;
        
        // Update post like count
        const { error: updateError } = await (supabase as any)
          .from('media_posts')
          .update({ likes: currentLikes + 1 })
          .eq('id', postId);
          
        if (updateError) throw updateError;
        
        // Update local state would be handled by the parent component
      }
    } catch (err) {
      console.error("Error liking post:", err);
      toast({
        title: "Action failed",
        description: "There was a problem processing your like",
        variant: "destructive"
      });
    }
  };

  const renderMediaCard = (post: any) => {
    switch (post.type) {
      case 'video':
        return <VideoCard url={post.url} title={post.title} />;
      case 'image':
        return <ImageCard url={post.url} title={post.title} />;
      case 'youtube':
        return <YouTubeCard url={post.url} title={post.title} />;
      case 'document':
        return <DocumentCard url={post.url} title={post.title} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md h-48">
            <FileQuestion size={48} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Unknown media type</p>
          </div>
        );
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-[250px] w-full mb-4" />
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="flex flex-col items-center justify-center">
          <FileQuestion size={64} className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No media found</h3>
          <p className="text-muted-foreground mb-6">There are no posts matching your criteria.</p>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="w-full">
          <CardContent className="p-4">
            {/* Post Author Header */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url} />
                <AvatarFallback>{post.profiles?.name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.profiles?.name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>
            
            {/* Post Title */}
            <h3 className="text-lg font-medium mb-3">{post.title}</h3>
            
            {/* Media Content */}
            <div className="mb-4">
              {renderMediaCard(post)}
            </div>
            
            {/* Post Content */}
            {post.content && (
              <p className="mb-4">{post.content}</p>
            )}
            
            {/* Interaction Buttons */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleLike(post.id, post.likes)}
                >
                  <ThumbsUp size={16} className={post.isLiked ? "text-primary" : ""} />
                  <span>{post.likes}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageSquare size={16} />
                  <span>{post.comments}</span>
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Share2 size={16} />
                <span>Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Loading more indicator */}
      {isLoading && posts.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-2">Loading more content...</p>
        </div>
      )}
      
      {/* Infinite scroll trigger */}
      {hasMore && !isLoading && <div ref={ref} className="h-10" />}
      
      {/* No more content indicator */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No more posts to show
        </div>
      )}
    </div>
  );
};
