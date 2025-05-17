
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface PostContentProps {
  content: string;
  tags?: string[];
}

export const PostContent = ({ content, tags = [] }: PostContentProps) => {
  return (
    <CardContent>
      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-line">{content}</p>
      </div>
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map((tag: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
              <Tag size={14} />
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </CardContent>
  );
};
