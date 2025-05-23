
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Bookmark, MessageCircle, Eye, ThumbsUp, Share2 } from 'lucide-react';
import { UnifiedContentItem, ContentViewMode } from '@/types/unified-content-types';
import { ContentItemType } from './content-items/ContentItemTypes';
import { formatDistanceToNow } from 'date-fns';

interface ContentFeedItemComponentProps {
  item: UnifiedContentItem;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  onLike: (id: string, type: ContentItemType) => void;
  onBookmark: (id: string, type: ContentItemType) => void;
  onClick: (id: string, type: ContentItemType) => void;
  viewMode: ContentViewMode;
}

export const ContentFeedItemComponent: React.FC<ContentFeedItemComponentProps> = ({
  item,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onClick,
  viewMode
}) => {
  const isLiked = userLikes[item.id] || false;
  const isBookmarked = userBookmarks[item.id] || false;

  const getContentTypeFromString = (type: string): ContentItemType => {
    switch (type.toLowerCase()) {
      case 'quote': return ContentItemType.Quote;
      case 'knowledge': return ContentItemType.Knowledge;
      case 'media': return ContentItemType.Media;
      case 'forum': return ContentItemType.Forum;
      case 'wiki': return ContentItemType.Wiki;
      case 'research': return ContentItemType.Research;
      default: return ContentItemType.Quote;
    }
  };

  const itemType = getContentTypeFromString(item.type);

  const handleClick = () => onClick(item.id, itemType);
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(item.id, itemType);
  };
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark(item.id, itemType);
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'quote': return '💭';
      case 'knowledge': return '📚';
      case 'media': return '🎬';
      case 'forum': return '💬';
      case 'wiki': return '📝';
      case 'research': return '🔬';
      default: return '📄';
    }
  };

  const getActionMetrics = () => {
    const metrics = item.metrics;
    return {
      likes: metrics.likes || metrics.upvotes || 0,
      comments: metrics.comments || 0,
      bookmarks: metrics.bookmarks || 0,
      views: metrics.views || 0
    };
  };

  const actionMetrics = getActionMetrics();

  if (viewMode === 'grid') {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-shadow group" onClick={handleClick}>
        {item.coverImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img 
              src={item.coverImage} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getTypeIcon()}</span>
            <Badge variant="secondary" className="text-xs">
              {item.type}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
          
          {item.content && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
              {item.content}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={item.author.avatar} alt={item.author.name} />
              <AvatarFallback className="text-xs">
                {item.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{item.author.name}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
            {actionMetrics.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{actionMetrics.views}</span>
              </div>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-8 px-2 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{actionMetrics.likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`h-8 px-2 ${isBookmarked ? 'text-yellow-500' : ''}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              <span>{actionMetrics.comments}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {(item.coverImage || item.mediaUrl) && (
            <div className="flex-shrink-0">
              <img 
                src={item.coverImage || item.mediaUrl} 
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{getTypeIcon()}</span>
              <Badge variant="secondary" className="text-xs">
                {item.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(item.createdAt, { addSuffix: true })}
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
            
            {item.content && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {item.content}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.author.avatar} alt={item.author.name} />
                  <AvatarFallback className="text-xs">
                    {item.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{item.author.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`h-8 px-2 ${isLiked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{actionMetrics.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`h-8 px-2 ${isBookmarked ? 'text-yellow-500' : ''}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  <span>{actionMetrics.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
