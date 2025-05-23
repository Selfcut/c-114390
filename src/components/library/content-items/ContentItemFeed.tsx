
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Image, Quote as QuoteIcon, Brain, MessageSquare, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ContentItemProps, ContentItemType } from './ContentItemTypes';

export const ContentItemFeed: React.FC<ContentItemProps> = ({
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
      className={cn("overflow-hidden transition-all hover:shadow-md cursor-pointer w-full max-w-3xl mx-auto", className)}
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author?.avatar} alt={author?.name} />
            <AvatarFallback>{author?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="font-medium">{author?.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            {getTypeIcon()}
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        
        {summary && (
          <p className="text-muted-foreground mb-4">{summary}</p>
        )}
        
        {type === ContentItemType.Quote && content && (
          <blockquote className="pl-4 border-l-2 border-muted-foreground/40 italic text-muted-foreground text-lg mb-4">
            {content}
          </blockquote>
        )}
        
        {coverImage && (
          <div className="w-full rounded-md overflow-hidden my-4">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full object-cover"
            />
          </div>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(id);
              }}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary"
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-primary text-primary")} />
              <span>{metrics?.likes || 0}</span>
            </button>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
              <span>{metrics?.comments || 0}</span>
            </div>
            
            {metrics?.views !== undefined && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-5 w-5" />
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
              width="20"
              height="20"
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
        </div>
      </CardContent>
    </Card>
  );
};
