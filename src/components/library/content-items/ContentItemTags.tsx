
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ContentItemTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export const ContentItemTags: React.FC<ContentItemTagsProps> = ({
  tags,
  onTagClick
}) => {
  if (!tags || tags.length === 0) return null;
  
  return (
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
        <Badge variant="outline" className="text-xs py-0">
          +{tags.length - 3}
        </Badge>
      )}
    </div>
  );
};
