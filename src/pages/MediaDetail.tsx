
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, ThumbsUp, MessageSquare, AlertTriangle, Bookmark } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth';
import { useMediaDetails } from '@/hooks/media/useMediaDetails';
import { useMediaInteractions } from '@/hooks/useMediaInteractions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MediaDetailContent } from '@/components/media/MediaDetailContent';
import { MediaErrorBoundary } from '@/components/ui/MediaErrorBoundary';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatDate } from '@/utils/dateUtils';

const MediaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, isLoading, error } = useMediaDetails(id);
  
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

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <Button onClick={handleBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Media
          </Button>
          <LoadingSkeleton variant="detail" />
        </div>
      </PageLayout>
    );
  }

  if (error || !data?.post) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <Button onClick={handleBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Media
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Media Not Found</h2>
                <p className="text-muted-foreground">
                  {error instanceof Error ? error.message : 'The media item you requested could not be found.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const { post } = data;

  return (
    <MediaErrorBoundary>
      <PageLayout>
        <div className="container mx-auto py-8 max-w-4xl">
          <Button onClick={handleBack} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Media
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author?.avatar_url || undefined} />
                        <AvatarFallback>
                          {post.author?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <MediaDetailContent post={post} />
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{interactions.viewsCount} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{interactions.likesCount} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{interactions.commentsCount} comments</span>
                </div>
              </div>
              
              {user && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={interactions.isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLike}
                    disabled={interactionsLoading}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {interactions.isLiked ? 'Liked' : 'Like'}
                  </Button>
                  <Button
                    variant={interactions.isBookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleBookmark}
                    disabled={interactionsLoading}
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    {interactions.isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </PageLayout>
    </MediaErrorBoundary>
  );
};

export default MediaDetail;
