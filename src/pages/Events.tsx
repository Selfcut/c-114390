import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, addHours, isValid } from 'date-fns';
import { EventsList } from '@/components/events/EventsList';
import { useEvents } from '@/hooks/useEvents';
import { EventsFilter } from '@/types/events';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dateParam = searchParams.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  
  const [date, setDate] = useState<Date | undefined>(
    isValid(initialDate) ? initialDate : new Date()
  );
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(new Date());
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Other');
  const [newEventIsFeatured, setNewEventIsFeatured] = useState(false);
  
  // Use our events hook for data fetching
  const { events, isLoading, setFilter, createEvent } = useEvents({
    filter: 'all',
    startDate: date,
    endDate: date
  });

  // Update the URL when date changes
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setSearchParams({ date: formattedDate });
    }
  }, [date, setSearchParams]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setFilter({
        filter: 'all',
        startDate: newDate,
        endDate: newDate
      });
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const clearNewEventForm = () => {
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventDate(new Date());
    setNewEventLocation('');
    setNewEventCategory('Other');
    setNewEventIsFeatured(false);
  };

  const handleCreateEvent = async () => {
    if (!newEventTitle || !newEventDescription || !newEventDate || !newEventLocation || !newEventCategory) {
      alert('Please fill in all required fields.');
      return;
    }

    // Calculate end date (default to 1 hour after start)
    const endDate = addHours(newEventDate, 1);
    
    // Fixed by adding image_url field that was missing
    const eventData = {
      title: newEventTitle,
      description: newEventDescription,
      date: newEventDate.toISOString(),
      end_date: endDate.toISOString(),
      location: newEventLocation,
      category: newEventCategory,
      is_featured: newEventIsFeatured,
      max_attendees: null,
      image_url: null  // Add the required field with null value
    };

    const success = await createEvent(eventData);
    
    if (success) {
      setIsNewEventModalOpen(false);
      clearNewEventForm();
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
                <CardTitle>Events for {date ? format(date, 'MMMM dd, yyyy') : 'Today'}</CardTitle>
                <Button onClick={() => setIsNewEventModalOpen(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Event
                </Button>
              </div>
              <CardDescription>
                Browse and join upcoming events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList 
                filter="all" 
                searchTerm=""
                className="mt-4"
              />
            </CardContent>
          </Card>
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
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                    <span>{date ? format(date, "PPP") : "Pick a date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    components={{
                      IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
                      IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
                    }}
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* New Event Modal */}
      <Dialog open={isNewEventModalOpen} onOpenChange={setIsNewEventModalOpen}>
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
                    variant="outline"
                    className="col-span-3"
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
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
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
};

export default Events;
