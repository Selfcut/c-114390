
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Image, Quote as QuoteIcon, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentItemProps, ContentItemType, MediaType } from './ContentItemTypes';
import { ContentItemMedia } from './ContentItemMedia';
import { ContentItemMeta } from './ContentItemMeta';
import { ContentItemTags } from './ContentItemTags';
import { ContentItemActions } from './ContentItemActions';

export const ContentItemFeed: React.FC<ContentItemProps> = ({
  id,
  type,
  title,
  content,
  summary,
  author,
  createdAt,
  metrics,
  tags = [],
  coverImage,
  mediaUrl,
  mediaType,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onClick,
  onTagClick,
  className
}) => {
  // Get the appropriate icon based on content type
  const getTypeIcon = () => {
    switch(type) {
      case 'knowledge': return <BookOpen size={16} className="text-blue-500" />;
      case 'media': return <Image size={16} className="text-green-500" />;
      case 'quote': return <QuoteIcon size={16} className="text-purple-500" />;
      case 'ai': return <Brain size={16} className="text-amber-500" />;
      default: return <BookOpen size={16} className="text-blue-500" />;
    }
  };

  // Create wrapper functions to handle the type parameter
  const handleLike = () => {
    if (onLike) {
      onLike(id, type);
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(id, type);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(id);
    }
  };

  return (
    <Card 
      onClick={() => onClick?.(id)} 
      className={cn(
        "overflow-hidden cursor-pointer hover:shadow-md transition-all", 
        className
      )}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <ContentItemMedia
          mediaUrl={mediaUrl}
          coverImage={coverImage}
          mediaType={mediaType}
          title={title}
        />
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon()}
            <Badge variant="outline" className="text-xs">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">{title}</h3>
          
          {(summary || content) && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {summary || content}
            </p>
          )}
          
          <ContentItemMeta 
            author={author} 
            createdAt={createdAt} 
          />
          
          <ContentItemTags 
            tags={tags} 
            onTagClick={onTagClick} 
          />
        </div>
      </CardContent>
      
      <CardFooter className="p-2 border-t">
        <ContentItemActions
          id={id}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
          metrics={metrics}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onComment={handleComment}
          onShare={handleShare}
        />
      </CardFooter>
    </Card>
  );
};
