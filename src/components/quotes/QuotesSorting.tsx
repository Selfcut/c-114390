
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuotesSortingProps {
  value: string;
  onChange: (value: string) => void;
}

export const QuotesSorting: React.FC<QuotesSortingProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Sort by</h3>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="most_liked">Most liked</SelectItem>
          <SelectItem value="most_bookmarked">Most bookmarked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
