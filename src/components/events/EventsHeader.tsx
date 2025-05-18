
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarPlus, Search } from 'lucide-react';

export interface EventsHeaderProps {
  onCreateEvent: () => void;
  onSearch: (term: string) => void;
  canCreateEvent?: boolean;
}

export const EventsHeader = ({ 
  onCreateEvent, 
  onSearch,
  canCreateEvent = true
}: EventsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground">Discover intellectual gatherings and knowledge-sharing events</p>
      </div>
      
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8 w-full md:w-[200px] lg:w-[300px]"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {canCreateEvent && (
          <Button onClick={onCreateEvent}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
};
