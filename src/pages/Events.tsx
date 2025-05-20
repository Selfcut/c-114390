import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDaysIcon, PlusIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EventList } from '@/components/events/EventList';
import { EmptyState } from '@/components/EmptyState';
import { supabase } from '@/integrations/supabase/client';
import { EventWithAttendees } from '@/types/events';
import { format } from 'date-fns';

const Events: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<EventWithAttendees[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(new Date());
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Other');
  const [newEventIsFeatured, setNewEventIsFeatured] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          attendees: event_attendees(count)
        `);

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      const eventsWithAttendees = data.map(event => ({
        ...event,
        attendees: event.attendees.length > 0 ? event.attendees[0].count : 0
      }));

      setEvents(eventsWithAttendees);
    } finally {
      setIsLoading(false);
    }
  };

  const openNewEventModal = () => {
    setIsNewEventModalOpen(true);
  };

  const closeNewEventModal = () => {
    setIsNewEventModalOpen(false);
    clearNewEventForm();
  };

  const clearNewEventForm = () => {
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventDate(undefined);
    setNewEventLocation('');
    setNewEventCategory('Other');
    setNewEventIsFeatured(false);
  };

  const handleCreateEvent = async () => {
    if (!newEventTitle || !newEventDescription || !newEventDate || !newEventLocation || !newEventCategory) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert([
          {
            title: newEventTitle,
            description: newEventDescription,
            date: newEventDate.toISOString(),
            location: newEventLocation,
            category: newEventCategory,
            is_featured: newEventIsFeatured,
          },
        ]);

      if (error) {
        console.error('Error creating event:', error);
        return;
      }

      fetchEvents();
      closeNewEventModal();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Events</CardTitle>
                <Button onClick={openNewEventModal}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Event
                </Button>
              </div>
              <CardDescription>
                Browse and join upcoming events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {/* Updated EventList component to receive the required props */}
                  <EventList 
                    events={events}
                  />
                </div>
              ) : (
                <EmptyState 
                  title="No events found" 
                  description="There are no upcoming events scheduled at the moment."
                  action={
                    <Button onClick={openNewEventModal}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create an Event
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
          
          {/* Additional content can go here */}
        </div>
        
        {/* Calendar and filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={format(date || new Date(), 'PPP')}
                  >
                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                    <span>{date ? format(date, "PPP") : "Pick a date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date("2020-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
          
          {/* Filters can go here */}
        </div>
      </div>
      
      {/* New Event Modal */}
      <Dialog open={isNewEventModalOpen} onOpenChange={setIsNewEventModalOpen}>
        <DialogTrigger asChild>
          {/* This trigger is not visible, the button in the card header is used */}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={format(newEventDate || new Date(), 'PPP')}
                  >
                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                    <span>{newEventDate ? format(newEventDate, "PPP") : "Pick a date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEventDate}
                    onSelect={setNewEventDate}
                    disabled={(date) =>
                      date < new Date("2020-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                type="text"
                id="location"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select onValueChange={setNewEventCategory} defaultValue={newEventCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isFeatured" className="text-right">
                Featured
              </Label>
              <Checkbox
                id="isFeatured"
                checked={newEventIsFeatured}
                onCheckedChange={(checked) => setNewEventIsFeatured(!!checked)}
                className="ml-4"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={handleCreateEvent}>Create Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Events;
