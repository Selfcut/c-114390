
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventFilterType } from '@/types/events';
import { useAuth } from '@/lib/auth';

interface EventsFiltersProps {
  currentFilter: EventFilterType;
  onFilterChange: (filter: EventFilterType) => void;
  categories?: string[];
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const EventsFilters = ({
  currentFilter,
  onFilterChange,
  categories = [],
  currentCategory,
  onCategoryChange
}: EventsFiltersProps) => {
  const { user } = useAuth();
  
  // Default categories if none provided
  const defaultCategories = [
    'Workshop',
    'Lecture',
    'Discussion',
    'Social',
    'Conference',
    'Study Group',
    'Research',
    'Webinar',
  ];
  
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Tabs
        defaultValue={currentFilter}
        value={currentFilter}
        onValueChange={(value) => onFilterChange(value as EventFilterType)}
        className="w-full sm:w-auto"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          {user && (
            <>
              <TabsTrigger value="attending">Attending</TabsTrigger>
              <TabsTrigger value="created">Created</TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>
      
      {onCategoryChange && (
        <div className="w-full sm:w-[180px]">
          <Select
            value={currentCategory}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {displayCategories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
