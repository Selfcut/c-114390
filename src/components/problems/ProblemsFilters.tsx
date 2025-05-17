
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            className="pl-10"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category filter */}
        <div className="w-full sm:w-64">
          <Select
            value={category || ""}
            onValueChange={(value) => setCategory(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Sort options */}
      <div className="bg-muted/40 p-4 rounded-md">
        <Label className="block mb-2">Sort by:</Label>
        <RadioGroup 
          value={sortBy} 
          onValueChange={(value: 'severity' | 'solvability' | 'urgency') => setSortBy(value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severity" id="severity" />
            <Label htmlFor="severity">Severity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="urgency" id="urgency" />
            <Label htmlFor="urgency">Urgency</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solvability" id="solvability" />
            <Label htmlFor="solvability">Solvability</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
