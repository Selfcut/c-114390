
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Eye, Calendar, Bookmark } from 'lucide-react';
import { MediaPost } from '@/utils/mediaUtils';
import { UserProfile } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateUtils';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { useNotification } from '@/hooks/useNotification';
import { useResponsive } from '@/hooks/useResponsive';
import { ImagePost } from './ImagePost';
import { YoutubeEmbed } from './YoutubeEmbed';
import { DocumentPost } from './DocumentPost';
import { TextPost } from './TextPost';

interface MediaFeedItemProps {
  post: MediaPost;
  currentUser: UserProfile | null;
  onLike: (postId: string) => Promise<void>;
  onBookmark: (postId: string) => Promise<void>;
  interactions: {
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
  isLoading: boolean;
}

export const MediaFeedItem: React.FC<MediaFeedItemProps> = ({
  post,
  currentUser,
  onLike,
  onBookmark,
  interactions,
  isLoading
}) => {
  const navigate = useNavigate();
  const { error: notifyError } = useNotification();
  const { isMobile } = useResponsive();

  const handlePostClick = () => {
    navigate(`/media/${post.id}`);
  };

  const renderMediaContent = () => {
    if (!post.url && post.type !== 'text') return null;

    switch (post.type) {
      case 'image':
        return <ImagePost src={post.url!} alt={post.title} />;
      case 'video':
        return (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <video 
              src={post.url} 
              controls 
              className="w-full h-full"
              aria-label={`Video: ${post.title}`}
            />
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

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onLike(post.id);
    } catch (error) {
      notifyError('Failed to like post. Please try again.');
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onBookmark(post.id);
    } catch (error) {
      notifyError('Failed to bookmark post. Please try again.');
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-primary"
      role="article"
      aria-label={`Media post: ${post.title}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={post.author?.avatar_url || undefined} 
                alt={`${post.author?.name || 'User'} avatar`}
              />
              <AvatarFallback>
                {post.author?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">
                {post.author?.name || 'Unknown'}
              </h3>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <time dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </time>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {post.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent 
        className="space-y-4 cursor-pointer"
        onClick={handlePostClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePostClick();
          }
        }}
        aria-label={`Open ${post.title}`}
      >
        <div>
          <h2 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            {post.title}
          </h2>
          {post.content && (
            <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base">
              {post.content}
            </p>
          )}
        </div>
        
        {renderMediaContent()}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className={`flex items-center space-x-4 sm:space-x-6 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>{interactions.viewsCount}</span>
            <span className="sr-only">views</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span>{interactions.likesCount}</span>
            <span className="sr-only">likes</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            <span>{interactions.commentsCount}</span>
            <span className="sr-only">comments</span>
          </div>
        </div>
        
        {currentUser && (
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            <AccessibleButton
              variant={interactions.isLiked ? "default" : "ghost"}
              size="sm"
              onClick={handleLike}
              loading={isLoading}
              ariaLabel={interactions.isLiked ? 'Unlike post' : 'Like post'}
              className="h-8"
            >
              <Heart className={`w-4 h-4 ${isMobile ? '' : 'mr-1'} ${interactions.isLiked ? 'fill-current' : ''}`} />
              {!isMobile && (interactions.isLiked ? 'Liked' : 'Like')}
            </AccessibleButton>
            <AccessibleButton
              variant={interactions.isBookmarked ? "default" : "ghost"}
              size="sm"
              onClick={handleBookmark}
              loading={isLoading}
              ariaLabel={interactions.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
              className="h-8"
            >
              <Bookmark className={`w-4 h-4 ${isMobile ? '' : 'mr-1'} ${interactions.isBookmarked ? 'fill-current' : ''}`} />
              {!isMobile && (interactions.isBookmarked ? 'Saved' : 'Save')}
            </AccessibleButton>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
