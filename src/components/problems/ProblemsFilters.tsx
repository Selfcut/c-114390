
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProblemsFiltersProps {
  sortBy: 'severity' | 'solvability' | 'urgency';
  setSortBy: (sortBy: 'severity' | 'solvability' | 'urgency') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  categories: string[];
}

export const ProblemsFilters = ({
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  categories
}: ProblemsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-3">
        <Select value={category || 'all'} onValueChange={(value) => setCategory(value === 'all' ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'severity' | 'solvability' | 'urgency')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="severity">Severity</SelectItem>
            <SelectItem value="urgency">Urgency</SelectItem>
            <SelectItem value="solvability">Solvability</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
