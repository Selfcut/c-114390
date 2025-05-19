
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteSortOption } from '@/hooks/useQuotes';

interface QuotesSortingProps {
  value: QuoteSortOption;
  onChange: (value: QuoteSortOption) => void;
}

export const QuotesSorting: React.FC<QuotesSortingProps> = ({ value, onChange }) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as QuoteSortOption);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="most_liked">Most Liked</SelectItem>
          <SelectItem value="most_bookmarked">Most Bookmarked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
