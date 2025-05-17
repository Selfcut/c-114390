
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Date;
    upvotes: number;
  };
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
            <AvatarFallback>{comment.authorName?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-sm font-medium">{comment.authorName}</span>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{comment.content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsUp size={14} className="mr-1" />
            <span>{comment.upvotes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            Reply
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Flag size={14} />
        </Button>
      </CardFooter>
    </Card>
  );
};
