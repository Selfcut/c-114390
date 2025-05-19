
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { EventWithAttendees, CalendarView } from '@/types/events';
import { format, isToday, isSameDay, isSameMonth } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EventCalendarProps {
  events: EventWithAttendees[];
  onEventClick?: (event: EventWithAttendees) => void;
  onDateSelect?: (date: Date) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onEventClick,
  onDateSelect
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<CalendarView>('month');
  
  // Filter events for the selected date in day view
  const eventsForSelectedDate = selectedDate 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return isSameDay(eventDate, selectedDate);
      })
    : [];
  
  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };
  
  // Custom day render to show events
  const renderDay = (day: Date, modifiers: { today: boolean }) => {
    // Check if there are events on this day
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
    
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div className="relative w-full h-full p-0">
        <span className={cn(
          "absolute top-1 left-1 text-xs",
          isToday(day) && "font-bold text-primary"
        )}>
          {format(day, "d")}
        </span>
        {hasEvents && (
          <div className="absolute bottom-1 w-full flex justify-center">
            <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
            {dayEvents.length > 1 && (
              <div className="h-1.5 w-1.5 bg-primary rounded-full ml-0.5"></div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Function to render agenda view
  const renderAgenda = () => {
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return (
      <ScrollArea className="h-[500px]">
        <div className="space-y-2 p-2">
          {sortedEvents.length > 0 ? (
            sortedEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => onEventClick && onEventClick(event)}
              />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No events found
            </div>
          )}
        </div>
      </ScrollArea>
    );
  };
  
  // Function to render day view
  const renderDayView = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => onEventClick && onEventClick(event)}
                  />
                ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No events scheduled for this day
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <Tabs defaultValue="month" value={view} onValueChange={(v) => setView(v as CalendarView)}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Events Calendar</h2>
          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger value="month"><CalendarIcon className="h-4 w-4 mr-2" />Month</TabsTrigger>
              <TabsTrigger value="agenda"><List className="h-4 w-4 mr-2" />Agenda</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="month" className="p-0 m-0">
          <div className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onDayClick={handleDateSelect}
              renderDay={renderDay}
              className="rounded-md"
            />
          </div>
          {selectedDate && (
            <div className="border-t">
              {renderDayView()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="agenda" className="p-4 m-0">
          {renderAgenda()}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// Event card component
interface EventCardProps {
  event: EventWithAttendees;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const eventDate = new Date(event.date);
  
  return (
    <Card 
      className={cn(
        "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
        event.is_featured && "border-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{event.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
        </div>
        <div className="text-xs text-muted-foreground min-w-[60px] text-right">
          {format(eventDate, 'h:mm a')}
        </div>
      </div>
      <div className="flex items-center mt-2 text-xs text-muted-foreground">
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full mr-2">
          {event.category}
        </span>
        <span>{event.attendees} attending</span>
      </div>
    </Card>
  );
};
