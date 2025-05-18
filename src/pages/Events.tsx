import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin, Clock, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { PageLayout } from "@/components/layouts/PageLayout";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventsFilters } from "@/components/events/EventsFilters";
import { EventsList } from "@/components/events/EventsList";

// Event type definition
interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: string;
  attendees: string[];
}

const Events = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Philosophy Discussion Group",
      description: "Weekly discussion on consciousness and the nature of reality",
      date: new Date(2025, 4, 25),
      location: "Virtual Meeting Room",
      type: "discussion",
      attendees: ["user1", "user2", "user3"]
    },
    {
      id: "2",
      title: "Quantum Computing Seminar",
      description: "Introduction to quantum algorithms and their applications",
      date: new Date(2025, 4, 20),
      location: "Online",
      type: "webinar",
      attendees: ["user1", "user4"]
    }
  ]);
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    location: "",
    type: "webinar"
  });

  // Get events for the selected date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  const selectedDateEvents = getEventsForDate(date);

  // Function to handle creating a new event
  const handleCreateEvent = () => {
    const newEventItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEvent,
      attendees: []
    };
    
    setEvents([...events, newEventItem]);
    
    // Clear the form
    setNewEvent({
      title: "",
      description: "",
      date: new Date(),
      location: "",
      type: "webinar"
    });
  };

  // Function to handle joining an event
  const handleJoinEvent = (eventId: string) => {
    if (!user) return;
    
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, attendees: [...event.attendees, user.id] } 
        : event
    ));
  };

  // Function to check if the user is attending an event
  const isAttending = (eventId: string) => {
    if (!user) return false;
    const event = events.find(e => e.id === eventId);
    return event ? event.attendees.includes(user.id) : false;
  };

  // Function to check if a date has events
  const dateHasEvents = (date: Date) => {
    return events.some(
      event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleCreateEventClick = () => {
    // This is just a placeholder for demonstration purposes
    alert("Create event feature coming soon!");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <EventsHeader onCreateEvent={handleCreateEventClick} />
        <EventsFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg shadow-sm p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-3 pointer-events-auto mx-auto"
                modifiers={{
                  hasEvents: dateHasEvents
                }}
                modifiersStyles={{
                  hasEvents: { 
                    fontWeight: 'bold',
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    color: 'hsl(var(--primary))',
                  }
                }}
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg shadow-sm p-6">
              {date && (
                <h2 className="text-xl font-semibold mb-4">
                  Events for {format(date, 'MMMM d, yyyy')}
                </h2>
              )}
              
              <EventsList 
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="hidden">Create Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new event for the community.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <label htmlFor="title" className="text-sm font-medium mb-2 block">
                    Event Title
                  </label>
                  <Input 
                    id="title"
                    value={newEvent.title} 
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="text-sm font-medium mb-2 block">
                    Description
                  </label>
                  <Textarea 
                    id="description"
                    value={newEvent.description} 
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="text-sm font-medium mb-2 block">
                      Date
                    </label>
                    <Calendar 
                      className="p-3 pointer-events-auto" 
                      selected={newEvent.date} 
                      onSelect={(date) => date && setNewEvent({...newEvent, date})} 
                      mode="single"
                      initialFocus
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="location" className="text-sm font-medium mb-2 block">
                        Location
                      </label>
                      <Input 
                        id="location"
                        value={newEvent.location} 
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="text-sm font-medium mb-2 block">
                        Event Type
                      </label>
                      <Select 
                        value={newEvent.type} 
                        onValueChange={(value) => setNewEvent({...newEvent, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="discussion">Discussion</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="lecture">Lecture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleCreateEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageLayout>
  );
};

export default Events;
