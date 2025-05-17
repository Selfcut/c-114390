
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessagesSquare } from "lucide-react";

interface WikiArticleActionsProps {
  authorName?: string;
  isLiked: boolean;
  isProcessingLike: boolean;
  onLikeToggle: () => void;
}

export const WikiArticleActions: React.FC<WikiArticleActionsProps> = ({
  authorName,
  isLiked,
  isProcessingLike,
  onLikeToggle,
}) => {
  return (
    <div className="mt-12 pt-6 border-t flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{authorName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{authorName || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">Contributor</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-1.5 ${isLiked ? 'bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800' : ''}`}
          onClick={onLikeToggle}
          disabled={isProcessingLike}
        >
          <Heart 
            size={14} 
            className={isLiked ? "fill-red-500 text-red-500" : ""} 
          />
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <MessagesSquare size={14} />
          <span>Discuss</span>
        </Button>
      </div>
    </div>
  );
};
