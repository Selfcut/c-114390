
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Plus, Search } from 'lucide-react';

interface EventsHeaderProps {
  canCreateEvent: boolean;
  onCreateEvent: () => void;
  onSearch: (term: string) => void;
  searchTerm?: string;
}

export const EventsHeader = ({
  canCreateEvent,
  onCreateEvent,
  onSearch,
  searchTerm = ''
}: EventsHeaderProps) => {
  const [searchValue, setSearchValue] = React.useState(searchTerm);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center">
        <CalendarIcon className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Events</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchValue}
              onChange={handleSearchInputChange}
            />
          </div>
          <Button type="submit" variant="outline">Search</Button>
        </form>
        
        {canCreateEvent && (
          <Button onClick={onCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
};
