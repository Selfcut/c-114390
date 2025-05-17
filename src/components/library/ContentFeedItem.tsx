
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, MessageSquare, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import { ContentFeedItem as ContentItem } from '@/lib/content-types';

interface ContentFeedItemProps {
  item: ContentItem;
  userLikes: string[];
  userBookmarks: string[];
  onLike: (contentId: string, contentType: string) => void;
  onBookmark: (contentId: string, contentType: string) => void;
  onClick: (contentId: string, contentType: string) => void;
}

export const ContentFeedItem: React.FC<ContentFeedItemProps> = ({
  item,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onClick
}) => {
  const hasLiked = userLikes.includes(item.id);
  const hasBookmarked = userBookmarks.includes(item.id);
  
  const getContentTypeDetails = (type: string) => {
    switch (type) {
      case 'knowledge':
        return { color: 'bg-blue-100 text-blue-800', label: 'Knowledge' };
      case 'media':
        return { color: 'bg-purple-100 text-purple-800', label: 'Media' };
      case 'quotes':
        return { color: 'bg-amber-100 text-amber-800', label: 'Quote' };
      case 'ai':
        return { color: 'bg-green-100 text-green-800', label: 'AI Generated' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Content' };
    }
  };
  
  const typeDetails = getContentTypeDetails(item.type);
  
  const getContentUrl = () => {
    switch (item.type) {
      case 'knowledge':
        return `/library/knowledge/${item.id}`;
      case 'media':
        return `/library/media/${item.id}`;
      case 'quotes':
        return `/library/quotes/${item.id}`;
      case 'ai':
        return `/library/ai/${item.id}`;
      default:
        return `/library/content/${item.id}`;
    }
  };
  
  const contentUrl = getContentUrl();
  
  const handleClick = () => {
    onClick(item.id, item.type);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={contentUrl} onClick={handleClick}>
        {item.image && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={`${typeDetails.color} hover:${typeDetails.color}`}>{typeDetails.label}</Badge>
            {item.category && (
              <Badge variant="outline">{item.category}</Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold mt-2 line-clamp-2">{item.title}</h3>
        </CardHeader>
      </Link>
      
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{item.tags.length - 3}</Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{item.author?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[120px]">{item.author}</span>
          </div>
          <span>{formatDate(item.date)}</span>
        </div>
        
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 px-2 h-8"
              onClick={(e) => {
                e.preventDefault();
                onLike(item.id, item.type);
              }}
            >
              <Heart 
                size={16} 
                className={hasLiked ? "fill-red-500 text-red-500" : ""} 
              />
              <span>{item.likes || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 px-2 h-8"
              onClick={(e) => {
                e.preventDefault();
                onBookmark(item.id, item.type);
              }}
            >
              <Bookmark 
                size={16} 
                className={hasBookmarked ? "fill-primary text-primary" : ""} 
              />
              <span>{item.bookmarks || 0}</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            {item.comments !== undefined && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MessageSquare size={16} />
                <span>{item.comments}</span>
              </div>
            )}
            
            {item.views !== undefined && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Eye size={16} />
                <span>{item.views}</span>
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
