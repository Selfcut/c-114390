
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WikiSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const WikiSearchBar = ({ searchQuery, setSearchQuery }: WikiSearchBarProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="pl-10"
        placeholder="Search wiki articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
