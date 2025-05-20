
import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { isValid, format, parseISO, isToday } from 'date-fns'; // Import isValid

interface Event {
  id: string;
  title: string;
  date: string;
  image_url?: string;
  category: string;
}

interface EventCalendarProps {
  events: Event[];
  isLoading: boolean;
  onDateSelect?: (date: Date | undefined) => void;
  onEventClick?: (eventId: string) => void;
  selectedDate?: Date;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  isLoading,
  onDateSelect,
  onEventClick,
  selectedDate
}) => {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(selectedDate || new Date());
  const [eventsOnDate, setEventsOnDate] = useState<Event[]>([]);

  // Function to determine which dates have events
  const eventsDateRenderer = (date: Date) => {
    // Check if the date is valid before performing operations on it
    if (!isValid(date)) return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasEvents = events.some(event => {
      try {
        const eventDate = parseISO(event.date);
        return isValid(eventDate) && format(eventDate, 'yyyy-MM-dd') === dateStr;
      } catch (error) {
        console.error('Invalid event date:', event.date, error);
        return false;
      }
    });

    return hasEvents ? (
      <div className="relative">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      </div>
    ) : null;
  };

  // Filter events for the selected date
  useEffect(() => {
    if (!currentDate || !isValid(currentDate)) {
      setEventsOnDate([]);
      return;
    }

    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const filteredEvents = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isValid(eventDate) && format(eventDate, 'yyyy-MM-dd') === dateStr;
      } catch (error) {
        console.error('Invalid event date:', event.date, error);
        return false;
      }
    });

    setEventsOnDate(filteredEvents);
  }, [currentDate, events]);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setCurrentDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentDate) {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentDate) {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  // Navigate to current month
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-8 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-full mt-4" />
        <Skeleton className="h-12 w-full mt-2" />
        <Skeleton className="h-12 w-full mt-2" />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Calendar</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToCurrentMonth}>
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={handleDateSelect}
        className="rounded-md border"
        components={{
          DayContent: (props) => (
            <>
              {props.day}
              {eventsDateRenderer(props.date)}
            </>
          )
        }}
      />
      
      <div className="mt-4">
        {currentDate && isValid(currentDate) ? (
          <h4 className="text-md font-medium mb-2">
            Events on {format(currentDate, 'MMMM d, yyyy')} 
            {isToday(currentDate) && <span className="ml-1 text-primary">(Today)</span>}
          </h4>
        ) : (
          <h4 className="text-md font-medium mb-2">Select a date</h4>
        )}
        
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4">
            {eventsOnDate.length > 0 ? (
              eventsOnDate.map(event => (
                <div 
                  key={event.id} 
                  className="p-3 border rounded-md mb-2 hover:bg-muted cursor-pointer"
                  onClick={() => onEventClick && onEventClick(event.id)}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.category}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No events scheduled for this date
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
