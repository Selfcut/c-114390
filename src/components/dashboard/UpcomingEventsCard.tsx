
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useEvents } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export const UpcomingEventsCard = () => {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents({ 
    filter: 'upcoming',
    startDate: new Date(),
  });
  
  // Get next 3 upcoming events
  const upcomingEvents = events.slice(0, 3);
  
  const handleViewAllEvents = () => {
    navigate('/events');
  };
  
  const handleViewEvent = (eventId: string) => {
    navigate(`/events?id=${eventId}`);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleViewAllEvents}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <EventsLoadingState />
        ) : upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
                onClick={() => handleViewEvent(event.id)}
                role="button"
                tabIndex={0}
              >
                <div className="min-w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium leading-none line-clamp-1">{event.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {format(new Date(event.date), 'MMM d, yyyy • h:mm a')}
                  </p>
                  {event.location && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyEventsState />
        )}
      </CardContent>
    </Card>
  );
};

const EventsLoadingState = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center space-x-4 pb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyEventsState = () => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
    <h3 className="text-lg font-medium">No upcoming events</h3>
    <p className="text-sm text-muted-foreground mt-1 mb-4">
      Stay tuned for new events to be scheduled.
    </p>
    <Button variant="outline" size="sm" onClick={() => {}}>
      Check All Events
    </Button>
  </div>
);
