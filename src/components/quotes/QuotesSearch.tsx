
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuotesSearchProps {
  search?: string;
  searchQuery?: string;
  onSearchChange: (value: string) => void;
  filterTag?: string | null;
  onTagClear?: () => void;
}

export const QuotesSearch: React.FC<QuotesSearchProps> = ({
  search,
  searchQuery,
  onSearchChange,
  filterTag,
  onTagClear
}) => {
  // Use either search or searchQuery prop (for backward compatibility)
  const currentSearch = search || searchQuery || "";
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search quotes..."
          className="pl-10"
          value={currentSearch}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {filterTag && onTagClear && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
            {filterTag}
            <button onClick={onTagClear} className="ml-1 hover:text-white">
              ×
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
};
