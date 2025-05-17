
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MediaSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const MediaSearchBar = ({ searchTerm, setSearchTerm }: MediaSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search media..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};
