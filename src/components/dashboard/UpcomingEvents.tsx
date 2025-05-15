
import React from "react";
import { Calendar, MapPin, Users, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const UpcomingEvents = () => {
  // Mock events data
  const events = [
    // If you want to show events, uncomment and populate this array
    // {
    //   id: "1",
    //   title: "Quantum Computing Seminar",
    //   description: "Introduction to quantum algorithms and their applications",
    //   date: "2025-05-25T15:00:00",
    //   location: "Online",
    //   attendees: 12,
    //   type: "webinar",
    //   isRegistered: true
    // },
    // {
    //   id: "2",
    //   title: "Philosophy Discussion Group",
    //   description: "Weekly discussion on consciousness and the nature of reality",
    //   date: "2025-05-20T18:30:00",
    //   location: "Virtual Meeting Room",
    //   attendees: 8,
    //   type: "discussion",
    //   isRegistered: false
    // }
  ];

  // If there are no events
  if (events.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Upcoming Events</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            You don't have any scheduled events. Join a study group or schedule a discussion to see events here.
          </p>
          <Button className="bg-[#6E59A5] hover:bg-[#7E69B5] text-white px-4 py-2 rounded-md transition-colors hover-lift">
            Browse Study Groups
          </Button>
        </div>
      </div>
    );
  }

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in">
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {events.map(event => (
            <Card key={event.id} className="enhanced-card hover-lift">
              <CardContent className="p-0">
                <div className="flex border-l-4 border-primary">
                  <div className="py-4 px-5 flex flex-col items-center justify-center bg-muted/50">
                    <CalendarIcon size={24} className="text-primary mb-1" />
                    <div className="text-center">
                      <div className="text-sm font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-xl font-bold">{new Date(event.date).getDate()}</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      </div>
                      <Badge variant={event.isRegistered ? "default" : "outline"} className="ml-2">
                        {event.isRegistered ? "Registered" : "Open"}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      {event.isRegistered ? (
                        <>
                          <Button size="sm">Join Now</Button>
                          <Button size="sm" variant="outline">Add to Calendar</Button>
                        </>
                      ) : (
                        <Button size="sm">Register</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
