
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, ThumbsUp, MessageSquare, Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useMediaDetails } from '@/hooks/media/useMediaDetails';
import { useMediaInteractions } from '@/hooks/useMediaInteractions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MediaDetailContent } from '@/components/media/MediaDetailContent';
import { MediaErrorBoundary } from '@/components/ui/MediaErrorBoundary';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { useNotification } from '@/hooks/useNotification';
import { useResponsive } from '@/hooks/useResponsive';
import { useEscapeKey } from '@/hooks/useKeyboard';
import { formatDate } from '@/utils/dateUtils';

const MediaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const { isMobile } = useResponsive();
  const { data, isLoading, error, refetch } = useMediaDetails(id);
  
  const { interactions, isLoading: interactionsLoading, toggleLike, toggleBookmark } = useMediaInteractions(
    id || '',
    {
      likesCount: data?.post?.likes || 0,
      commentsCount: data?.post?.comments || 0,
      viewsCount: data?.post?.views || 0,
    }
  );

  const handleBack = () => {
    navigate('/media');
  };

  // Allow ESC key to go back
  useEscapeKey(handleBack);

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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <AccessibleButton 
          onClick={handleBack} 
          variant="ghost" 
          ariaLabel="Go back to media feed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Media
        </AccessibleButton>
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="p-6 space-y-6">
        <AccessibleButton 
          onClick={handleBack} 
          variant="ghost" 
          ariaLabel="Go back to media feed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Media
        </AccessibleButton>
        <ErrorMessage
          title="Media Not Found"
          message={error instanceof Error ? error.message : 'The media item you requested could not be found.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const { post } = data;

  return (
    <MediaErrorBoundary>
      <div className="p-6 space-y-6">
        <AccessibleButton 
          onClick={handleBack} 
          variant="ghost" 
          ariaLabel="Go back to media feed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Media
        </AccessibleButton>

        <Card className="focus-within:ring-2 focus-within:ring-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  {post.title}
                </h1>
                <div className={`flex items-center space-x-4 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage 
                        src={post.author?.avatar_url || undefined} 
                        alt={`${post.author?.name || 'User'} avatar`}
                      />
                      <AvatarFallback>
                        {post.author?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time dateTime={post.created_at}>
                      {formatDate(post.created_at)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <MediaDetailContent post={post} />
          </CardContent>

          <CardFooter className={`flex items-center justify-between ${isMobile ? 'flex-col space-y-4' : ''}`}>
            <div className={`flex items-center space-x-6 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>{interactions.viewsCount} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                <span>{interactions.likesCount} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span>{interactions.commentsCount} comments</span>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-2">
                <AccessibleButton
                  variant={interactions.isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  loading={interactionsLoading}
                  ariaLabel={interactions.isLiked ? 'Unlike this post' : 'Like this post'}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {interactions.isLiked ? 'Liked' : 'Like'}
                </AccessibleButton>
                <AccessibleButton
                  variant={interactions.isBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={handleBookmark}
                  loading={interactionsLoading}
                  ariaLabel={interactions.isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  {interactions.isBookmarked ? 'Saved' : 'Save'}
                </AccessibleButton>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </MediaErrorBoundary>
  );
};

export default MediaDetail;
