
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Image, Quote as QuoteIcon, Brain, MessageSquare, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ContentItemProps, ContentItemType } from './ContentItemTypes';

export const ContentItemGrid: React.FC<ContentItemProps> = ({
  id,
  type,
  title,
  summary,
  content,
  author,
  createdAt,
  metrics,
  tags = [],
  coverImage,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onClick,
  className
}) => {
  // Get the appropriate icon based on content type
  const getTypeIcon = () => {
    switch(type) {
      case ContentItemType.Knowledge:
        return <BookOpen size={16} className="text-blue-500" />;
      case ContentItemType.Media:
        return <Image size={16} className="text-green-500" />;
      case ContentItemType.Quote:
        return <QuoteIcon size={16} className="text-purple-500" />;
      case ContentItemType.AI:
        return <Brain size={16} className="text-amber-500" />;
      default:
        return <BookOpen size={16} className="text-blue-500" />;
    }
  };

  return (
    <Card 
      className={cn("overflow-hidden transition-all hover:shadow-md cursor-pointer", className)}
      onClick={() => onClick?.(id)}
    >
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className={cn("p-4", !coverImage && "pt-4")}>
        <div className="flex items-center gap-2 mb-2">
          {getTypeIcon()}
          <Badge variant="secondary" className="text-xs">
            {type}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
        
        {summary && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{summary}</p>
        )}
        
        {type === ContentItemType.Quote && content && (
          <blockquote className="pl-3 border-l-2 border-muted-foreground/40 italic text-muted-foreground mb-4">
            {content}
          </blockquote>
        )}
        
        <div className="flex items-center gap-2 mt-auto">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author?.avatar} alt={author?.name} />
            <AvatarFallback>{author?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {author?.name}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(id);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <Heart size={14} className={cn(isLiked && "fill-primary text-primary")} />
            <span>{metrics?.likes || 0}</span>
          </button>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare size={14} />
            <span>{metrics?.comments || 0}</span>
          </div>
          
          {metrics?.views !== undefined && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye size={14} />
              <span>{metrics.views}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(id);
          }}
          className={cn(
            "text-muted-foreground hover:text-primary",
            isBookmarked && "text-primary"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>
      </CardFooter>
    </Card>
  );
};
