
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { EventWithAttendees, EventsFilter } from '@/types/events';
import { useEvents } from '@/hooks/useEvents';
import { format, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { useResponsive } from '@/hooks/useResponsive';

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
  const { events, isLoading, setFilter } = useEvents({ 
    filter: filter as any, 
    searchTerm 
  });
  const { isMobile } = useResponsive();
  
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
      <ResponsiveContainer>
        <ErrorMessage
          title="No events found"
          message={searchTerm ? 'Try a different search term' : `There are no ${filter} events`}
          onRetry={() => setFilter({ filter: 'all', searchTerm: '' })}
          variant="default"
          showIcon={false}
        />
      </ResponsiveContainer>
    );
  }
  
  return (
    <ResponsiveContainer className={className}>
      <div className="space-y-6">
        {displayEvents.map((event) => {
          const isPastEvent = isPast(new Date(event.date));
          
          return (
            <Card 
              key={event.id} 
              className={cn(
                "flex flex-col md:flex-row gap-6 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-primary",
                isPastEvent && "opacity-75"
              )}
              onClick={() => onEventClick && onEventClick(event)}
              role="article"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onEventClick) {
                  e.preventDefault();
                  onEventClick(event);
                }
              }}
              aria-label={`Event: ${event.title}`}
            >
              <div className={`${isMobile ? 'w-full h-48' : 'w-48 h-48'} rounded-md overflow-hidden bg-muted`}>
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={`${event.title} event image`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <CalendarDays className="h-12 w-12 text-primary/40" aria-hidden="true" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${isMobile ? 'text-lg' : 'text-xl'}`}>
                      {event.title}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
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
                  {event.description && (
                    <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-sm' : ''}`}>
                      {event.description}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    <CalendarDays className="h-4 w-4 mr-2" aria-hidden="true" />
                    <time dateTime={event.date}>
                      {formatEventDate(event.date)}
                    </time>
                  </div>
                  
                  {event.location && (
                    <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      <MapPin className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  
                  <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>
                      {event.attendees} {event.attendees === 1 ? 'person' : 'people'} attending
                      {event.max_attendees && ` (max: ${event.max_attendees})`}
                    </span>
                  </div>
                </div>
                
                <div className={`flex items-center pt-4 mt-4 border-t gap-2 ${isMobile ? 'flex-col space-y-2' : 'flex-row justify-between'}`}>
                  <Badge variant="outline" className="bg-primary/10 text-foreground">
                    {event.category}
                  </Badge>
                  
                  <AccessibleButton 
                    variant={
                      isPastEvent 
                        ? "outline" 
                        : event.user_status === "attending" 
                          ? "default" 
                          : "default"
                    }
                    disabled={isPastEvent}
                    onClick={(e) => e.stopPropagation()}
                    ariaLabel={
                      isPastEvent 
                        ? "Past event" 
                        : event.user_status === "attending" 
                          ? "Currently attending" 
                          : "RSVP to event"
                    }
                    className={isMobile ? 'w-full' : ''}
                  >
                    {isPastEvent 
                      ? "Past Event" 
                      : event.user_status === "attending" 
                        ? "Attending" 
                        : "RSVP Now"
                    }
                  </AccessibleButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ResponsiveContainer>
  );
};

// Skeleton loader for events list
const EventsListSkeleton = () => {
  return (
    <ResponsiveContainer>
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
    </ResponsiveContainer>
  );
};
