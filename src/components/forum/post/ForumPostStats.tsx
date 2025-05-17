
import React from 'react';
import { Eye, MessageSquare, ThumbsUp, Clock } from 'lucide-react';

interface ForumPostStatsProps {
  views: number;
  comments: number;
  upvotes: number;
  createdAt: Date;
  formatTimeAgo: (date: Date) => string;
}

export const ForumPostStats = ({ 
  views, 
  comments, 
  upvotes, 
  createdAt, 
  formatTimeAgo
}: ForumPostStatsProps) => {
  return (
    <div className="flex items-center gap-6 text-muted-foreground mb-6">
      <span className="flex items-center gap-1">
        <Eye size={18} /> {views} views
      </span>
      <span className="flex items-center gap-1">
        <MessageSquare size={18} /> {comments} replies
      </span>
      <span className="flex items-center gap-1">
        <ThumbsUp size={18} /> {upvotes} upvotes
      </span>
      <span className="flex items-center gap-1">
        <Clock size={18} /> {formatTimeAgo(createdAt)}
      </span>
    </div>
  );
};
