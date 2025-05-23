
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Eye, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { UnifiedContentItem, ContentViewMode } from '@/types/unified-content-types';

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
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quote': return 'bg-purple-100 text-purple-800';
      case 'knowledge': return 'bg-blue-100 text-blue-800';
      case 'media': return 'bg-green-100 text-green-800';
      case 'forum': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'grid') {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
        {item.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
          {item.summary && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{item.summary}</p>
          )}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={item.author.avatar} alt={item.author.name} />
              <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{item.author.name}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLike} className="p-0 h-auto">
              <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-red-500 text-red-500")} />
              <span className="text-xs">{item.metrics?.likes || 0}</span>
            </Button>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{item.metrics?.comments || 0}</span>
            </div>
            {item.metrics?.views !== undefined && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-xs">{item.metrics.views}</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleBookmark} className="p-0 h-auto">
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {item.coverImage && (
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
            {item.summary && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.summary}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={item.author.avatar} alt={item.author.name} />
                  <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{item.author.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleLike} className="p-0 h-auto">
                  <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-red-500 text-red-500")} />
                  <span className="text-xs">{item.metrics?.likes || 0}</span>
                </Button>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">{item.metrics?.comments || 0}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBookmark} className="p-0 h-auto">
                  <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
