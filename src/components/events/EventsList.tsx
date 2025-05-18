
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  location: string;
  virtual: boolean;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  imageUrl?: string;
  eventUrl?: string;
}

interface EventsListProps {
  searchQuery: string;
  selectedCategory: string | null;
}

// Sample data for UI presentation - replace with real data fetching
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Physics Symposium',
    description: 'Join leading physicists for discussions on the latest advances in quantum mechanics and string theory.',
    category: 'conference',
    date: new Date('2025-07-15'),
    time: '09:00 - 17:00',
    location: 'Princeton University, NJ',
    virtual: false,
    organizer: 'Institute for Advanced Study',
    attendees: 215,
    maxAttendees: 300,
    imageUrl: '/placeholder.svg',
    eventUrl: 'https://example.com/physics-symposium',
  },
  {
    id: '2',
    title: 'Philosophy of Mind Workshop',
    description: 'An intensive workshop exploring consciousness, dualism, and materialism theories.',
    category: 'workshop',
    date: new Date('2025-06-23'),
    time: '10:00 - 15:00',
    location: 'Online',
    virtual: true,
    organizer: 'Mind Science Foundation',
    attendees: 87,
    maxAttendees: 100,
  },
  {
    id: '3',
    title: 'Distinguished Lecture: Mathematics and Reality',
    description: 'Professor Maria Gonzalez discusses the relationship between mathematical structures and physical reality.',
    category: 'lecture',
    date: new Date('2025-08-05'),
    time: '18:30 - 20:00',
    location: 'MIT, Cambridge, MA',
    virtual: false,
    organizer: 'MIT Mathematics Department',
    attendees: 142,
    imageUrl: '/placeholder.svg',
  },
  {
    id: '4',
    title: 'Psychology & Neuroscience Meetup',
    description: 'Monthly gathering of researchers and enthusiasts discussing recent developments in cognitive neuroscience.',
    category: 'meetup',
    date: new Date('2025-05-28'),
    time: '19:00 - 21:00',
    location: 'San Francisco, CA',
    virtual: false,
    organizer: 'Cognitive Science Association',
    attendees: 35,
  },
];

export const EventsList = ({ searchQuery, selectedCategory }: EventsListProps) => {
  // Filter events based on search query and selected category
  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = searchQuery 
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory 
      ? event.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Format date helper
  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div>
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                {event.imageUrl && (
                  <div className="md:w-1/4 lg:w-1/5 h-48 md:h-auto">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`${event.imageUrl ? 'md:w-3/4 lg:w-4/5' : 'w-full'} flex flex-col`}>
                  <CardHeader className="py-4 px-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge>{event.category}</Badge>
                      {event.virtual && <Badge variant="outline">Virtual</Badge>}
                    </div>
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <div className="flex flex-wrap mt-2 gap-y-1.5 gap-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                        {formatEventDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1.5" />
                        {event.attendees} 
                        {event.maxAttendees && ` / ${event.maxAttendees}`} 
                        attendees
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 px-6">
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Organized by: {event.organizer}</p>
                  </CardContent>
                  <CardFooter className="py-3 px-6 border-t flex justify-between mt-auto">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/events/${event.id}`}>
                        View details
                      </a>
                    </Button>
                    <div className="flex gap-2">
                      {event.eventUrl && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={event.eventUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">External link</span>
                          </a>
                        </Button>
                      )}
                      <Button>Register</Button>
                    </div>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
