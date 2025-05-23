
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContentItemAuthor } from './ContentItemTypes';

interface ContentItemMetaProps {
  author: ContentItemAuthor;
  createdAt: Date | string;
}

export const ContentItemMeta: React.FC<ContentItemMetaProps> = ({
  author,
  createdAt
}) => {
  // Format date consistently
  const formatDate = (date: Date | string): string => {
    return typeof date === 'string' 
      ? new Date(date).toLocaleDateString() 
      : date.toLocaleDateString();
  };
  
  return (
    <div className="flex items-center mt-2">
      <Avatar className="h-6 w-6 mr-2">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-xs text-muted-foreground">
        {author.name} • {formatDate(createdAt)}
      </span>
    </div>
  );
};
