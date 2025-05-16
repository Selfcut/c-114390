
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Bookmark, Share } from 'lucide-react';

interface ContentItemActionsProps {
  id: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  metrics?: {
    likes?: number;
    comments?: number;
  };
  onLike?: () => void;
  onBookmark?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export const ContentItemActions: React.FC<ContentItemActionsProps> = ({
  id,
  isLiked = false,
  isBookmarked = false,
  metrics = {},
  onLike,
  onBookmark,
  onComment,
  onShare,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <Button 
        variant="ghost" 
        size="sm" 
        className={isLiked ? "text-red-500" : ""}
        onClick={(e) => {
          e.stopPropagation();
          onLike?.();
        }}
      >
        <Heart size={16} className={isLiked ? "mr-1 fill-red-500" : "mr-1"} />
        {metrics.likes}
      </Button>
      
      {onComment && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onComment();
          }}
        >
          <MessageSquare size={16} className="mr-1" />
          {metrics.comments}
        </Button>
      )}
      
      <Button
        variant="ghost" 
        size="sm"
        className={isBookmarked ? "text-yellow-500" : ""}
        onClick={(e) => {
          e.stopPropagation();
          onBookmark?.();
        }}
      >
        <Bookmark size={16} className={isBookmarked ? "fill-yellow-500" : ""} />
      </Button>
      
      {onShare && (
        <Button
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
        >
          <Share size={16} />
        </Button>
      )}
    </div>
  );
};
