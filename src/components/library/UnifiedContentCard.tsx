
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Eye, Bookmark, BookOpen, Image as ImageIcon, Quote as QuoteIcon, Brain } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { UnifiedContentItem, ContentType, ContentViewMode } from '@/types/unified-content-types';

interface UnifiedContentCardProps {
  item: UnifiedContentItem;
  viewMode: ContentViewMode;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onClick: () => void;
}

export const UnifiedContentCard: React.FC<UnifiedContentCardProps> = ({
  item,
  viewMode,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onClick
}) => {
  const getTypeIcon = () => {
    switch(item.type) {
      case ContentType.Knowledge:
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case ContentType.Media:
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case ContentType.Quote:
        return <QuoteIcon className="h-4 w-4 text-purple-500" />;
      case ContentType.AI:
        return <Brain className="h-4 w-4 text-amber-500" />;
      case ContentType.Forum:
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCardLayout = () => {
    if (viewMode === 'grid') {
      return 'max-w-sm';
    } else if (viewMode === 'feed') {
      return 'max-w-2xl mx-auto';
    }
    return 'w-full';
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
        getCardLayout()
      )}
      onClick={onClick}
    >
      {item.coverImage && viewMode === 'grid' && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={item.coverImage} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getTypeIcon()}
          <Badge variant="secondary" className="text-xs">
            {item.type}
          </Badge>
        </div>
        
        <h3 className={cn(
          "font-semibold mb-2",
          viewMode === 'feed' ? "text-xl" : "text-lg line-clamp-2"
        )}>
          {item.title}
        </h3>
        
        {item.summary && (
          <p className={cn(
            "text-muted-foreground text-sm mb-3",
            viewMode === 'grid' ? "line-clamp-2" : "line-clamp-3"
          )}>
            {item.summary}
          </p>
        )}
        
        {item.type === ContentType.Quote && item.content && (
          <blockquote className="pl-3 border-l-2 border-muted-foreground/40 italic text-muted-foreground mb-3">
            {item.content}
          </blockquote>
        )}
        
        <div className="flex items-center gap-2 mt-auto">
          <Avatar className="h-6 w-6">
            <AvatarImage src={item.author.avatar} alt={item.author.name} />
            <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {item.author.name}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="flex items-center gap-1 text-xs"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
            <span>{item.metrics.likes}</span>
          </Button>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{item.metrics.comments}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{item.metrics.views}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className={cn("text-muted-foreground", isBookmarked && "text-primary")}
        >
          <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
        </Button>
      </CardFooter>
    </Card>
  );
};
