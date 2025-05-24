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
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { useNotification } from '@/hooks/useNotification';
import { useResponsive } from '@/hooks/useResponsive';

interface MediaFeedProps {
  posts: MediaPost[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  currentUser: UserProfile | null;
  error?: string;
  onRetry?: () => void;
}

export const MediaFeed: React.FC<MediaFeedProps> = ({
  posts,
  isLoading,
  hasMore,
  loadMore,
  currentUser,
  error,
  onRetry
}) => {
  const navigate = useNavigate();
  const { error: notifyError, success } = useNotification();
  const { isMobile } = useResponsive();

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

  if (error) {
    return (
      <ResponsiveContainer>
        <ErrorMessage
          title="Failed to Load Posts"
          message={error}
          onRetry={onRetry}
        />
      </ResponsiveContainer>
    );
  }

  if (isLoading && posts.length === 0) {
    return (
      <ResponsiveContainer>
        <LoadingSkeleton variant="card" count={3} />
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
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

          const handleLike = async () => {
            try {
              await toggleLike();
              success('Post liked successfully');
            } catch (error) {
              notifyError('Failed to like post. Please try again.');
            }
          };

          const handleBookmark = async () => {
            try {
              await toggleBookmark();
              success(interactions.isBookmarked ? 'Bookmark removed' : 'Post bookmarked');
            } catch (error) {
              notifyError('Failed to bookmark post. Please try again.');
            }
          };

          return (
            <Card 
              key={post.id} 
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
                onClick={() => handlePostClick(post.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePostClick(post.id);
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
                
                {renderMediaContent(post)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                      }}
                      loading={interactionsLoading}
                      ariaLabel={interactions.isLiked ? 'Unlike post' : 'Like post'}
                      className="h-8"
                    >
                      <Heart className={`w-4 h-4 ${isMobile ? '' : 'mr-1'} ${interactions.isLiked ? 'fill-current' : ''}`} />
                      {!isMobile && (interactions.isLiked ? 'Liked' : 'Like')}
                    </AccessibleButton>
                    <AccessibleButton
                      variant={interactions.isBookmarked ? "default" : "ghost"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark();
                      }}
                      loading={interactionsLoading}
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
        })}

        {isLoading && posts.length > 0 && (
          <div className="text-center py-8">
            <LoadingSkeleton variant="card" count={2} />
          </div>
        )}

        {!isLoading && hasMore && (
          <div className="text-center py-4">
            <AccessibleButton 
              onClick={loadMore} 
              variant="outline"
              ariaLabel="Load more posts"
            >
              Load More
            </AccessibleButton>
          </div>
        )}

        {!isLoading && !hasMore && posts.length > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            You've reached the end
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
};
