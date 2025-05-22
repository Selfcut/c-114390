
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Bookmark, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostHeaderProps {
  post: {
    title: string;
    authorName?: string;
    author?: string; // Alternative field name
    authorAvatar?: string;
    created_at?: string;
    createdAt?: Date | string; // Alternative field name
  };
}

export const PostHeader = ({ post }: PostHeaderProps) => {
  // Handle different field names that might come from different sources
  const authorName = post.authorName || post.author || 'Anonymous';
  const createdAt = post.createdAt 
    ? typeof post.createdAt === 'string' 
      ? new Date(post.createdAt) 
      : post.createdAt
    : post.created_at 
      ? new Date(post.created_at) 
      : new Date();

  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bookmark size={16} className="mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share size={16} className="mr-1" />
            Share
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.authorAvatar} alt={authorName} />
          <AvatarFallback>{authorName?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
        </Avatar>
        <div>
          <span className="text-sm font-medium">{authorName}</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar size={12} className="mr-1" />
            <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
