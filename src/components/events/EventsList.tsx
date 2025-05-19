
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { EventWithAttendees, EventsFilter } from '@/types/events';
import { useEvents } from '@/hooks/useEvents';
import { format, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface EventsListProps {
  filter?: string;
  searchTerm?: string;
  onEventClick?: (event: EventWithAttendees) => void;
  className?: string;
  limit?: number;
}

export const EventsList = ({ 
  filter = 'all', 
  searchTerm = '',
  onEventClick,
  className,
  limit
}: EventsListProps) => {
  // Use the events hook for real data
  const { events, isLoading, setFilter } = useEvents({ 
    filter: filter as any, 
    searchTerm 
  });
  
  // Apply limit if specified
  const displayEvents = limit && events.length > limit
    ? events.slice(0, limit)
    : events;
    
  // Function to format event date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy • h:mm a');
  };
  
  if (isLoading) {
    return <EventsListSkeleton />;
  }
  
  if (displayEvents.length === 0) {
    return (
      <div className={cn("text-center py-16 border rounded-lg", className)}>
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">No events found</h3>
        <p className="text-muted-foreground mb-6">
          {searchTerm ? 'Try a different search term' : `There are no ${filter} events`}
        </p>
        <Button onClick={() => setFilter({ filter: 'all', searchTerm: '' })}>
          Browse All Events
        </Button>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {displayEvents.map((event) => {
        const isPastEvent = isPast(new Date(event.date));
        
        return (
          <Card 
            key={event.id} 
            className={cn(
              "flex flex-col md:flex-row gap-6 p-6 hover:shadow-md transition-shadow cursor-pointer",
              isPastEvent && "opacity-75"
            )}
            onClick={() => onEventClick && onEventClick(event)}
          >
            <div className="w-full md:w-48 h-48 rounded-md overflow-hidden bg-muted">
              {event.image_url ? (
                <img 
                  src={event.image_url} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <CalendarDays className="h-12 w-12 text-primary/40" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-xl font-medium">{event.title}</h3>
                  <div className="flex gap-2">
                    {event.is_featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    {event.user_status && (
                      <Badge variant={
                        event.user_status === 'attending' ? 'default' : 
                        event.user_status === 'interested' ? 'outline' : 
                        'destructive'
                      }>
                        {event.user_status.charAt(0).toUpperCase() + event.user_status.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mt-1">{event.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{formatEventDate(event.date)}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {event.attendees} {event.attendees === 1 ? 'person' : 'people'} attending
                    {event.max_attendees && ` (max: ${event.max_attendees})`}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center pt-4 mt-4 border-t gap-2">
                <Badge variant="outline" className="bg-primary/10 text-foreground">
                  {event.category}
                </Badge>
                
                <div className="flex-grow"></div>
                
                <Button 
                  className="ml-auto"
                  variant={
                    isPastEvent 
                      ? "outline" 
                      : event.user_status === "attending" 
                        ? "default" 
                        : "default"
                  }
                  disabled={isPastEvent}
                >
                  {isPastEvent 
                    ? "Past Event" 
                    : event.user_status === "attending" 
                      ? "Attending" 
                      : "RSVP Now"
                  }
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Skeleton loader for events list
const EventsListSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="flex flex-col md:flex-row gap-6 p-6">
          <Skeleton className="w-full md:w-48 h-48 rounded-md" />
          <div className="flex-1 space-y-4">
            <div>
              <Skeleton className="h-7 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-2" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            
            <div className="pt-4 mt-4 border-t flex justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
