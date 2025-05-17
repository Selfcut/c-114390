
import React from "react";
import { Button } from "@/components/ui/button";
import { MediaSortControls } from "@/components/media/MediaSortControls";

interface MediaFiltersProps {
  filterType: string;
  setFilterType: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
}

export const MediaFilters: React.FC<MediaFiltersProps> = ({
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Filter by:</span>
        <div className="flex flex-wrap">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'image' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
            onClick={() => setFilterType('image')}
          >
            Images
          </Button>
          <Button
            variant={filterType === 'video' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
            onClick={() => setFilterType('video')}
          >
            Videos
          </Button>
          <Button
            variant={filterType === 'youtube' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
            onClick={() => setFilterType('youtube')}
          >
            YouTube
          </Button>
          <Button
            variant={filterType === 'document' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
            onClick={() => setFilterType('document')}
          >
            Documents
          </Button>
          <Button
            variant={filterType === 'text' ? 'default' : 'outline'}
            size="sm"
            className="min-w-[70px]"
            onClick={() => setFilterType('text')}
          >
            Text
          </Button>
        </div>
      </div>
      
      <MediaSortControls 
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
};
