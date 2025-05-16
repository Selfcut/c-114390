
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Bookmark, Share, BookOpen, Image, Quote as QuoteIcon, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContentItemType = 'knowledge' | 'media' | 'quote' | 'ai';

export interface ContentItemProps {
  id: string;
  type: ContentItemType;
  title: string;
  content?: string;
  summary?: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: Date | string;
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    bookmarks?: number;
  };
  tags?: string[];
  coverImage?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | 'youtube' | 'text';
  viewMode: 'grid' | 'list' | 'feed';
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export const UnifiedContentItem = ({
  id,
  type,
  title,
  content,
  summary,
  author,
  createdAt,
  metrics = {},
  tags = [],
  coverImage,
  mediaUrl,
  mediaType,
  viewMode,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onClick,
  onTagClick,
  className
}: ContentItemProps) => {
  // Format the date
  const formattedDate = typeof createdAt === 'string' 
    ? new Date(createdAt).toLocaleDateString() 
    : createdAt.toLocaleDateString();

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

  // Determine the card style based on view mode
  const getCardStyle = () => {
    switch(viewMode) {
      case 'grid':
        return "flex flex-col h-full";
      case 'list':
        return "flex flex-row h-full";
      case 'feed':
        return "flex flex-col h-full";
      default:
        return "flex flex-col h-full";
    }
  };

  // Determine the content style based on view mode
  const getContentStyle = () => {
    switch(viewMode) {
      case 'grid':
        return "";
      case 'list':
        return "flex-1";
      case 'feed':
        return "";
      default:
        return "";
    }
  };

  // Render media content based on type
  const renderMedia = () => {
    if (!mediaUrl && !coverImage) return null;
    
    const url = mediaUrl || coverImage;
    
    switch(mediaType) {
      case 'image':
        return (
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
            <img 
              src={url} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
            <video 
              src={url} 
              controls 
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'youtube':
        return (
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
            <iframe
              src={url}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        );
      default:
        if (url) {
          return (
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
              <img 
                src={url} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>
          );
        }
        return null;
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
      <CardContent className={cn("p-0", getCardStyle())}>
        {viewMode === 'list' ? (
          <div className="grid grid-cols-12 gap-4 p-4">
            {(coverImage || mediaUrl) && (
              <div className="col-span-3">
                {renderMedia()}
              </div>
            )}
            <div className={cn("flex flex-col", (coverImage || mediaUrl) ? "col-span-9" : "col-span-12")}>
              <div className="flex items-center gap-2 mb-2">
                {getTypeIcon()}
                <Badge variant="outline" className="text-xs">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold mb-1 line-clamp-2">{title}</h3>
              
              {(summary || content) && (
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                  {summary || content}
                </p>
              )}
              
              <div className="flex items-center mt-auto">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{author.name} • {formattedDate}</span>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.slice(0, 3).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs py-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick?.(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge variant="outline" className="text-xs py-0">+{tags.length - 3}</Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {renderMedia()}
            
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
              
              <div className="flex items-center mt-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{author.name} • {formattedDate}</span>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.slice(0, 3).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs py-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick?.(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge variant="outline" className="text-xs py-0">+{tags.length - 3}</Badge>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      {viewMode === 'feed' && (
        <CardFooter className="p-2 border-t">
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              className={isLiked ? "text-red-500" : ""}
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(id);
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
                  onComment(id);
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
                onBookmark?.(id);
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
                  onShare(id);
                }}
              >
                <Share size={16} />
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
