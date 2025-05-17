
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Image, Quote as QuoteIcon, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentItemProps, MediaType } from './ContentItemTypes';
import { ContentItemMedia } from './ContentItemMedia';
import { ContentItemMeta } from './ContentItemMeta';
import { ContentItemTags } from './ContentItemTags';

export const ContentItemList: React.FC<ContentItemProps> = ({
  id,
  type,
  title,
  content,
  summary,
  author,
  createdAt,
  tags = [],
  coverImage,
  mediaUrl,
  mediaType,
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

  return (
    <Card 
      onClick={() => onClick?.(id)} 
      className={cn(
        "overflow-hidden cursor-pointer hover:shadow-md transition-all", 
        className
      )}
    >
      <CardContent className="p-0 grid grid-cols-12 gap-4 p-4">
        {(coverImage || mediaUrl) && (
          <div className="col-span-3">
            <ContentItemMedia
              mediaUrl={mediaUrl}
              coverImage={coverImage}
              mediaType={mediaType}
              title={title}
            />
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
    </Card>
  );
};
