
import React from 'react';
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TagsFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
}

export const TagsFilter: React.FC<TagsFilterProps> = ({
  tags,
  activeTag,
  onTagClick
}) => {
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
              variant={activeTag === tag ? "default" : "outline"} 
              size="sm"
              className="h-8"
              onClick={() => onTagClick(activeTag === tag ? null : tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
