
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Eye, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { MediaPost } from '@/utils/mediaUtils';
import { YoutubeEmbed } from './YoutubeEmbed';
import { ImagePost } from './ImagePost';
import { DocumentPost } from './DocumentPost';
import { TextPost } from './TextPost';

interface MediaFeedProps {
  posts: MediaPost[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  currentUser: any;
  error?: string;
}

export const MediaFeed = ({ 
  posts, 
  isLoading, 
  hasMore, 
  loadMore,
  currentUser,
  error 
}: MediaFeedProps) => {
  const navigate = useNavigate();
  
  // Navigate to media detail page
  const handleViewPost = (post: MediaPost) => {
    navigate(`/media/${post.id}`);
  };
  
  // Render loading skeletons
  if (isLoading && posts.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <Skeleton className="h-52 w-full" />
            <CardFooter className="p-4 flex justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="text-center p-6">
        <CardContent className="pt-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Error Loading Content</h3>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button onClick={loadMore} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Get the first letter of a name for avatar fallback
  const getNameInitial = (name?: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };
  
  // Determine the content to display based on post type
  const renderPostContent = (post: MediaPost) => {
    switch (post.type) {
      case 'youtube':
        return <YoutubeEmbed url={post.url || ''} />;
      case 'image':
        return <ImagePost url={post.url || ''} alt={post.title} />;
      case 'document':
        return <DocumentPost url={post.url || ''} title={post.title} />;
      case 'text':
      default:
        return <TextPost content={post.content || ''} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid layout for the posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.author?.avatar_url || ''} />
                    <AvatarFallback>{getNameInitial(post.author?.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {post.author?.name || 'Unknown'} • {formatTimestamp(post.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <div className="relative cursor-pointer" onClick={() => handleViewPost(post)}>
              {renderPostContent(post)}
            </div>
            
            <CardFooter className="p-4 flex justify-between items-center border-t">
              <div className="flex space-x-4 text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 px-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 px-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments || 0}</span>
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewPost(post)}
                className="text-xs"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={loadMore} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <>Loading...</>
            ) : (
              <>Load More</>
            )}
          </Button>
        </div>
      )}

      {/* Loading indicator for additional content */}
      {isLoading && posts.length > 0 && (
        <div className="flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-24 bg-primary/20 rounded" />
          </div>
        </div>
      )}
    </div>
  );
};
