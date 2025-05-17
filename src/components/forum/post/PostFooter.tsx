
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Eye } from 'lucide-react';

interface PostFooterProps {
  post: {
    id: string;
    upvotes: number;
    comments: number;
    views: number;
  };
  isAuthenticated: boolean;
  onUpvote: () => Promise<void>;
}

export const PostFooter = ({ post, isAuthenticated, onUpvote }: PostFooterProps) => {
  return (
    <CardFooter className="border-t pt-4 flex justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center"
          onClick={onUpvote}
          disabled={!isAuthenticated}
        >
          <ThumbsUp size={16} className="mr-1" />
          <span>{post.upvotes}</span>
        </Button>
        <div className="flex items-center">
          <MessageSquare size={16} className="mr-1" />
          <span>{post.comments}</span>
        </div>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Eye size={16} className="mr-1" />
        <span>{post.views} views</span>
      </div>
    </CardFooter>
  );
};
