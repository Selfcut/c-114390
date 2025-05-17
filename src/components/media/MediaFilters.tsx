
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, Calendar, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const mediaTypes = [
    { value: "all", label: "All Media" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "document", label: "Documents" },
    { value: "youtube", label: "YouTube" },
    { value: "text", label: "Text Only" }
  ];
  
  const sortOptions = [
    { value: "created_at", label: "Date Posted" },
    { value: "title", label: "Title" },
    { value: "likes", label: "Likes" },
    { value: "comments", label: "Comments" },
    { value: "views", label: "Views" }
  ];

  // Function to reset all filters
  const resetFilters = () => {
    setFilterType("all");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Media Type Filter */}
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-full" aria-label="Filter by media type">
          <SelectValue placeholder="Media Type" />
        </SelectTrigger>
        <SelectContent>
          {mediaTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort By Filter */}
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full" aria-label="Sort by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Order and Reset Button */}
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex-shrink-0"
          aria-label={sortOrder === "asc" ? "Sort descending" : "Sort ascending"}
        >
          {sortOrder === "asc" ? <ArrowDownAZ size={18} /> : <ArrowUpAZ size={18} />}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="flex items-center gap-1 flex-grow"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </Button>
      </div>

      {/* Active Filters Display (for responsive design) */}
      {filterType !== "all" && (
        <div className="sm:col-span-3 flex flex-wrap items-center gap-2 mt-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {mediaTypes.find(t => t.value === filterType)?.label || filterType}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 p-0 ml-1" 
              onClick={() => setFilterType("all")}
            >
              <X size={10} />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
};
