
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface TagsDisplayProps {
  tags: string[];
  onClick?: (tag: string) => void;
  className?: string;
  interactive?: boolean;
}

export const TagsDisplay: React.FC<TagsDisplayProps> = ({
  tags,
  onClick,
  className = '',
  interactive = false
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    if (interactive && onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(tag);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Badge 
          key={`${tag}-${index}`}
          variant="secondary" 
          className={`flex items-center ${interactive ? 'cursor-pointer hover:bg-secondary/80' : ''}`}
          onClick={interactive ? (e) => handleTagClick(e, tag) : undefined}
        >
          <Tag size={12} className="mr-1" />
          <span>{tag}</span>
        </Badge>
      ))}
    </div>
  );
};
