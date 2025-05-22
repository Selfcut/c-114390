
import React, { useState, useMemo, useCallback } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DayContentProps } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { EventList } from './EventList';
import { useEvents } from '@/hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types/events';

interface EventDateMap {
  [dateKey: string]: number;
}

// Custom Day Content component that uses memoization
const MemoizedDayContent = React.memo(({ date, events }: { date: Date; events: Event[] }) => {
  const navigate = useNavigate();
  
  // Count events for this specific date
  const eventCount = useMemo(() => 
    events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    }).length,
  [events, date]);
  
  // Navigate to filtered events when badge is clicked
  const handleBadgeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const formattedDate = format(date, 'yyyy-MM-dd');
    navigate(`/events?date=${formattedDate}`);
  }, [date, navigate]);
  
  return (
    <div className="relative">
      <div>{date.getDate()}</div>
      {eventCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute top-1 right-1 text-[10px] px-1 py-0.5 rounded-md cursor-pointer"
          onClick={handleBadgeClick}
        >
          {eventCount}
        </Badge>
      )}
    </div>
  );
});

MemoizedDayContent.displayName = 'MemoizedDayContent';

// Wrapper component to make it compatible with react-day-picker
function DayContentWrapper(props: DayContentProps) {
  const { events } = useEvents();
  if (!props.date) return null;
  return <MemoizedDayContent date={props.date} events={events} />;
}

export const OptimizedEventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { events, isLoading } = useEvents();
  const navigate = useNavigate();

  // Memoized navigation to avoid recreating on every render
  const handleDateChange = useCallback((newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const formattedDate = format(newDate, 'yyyy-MM-dd');
      navigate(`/events?date=${formattedDate}`);
    }
  }, [navigate]);

  // Memoized icons to avoid recreation
  const IconLeft = useMemo(() => (props: any) => <ChevronLeft className="h-4 w-4" {...props} />, []);
  const IconRight = useMemo(() => (props: any) => <ChevronRight className="h-4 w-4" {...props} />, []);

  // Filter events for the selected date
  const filteredEvents = useMemo(() => {
    if (!date || !events) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  }, [date, events]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          <CalendarIcon className="mr-2 h-4 w-4 inline" />
          Events Calendar
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Select a date to view events
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="border-none shadow-none"
          components={{
            DayContent: DayContentWrapper,
            IconLeft,
            IconRight,
          }}
        />
        <div className="mb-4">
          <h4 className="mb-2 font-semibold">
            Events on {date ? format(date, 'MMMM dd, yyyy') : 'Select a date'}
          </h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <EventList date={date} events={filteredEvents} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
