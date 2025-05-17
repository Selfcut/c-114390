
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  isAuthor: boolean;
}

interface CommentsListProps {
  comments: Comment[];
  formatTimeAgo: (date: Date) => string;
}

export const CommentsList = ({ comments, formatTimeAgo }: CommentsListProps) => {
  if (!comments.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author}</span>
                    {comment.isAuthor && (
                      <Badge variant="outline" className="text-xs">Author</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                
                <p className="mt-2">{comment.content}</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-1">
                    <ThumbsUp size={14} />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-1">
                    <MessageSquare size={14} />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
