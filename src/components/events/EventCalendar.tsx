
import React, { useState, useEffect, useMemo } from 'react';
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

// This is a regular function component, not using React.memo
const DayContent = ({ date }: DayContentProps) => {
  const { events } = useEvents();
  const navigate = useNavigate();

  // Calculate event count only when needed
  const eventCount = useMemo(() => {
    if (!date) return 0;
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    }).length;
  }, [date, events]);
  
  // Handle navigation on badge click
  const handleBadgeClick = (e: React.MouseEvent) => {
    if (!date) return;
    
    e.preventDefault();
    e.stopPropagation();
    const formattedDate = format(date, 'yyyy-MM-dd');
    navigate(`/events?date=${formattedDate}`);
  };
  
  if (!date) return null;
  
  return (
    <div className="relative">
      <div>{date.getDate()}</div>
      {eventCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute top-1 right-1 text-[10px] px-1 py-0.5 rounded-md"
          onClick={handleBadgeClick}
        >
          {eventCount}
        </Badge>
      )}
    </div>
  );
};

export const EventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { events, isLoading } = useEvents();
  const navigate = useNavigate();

  // Update URL when date changes
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      navigate(`/events?date=${formattedDate}`);
    }
  }, [date, navigate]);
  
  // Memoize filtered events to prevent recalculation
  const filteredEvents = useMemo(() => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  }, [events, date]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          <CalendarIcon className="mr-2 h-4 w-4" />
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
          onSelect={setDate}
          className="border-none shadow-none"
          components={{
            DayContent,
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
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
