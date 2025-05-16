
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

interface MediaFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
  sortBy: "newest" | "oldest" | "popular";
  setSortBy: (sort: "newest" | "oldest" | "popular") => void;
}

export const MediaFilters = ({ filterType, setFilterType, sortBy, setSortBy }: MediaFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filter by:</span>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All media types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="text">Text only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Newest first" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => {
          setFilterType("all");
          setSortBy("newest");
        }}
        className="flex items-center gap-1 ml-auto"
      >
        <FilterX size={16} />
        <span>Clear filters</span>
      </Button>
    </div>
  );
};
