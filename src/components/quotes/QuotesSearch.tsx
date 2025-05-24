
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuotesSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export const QuotesSearch: React.FC<QuotesSearchProps> = ({
  search,
  onSearchChange
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
      <Input
        placeholder="Search quotes..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {search && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => onSearchChange('')}
        >
          <X size={12} />
        </Button>
      )}
    </div>
  );
};
