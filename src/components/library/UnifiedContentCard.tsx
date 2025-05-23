
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Bookmark, MessageCircle, Eye } from 'lucide-react';
import { UnifiedContentItem, ContentViewMode, ContentType } from '@/types/unified-content-types';
import { cn } from '@/lib/utils';

interface UnifiedContentCardProps {
  item: UnifiedContentItem;
  viewMode: ContentViewMode;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onBookmark?: () => void;
  onClick?: () => void;
}

export const UnifiedContentCard: React.FC<UnifiedContentCardProps> = ({
  item,
  viewMode,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onClick
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const getTypeColor = (type: ContentType) => {
    switch (type) {
      case ContentType.Quote:
        return 'bg-purple-100 text-purple-800';
      case ContentType.Knowledge:
        return 'bg-blue-100 text-blue-800';
      case ContentType.Media:
        return 'bg-green-100 text-green-800';
      case ContentType.Forum:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
        <div className="flex items-start p-4 space-x-4">
          {item.coverImage && (
            <img 
              src={item.coverImage} 
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={item.author.avatar} />
                  <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{item.author.name}</span>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
            {item.summary && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.summary}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {item.metrics?.likes !== undefined && (
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{item.metrics.likes}</span>
                  </span>
                )}
                {item.metrics?.comments !== undefined && (
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{item.metrics.comments}</span>
                  </span>
                )}
                {item.metrics?.views !== undefined && (
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.metrics.views}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("p-2", isLiked && "text-red-500")}
                  onClick={(e) => handleActionClick(e, onLike || (() => {}))}
                >
                  <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("p-2", isBookmarked && "text-blue-500")}
                  onClick={(e) => handleActionClick(e, onBookmark || (() => {}))}
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow h-full" onClick={handleCardClick}>
      {item.coverImage && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={item.coverImage} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2 mb-2">
          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
        </div>
        <h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
      </CardHeader>
      <CardContent className="pt-0">
        {item.summary && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{item.summary}</p>
        )}
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={item.author.avatar} />
            <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{item.author.name}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {item.metrics?.likes !== undefined && (
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{item.metrics.likes}</span>
              </span>
            )}
            {item.metrics?.comments !== undefined && (
              <span className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{item.metrics.comments}</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("p-2", isLiked && "text-red-500")}
              onClick={(e) => handleActionClick(e, onLike || (() => {}))}
            >
              <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("p-2", isBookmarked && "text-blue-500")}
              onClick={(e) => handleActionClick(e, onBookmark || (() => {}))}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
