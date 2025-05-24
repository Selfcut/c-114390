
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TagsFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const TagsFilter: React.FC<TagsFilterProps> = ({
  tags,
  selectedTag,
  onSelectTag
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filter by Tags</h3>
        {selectedTag && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectTag(null)}
            className="h-6 px-2 text-xs"
          >
            <X size={12} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80"
            onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
