
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MediaSortControlsProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
}

export const MediaSortControls: React.FC<MediaSortControlsProps> = ({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <div className="flex">
        <Button
          variant={sortBy === 'created_at' ? 'default' : 'outline'}
          size="sm"
          className="rounded-r-none"
          onClick={() => setSortBy('created_at')}
        >
          Date
        </Button>
        <Button
          variant={sortBy === 'likes' ? 'default' : 'outline'}
          size="sm"
          className="rounded-none"
          onClick={() => setSortBy('likes')}
        >
          Likes
        </Button>
        <Button
          variant={sortBy === 'title' ? 'default' : 'outline'}
          size="sm"
          className="rounded-l-none flex items-center gap-1"
          onClick={() => {
            setSortBy('title');
          }}
        >
          Title
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-1"
      >
        {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
    </div>
  );
};
