
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ResearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'physics', label: 'Physics' },
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'biology', label: 'Biology' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'psychology', label: 'Psychology' },
  { id: 'philosophy', label: 'Philosophy' },
];

export const ResearchFilters = ({ 
  searchQuery, 
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: ResearchFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search research papers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={category.id === (selectedCategory || 'all') ? "secondary" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id === 'all' ? null : category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
