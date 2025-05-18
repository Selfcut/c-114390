
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface EventsFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const EventsFilters = ({ currentFilter, onFilterChange }: EventsFiltersProps) => {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="font-medium text-lg">Filter Events</h3>
      
      <RadioGroup 
        value={currentFilter} 
        onValueChange={onFilterChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">All Events</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upcoming" id="upcoming" />
          <Label htmlFor="upcoming">Upcoming</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="past" id="past" />
          <Label htmlFor="past">Past Events</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="attending" id="attending" />
          <Label htmlFor="attending">I'm Attending</Label>
        </div>
      </RadioGroup>
      
      <div className="pt-4 border-t">
        <Label className="text-md font-medium mb-2 block">Categories</Label>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="mr-2 mt-2">
            Seminars
          </Button>
          <Button variant="outline" size="sm" className="mr-2 mt-2">
            Workshops
          </Button>
          <Button variant="outline" size="sm" className="mr-2 mt-2">
            Conferences
          </Button>
          <Button variant="outline" size="sm" className="mr-2 mt-2">
            Journal Clubs
          </Button>
        </div>
      </div>
    </div>
  );
};
