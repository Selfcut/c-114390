
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, Calendar, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ResearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortByDate: boolean;
  onSortChange: (sortByDate: boolean) => void;
  onRefresh?: () => void;
  disabled?: boolean;
}

export const ResearchFilters: React.FC<ResearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortByDate,
  onSortChange,
  onRefresh,
  disabled = false
}) => {
  // Research categories - these should match the categories fetched from arXiv
  const categories = [
    'Artificial Intelligence',
    'Machine Learning',
    'Computational Linguistics',
    'Natural Language Processing',
    'Computer Vision',
    'Neuroscience',
    'Robotics',
    'Cybersecurity',
    'Software Engineering',
    'Biomolecular Research',
    'Medical Physics',
    'Neural Computing',
    'Computing and Society',
    'Quantitative Finance',
    'Social Physics'
  ];
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
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
      
      {/* Sort Toggle */}
      <ToggleGroup type="single" value={sortByDate ? "date" : "title"}>
        <ToggleGroupItem 
          value="date" 
          aria-label="Sort by date"
          onClick={() => onSortChange(true)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Date
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="title" 
          aria-label="Sort by title"
          onClick={() => onSortChange(false)}
        >
          <SortAsc className="h-4 w-4 mr-2" />
          Title
        </ToggleGroupItem>
      </ToggleGroup>
      
      {/* Category Selector */}
      <Select 
        value={selectedCategory || "all"} 
        onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Refresh Button */}
      {onRefresh && (
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={disabled}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      )}
    </div>
  );
};
