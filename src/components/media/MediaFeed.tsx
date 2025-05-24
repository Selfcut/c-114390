
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Eye, Calendar } from 'lucide-react';
import { MediaPost } from '@/utils/mediaUtils';
import { UserProfile } from '@/types/user';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="space-y-6">
      {posts.map((post) => (
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
                    <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
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
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-1" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                {post.comments}
              </Button>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
