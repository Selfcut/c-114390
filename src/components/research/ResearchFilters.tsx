
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ResearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  disabled?: boolean;
}

export const ResearchFilters: React.FC<ResearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  disabled = false
}) => {
  // Sample research categories
  const categories = [
    'Machine Learning',
    'Artificial Intelligence',
    'Natural Language Processing',
    'Computer Vision',
    'Neuroscience',
    'Robotics',
    'Ethics',
    'cs.AI',
    'cs.CL',
    'cs.CV',
    'cs.LG',
    'stat.ML'
  ];
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search research papers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>
      
      <Select 
        value={selectedCategory || ""} 
        onValueChange={(value) => onCategoryChange(value || null)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
