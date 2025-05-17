
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ContentFeedItem } from '@/hooks/useContentFeed';
import { Heart, Bookmark, MessageSquare, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from './ViewSwitcher';

interface ContentFeedItemProps {
  item: ContentFeedItem;
  userLikes: string[];
  userBookmarks: string[];
  onLike: (contentId: string, contentType: string) => void;
  onBookmark: (contentId: string, contentType: string) => void;
  onClick: (contentId: string, contentType: string) => void;
  viewMode: ViewMode;
}

export const ContentFeedItem: React.FC<ContentFeedItemProps> = ({
  item,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onClick,
  viewMode
}) => {
  const isLiked = userLikes.includes(item.id);
  const isBookmarked = userBookmarks.includes(item.id);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const handleClick = () => {
    onClick(item.id, item.type);
  };
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(item.id, item.type);
  };
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark(item.id, item.type);
  };
  
  const isGrid = viewMode === 'grid';
  const isList = viewMode === 'list';
  const isFeed = viewMode === 'feed';
  
  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-all overflow-hidden cursor-pointer",
        isGrid && "flex flex-col",
        isList && "flex flex-row",
        isFeed && "w-full"
      )}
      onClick={handleClick}
    >
      {/* Image (only in grid and list views) */}
      {item.image && (isGrid || isList) && (
        <div className={cn(
          "overflow-hidden",
          isGrid && "w-full h-40",
          isList && "w-32 h-full min-h-[100px]"
        )}>
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className={cn(
        "flex flex-col",
        isList && "flex-1"
      )}>
        <CardContent className={cn(
          "p-4",
          isList && "pb-0"
        )}>
          <div className="flex flex-col">
            {/* Type badge */}
            <div className="mb-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                item.type === 'knowledge' && "bg-blue-100 text-blue-800",
                item.type === 'media' && "bg-purple-100 text-purple-800",
                item.type === 'quotes' && "bg-amber-100 text-amber-800",
                item.type === 'ai' && "bg-green-100 text-green-800"
              )}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
            </div>
            
            {/* Title */}
            <h3 className={cn(
              "font-semibold mb-2",
              isGrid && "text-lg line-clamp-2",
              (isList || isFeed) && "text-xl"
            )}>
              {item.title}
            </h3>
            
            {/* Description */}
            <p className={cn(
              "text-muted-foreground mb-3",
              isGrid && "line-clamp-2 text-sm",
              isList && "line-clamp-2",
              isFeed && "line-clamp-3"
            )}>
              {item.description}
            </p>
            
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="bg-muted text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{item.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Footer */}
        <CardFooter className={cn(
          "p-4 pt-2 flex justify-between items-center border-t mt-auto",
          isList && "border-none"
        )}>
          <div className="text-xs text-muted-foreground">
            <span>By {item.author} • {formatDate(item.date)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Like button */}
            <button 
              className={cn(
                "flex items-center gap-1",
                isLiked && "text-red-500"
              )}
              onClick={handleLikeClick}
              aria-label="Like content"
            >
              <Heart size={16} className={isLiked ? "fill-red-500" : ""} />
              {typeof item.likes !== 'undefined' && (
                <span className="text-xs">{item.likes}</span>
              )}
            </button>
            
            {/* Bookmark button (only for quotes) */}
            {typeof item.bookmarks !== 'undefined' && (
              <button 
                className={cn(
                  "flex items-center gap-1",
                  isBookmarked && "text-blue-500"
                )}
                onClick={handleBookmarkClick}
                aria-label="Bookmark content"
              >
                <Bookmark size={16} className={isBookmarked ? "fill-blue-500" : ""} />
                <span className="text-xs">{item.bookmarks}</span>
              </button>
            )}
            
            {/* Comments indicator */}
            {typeof item.comments !== 'undefined' && item.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare size={16} />
                <span className="text-xs">{item.comments}</span>
              </div>
            )}
            
            {/* Views indicator */}
            {typeof item.views !== 'undefined' && item.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span className="text-xs">{item.views}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};
