
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WikiSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const WikiSearchBar = ({ searchQuery, setSearchQuery }: WikiSearchBarProps) => {
  return (
    <div className="mb-6 w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search wiki articles..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
