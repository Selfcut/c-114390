
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";

interface EventsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'conference', label: 'Conferences' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'lecture', label: 'Lectures' },
  { id: 'meetup', label: 'Meetups' },
  { id: 'webinar', label: 'Webinars' },
];

export const EventsFilters = ({ 
  searchQuery, 
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: EventsFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0"
        >
          <Calendar className="h-4 w-4" />
          <span className="sr-only">Calendar View</span>
        </Button>
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
