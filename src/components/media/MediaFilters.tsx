
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface MediaFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
  sortBy: string;
  setSortBy: (value: any) => void;
}

export const MediaFilters = ({ filterType, setFilterType, sortBy, setSortBy }: MediaFiltersProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filterType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("all")}
        >
          All
        </Button>
        <Button 
          variant={filterType === "image" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("image")}
        >
          Images
        </Button>
        <Button 
          variant={filterType === "video" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("video")}
        >
          Videos
        </Button>
        <Button 
          variant={filterType === "document" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("document")}
        >
          Documents
        </Button>
        <Button 
          variant={filterType === "youtube" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("youtube")}
        >
          YouTube
        </Button>
        <Button 
          variant={filterType === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("text")}
        >
          Text
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-muted-foreground" />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest</SelectItem>
            <SelectItem value="likes">Most Popular</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
