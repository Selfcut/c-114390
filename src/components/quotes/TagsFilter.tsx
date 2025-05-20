
import React from 'react';
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TagsFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  // Adding these as optional for backward compatibility 
  activeTag?: string | null;
  onTagClick?: (tag: string | null) => void;
}

export const TagsFilter: React.FC<TagsFilterProps> = ({
  tags,
  selectedTag,
  onSelectTag,
  // Support for legacy prop names
  activeTag,
  onTagClick
}) => {
  // Use either the new or legacy prop names
  const currentTag = selectedTag ?? activeTag ?? null;
  const handleTagSelect = onSelectTag || onTagClick || (() => {});
  
  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium mb-2 flex items-center">
        <Filter size={14} className="mr-2" />
        Filter by Tag
      </h2>
      <ScrollArea className="whitespace-nowrap pb-4">
        <div className="flex gap-2">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={currentTag === tag ? "default" : "outline"} 
              size="sm"
              className="h-8"
              onClick={() => handleTagSelect(currentTag === tag ? null : tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
