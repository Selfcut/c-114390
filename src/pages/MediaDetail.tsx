
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
import { ImagePost } from '@/components/media/ImagePost';
import { YoutubeEmbed } from '@/components/media/YoutubeEmbed';
import { DocumentPost } from '@/components/media/DocumentPost';
import { TextPost } from '@/components/media/TextPost';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MediaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useMediaDetails(id);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleBack = () => {
    navigate('/media');
  };
  
  const handleLike = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return;
    }
    
    setIsLiked(!isLiked);
    toast({
      description: isLiked ? "Post unliked" : "Post liked",
    });
    // Here we would normally implement the API call to like/unlike
  };
  
  const renderContent = () => {
    if (!data?.post) return null;
    
    switch (data.post.type) {
      case 'image':
        return <ImagePost url={data.post.url || ''} alt={data.post.title} />;
      case 'youtube':
        return <YoutubeEmbed url={data.post.url || ''} />;
      case 'document':
        return <DocumentPost url={data.post.url || ''} title={data.post.title} />;
      case 'text':
      default:
        return <TextPost content={data.post.content || ''} />;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-14 w-3/4 bg-muted rounded"></div>
            <div className="h-64 w-full bg-muted rounded"></div>
            <div className="h-6 w-40 bg-muted rounded"></div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Error state
  if (data?.error || !data?.post) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to Media
          </Button>
          
          <div className="flex flex-col items-center justify-center text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Media Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {data?.error || "The media you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={handleBack}>Return to Media</Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Media
        </Button>
        
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={data.post.author?.avatar_url || ""} alt={data.post.author?.name} />
                <AvatarFallback>{data.post.author?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold">{data.post.title}</h1>
                <p className="text-muted-foreground">
                  Posted by {data.post.author?.name || "Unknown"} • {
                    format(new Date(data.post.created_at), 'MMMM d, yyyy')
                  }
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(data.post.created_at), 'MMMM d, yyyy')}
              </div>
              
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {data.post.views} views
              </div>
              
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {data.post.likes} likes
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                {data.post.comments} comments
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="overflow-hidden rounded-md">
              {renderContent()}
            </div>
            
            {data.post.content && data.post.type !== 'text' && (
              <div className="prose max-w-none dark:prose-invert">
                <h3>Description</h3>
                <p>{data.post.content}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-6">
            <Button
              variant={isLiked ? "default" : "outline"}
              onClick={handleLike}
              disabled={!user}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {isLiked ? "Liked" : "Like"}
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/media')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Media
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MediaDetail;
