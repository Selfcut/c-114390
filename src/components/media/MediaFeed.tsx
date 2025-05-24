
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Eye, Calendar, Bookmark } from 'lucide-react';
import { MediaPost } from '@/utils/mediaUtils';
import { UserProfile } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { useMediaInteractions } from '@/hooks/useMediaInteractions';
import { formatDate } from '@/utils/dateUtils';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ImagePost } from './ImagePost';
import { YoutubeEmbed } from './YoutubeEmbed';
import { DocumentPost } from './DocumentPost';
import { TextPost } from './TextPost';

interface MediaFeedProps {
  posts: MediaPost[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  currentUser: UserProfile | null;
  error?: string;
}

export const MediaFeed: React.FC<MediaFeedProps> = ({
  posts,
  isLoading,
  hasMore,
  loadMore,
  currentUser,
  error
}) => {
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/media/${postId}`);
  };

  const renderMediaContent = (post: MediaPost) => {
    if (!post.url && post.type !== 'text') return null;

    switch (post.type) {
      case 'image':
        return <ImagePost src={post.url!} alt={post.title} />;
      case 'video':
        return (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <video src={post.url} controls className="w-full h-full" />
          </div>
        );
      case 'youtube':
        return <YoutubeEmbed url={post.url!} title={post.title} />;
      case 'document':
        return <DocumentPost url={post.url!} title={post.title} />;
      case 'text':
        return <TextPost content={post.content || ''} />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading && posts.length === 0) {
    return <LoadingSkeleton variant="feed" count={3} />;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { interactions, isLoading: interactionsLoading, toggleLike, toggleBookmark } = useMediaInteractions(
          post.id,
          {
            likesCount: post.likes,
            commentsCount: post.comments,
            viewsCount: post.views,
          }
        );

        return (
          <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author?.avatar_url || undefined} />
                    <AvatarFallback>
                      {post.author?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.author?.name || 'Unknown'}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">{post.type}</Badge>
              </div>
            </CardHeader>

            <CardContent 
              className="space-y-4"
              onClick={() => handlePostClick(post.id)}
            >
              <div>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                {post.content && (
                  <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                )}
              </div>
              
              {renderMediaContent(post)}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{interactions.viewsCount}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  <span>{interactions.likesCount}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>{interactions.commentsCount}</span>
                </div>
              </div>
              
              {currentUser && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={interactions.isLiked ? "default" : "ghost"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike();
                    }}
                    disabled={interactionsLoading}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${interactions.isLiked ? 'fill-current' : ''}`} />
                    {interactions.isLiked ? 'Liked' : 'Like'}
                  </Button>
                  <Button
                    variant={interactions.isBookmarked ? "default" : "ghost"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark();
                    }}
                    disabled={interactionsLoading}
                  >
                    <Bookmark className={`w-4 h-4 mr-1 ${interactions.isBookmarked ? 'fill-current' : ''}`} />
                    {interactions.isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}

      {isLoading && posts.length > 0 && (
        <div className="text-center py-8">
          <LoadingSkeleton variant="card" count={2} />
        </div>
      )}

      {!isLoading && hasMore && (
        <div className="text-center py-4">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}

      {!isLoading && !hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          You've reached the end
        </div>
      )}
    </div>
  );
};
