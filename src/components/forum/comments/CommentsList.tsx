
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/hooks/forum/useForumPost';

interface CommentsListProps {
  comments: Comment[];
  formatTimeAgo: (date: Date) => string;
}

export const CommentsList: React.FC<CommentsListProps> = ({ comments, formatTimeAgo }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No comments yet. Be the first to join the discussion!
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                <AvatarFallback>{comment.author[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 mb-1">
                  <span className="font-medium">
                    {comment.author}
                  </span>
                  {comment.isAuthor && (
                    <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">
                      Author
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                
                <div className="text-sm">
                  {comment.content}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
