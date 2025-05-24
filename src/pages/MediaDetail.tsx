
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, ThumbsUp, MessageSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/lib/auth';
import { useMediaDetails } from '@/hooks/media/useMediaDetails';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MediaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, isLoading, error } = useMediaDetails(id);

  const handleBack = () => {
    navigate('/media');
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
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
                  {error || 'The media item you requested could not be found.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const { post } = data;

  const renderMediaContent = () => {
    switch (post.type) {
      case 'image':
        return (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img 
              src={post.url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'video':
        return (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <video 
              src={post.url} 
              controls
              className="w-full h-full"
            />
          </div>
        );
      case 'youtube':
        const embedUrl = post.url?.includes('embed') 
          ? post.url 
          : post.url?.replace('watch?v=', 'embed/').split('&')[0];
        return (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        );
      case 'document':
        return (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mb-4 bg-primary/10 p-4 rounded-full inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              <Button asChild>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="aspect-video bg-muted/30 rounded-lg p-6">
            <div className="prose prose-sm dark:prose-invert">
              <p>{post.content || 'No content available'}</p>
            </div>
          </div>
        );
    }
  };

  return (
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
                    <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {renderMediaContent()}
            
            {post.content && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{post.content}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments} comments</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MediaDetail;
