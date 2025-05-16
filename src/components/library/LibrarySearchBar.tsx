
import { Search } from "lucide-react";

interface LibrarySearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const LibrarySearchBar = ({ searchTerm, onSearchChange }: LibrarySearchBarProps) => {
  return (
    <div className="relative flex-1 w-full">
      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search the library..."
        className="w-full bg-background border border-input rounded-md py-2 pl-10 pr-4 text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
