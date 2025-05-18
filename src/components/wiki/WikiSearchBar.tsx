
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface WikiSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  disabled?: boolean;
}

export const WikiSearchBar: React.FC<WikiSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery,
  disabled = false
}) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Search articles by title, description, or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
        disabled={disabled}
      />
    </div>
  );
};
