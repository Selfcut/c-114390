
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentItemProps {
  comment: {
    id: string;
    content?: string;
    comment?: string; // Alternative field name
    author?: string;
    authorName?: string; // Alternative field name
    authorId?: string;
    authorAvatar?: string;
    createdAt?: Date | string;
    created_at?: string; // Alternative field name
    isAuthor?: boolean;
    upvotes?: number;
  };
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  // Handle different field names that might come from different sources
  const content = comment.content || comment.comment || '';
  const author = comment.authorName || comment.author || 'Anonymous';
  const createdAt = comment.createdAt 
    ? typeof comment.createdAt === 'string' 
      ? new Date(comment.createdAt) 
      : comment.createdAt 
    : comment.created_at 
      ? new Date(comment.created_at) 
      : new Date();
      
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.authorAvatar} alt={author} />
          <AvatarFallback>{author.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{author}</span>
              {comment.isAuthor && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  Author
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </Card>
  );
};
