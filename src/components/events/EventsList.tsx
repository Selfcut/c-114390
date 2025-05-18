
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Clock, ExternalLink } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

export interface EventsListProps {
  filter?: string;
  searchTerm?: string;
}

export const EventsList = ({ filter = 'all', searchTerm = '' }: EventsListProps) => {
  // Mock events data - in a real app, this would come from a database
  const events = [
    {
      id: '1',
      title: 'Quantum Mechanics Workshop',
      description: 'An introductory workshop to quantum mechanics principles',
      date: '2023-06-15T14:00:00',
      location: 'Physics Building, Room 101',
      attendees: 45,
      category: 'workshop',
      imageUrl: '/lovable-uploads/fab013d4-833b-4739-a13d-9492c0dea259.png'
    },
    {
      id: '2',
      title: 'Neuroscience Journal Club',
      description: 'Discussion on recent advances in cognitive neuroscience',
      date: '2023-06-20T16:30:00',
      location: 'Online - Zoom',
      attendees: 23,
      category: 'journal-club',
      imageUrl: '/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png'
    },
    {
      id: '3',
      title: 'Annual Philosophy Conference',
      description: 'Philosophical perspectives on consciousness and reality',
      date: '2023-07-05T09:00:00',
      location: 'Central University, Grand Hall',
      attendees: 120,
      category: 'conference',
      imageUrl: '/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png'
    }
  ];
  
  // Filter events based on the selected filter and search term
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
                         
    if (!matchesSearch) return false;
    
    const eventDate = new Date(event.date);
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return eventDate > now;
      case 'past':
        return eventDate < now;
      case 'attending':
        // In a real app, this would check if the user is attending
        return true;
      default:
        return true;
    }
  });
  
  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">No events found</h3>
        <p className="text-muted-foreground mb-6">
          {searchTerm ? 'Try a different search term' : 'There are no events matching your filters'}
        </p>
        <Button>Browse All Events</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {filteredEvents.map((event) => (
        <div key={event.id} className="flex flex-col md:flex-row gap-6 border rounded-lg p-6">
          <div className="w-full md:w-48 h-48 rounded-md overflow-hidden bg-muted">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-medium">{event.title}</h3>
              <p className="text-muted-foreground mt-1">{event.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>
            
            <div className="flex items-center pt-4 mt-4 border-t">
              <Button className="mr-2" variant="default">
                RSVP
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
