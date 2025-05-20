
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { EventWithAttendees } from '@/types/events';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Users } from 'lucide-react';

interface EventListProps {
  date?: Date;
  events: EventWithAttendees[];
  onEventClick?: (event: EventWithAttendees) => void;
}

export const EventList: React.FC<EventListProps> = ({ date, events, onEventClick }) => {
  // Filter events for the selected date if a date is provided
  const filteredEvents = date 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      })
    : events;

  if (filteredEvents.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        {date ? 'No events scheduled for this date.' : 'No events found.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredEvents.map(event => (
        <Card 
          key={event.id} 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onEventClick && onEventClick(event)}
        >
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h5 className="font-medium truncate">{event.title}</h5>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  <span>{format(new Date(event.date), 'h:mm a')}</span>
                </div>
                {event.location && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{event.attendees} {event.attendees === 1 ? 'attendee' : 'attendees'}</span>
                </div>
              </div>
              <Badge variant={event.is_featured ? 'default' : 'outline'}>
                {event.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
