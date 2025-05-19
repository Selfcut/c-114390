
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventsFilters } from "@/components/events/EventsFilters";
import { EventsList } from "@/components/events/EventsList";
import { EventCalendar } from "@/components/events/EventCalendar";
import { EventDialog } from "@/components/events/EventDialog";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/lib/auth";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { Event, EventFilterType, EventStatus, EventWithAttendees } from "@/types/events";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";

const Events = () => {
  const { user } = useAuth();
  const { isAdmin, isModerator } = useAdminStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<EventFilterType>("all");
  const [category, setCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendees | undefined>(undefined);
  
  // Check if user is an admin or moderator
  const canCreateEvent = user && (isAdmin || isModerator || true);
  
  // Use our events hook
  const {
    events,
    isLoading,
    filter,
    setFilter,
    rsvpToEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents
  } = useEvents({
    filter: filterType,
    searchTerm,
    category: category || undefined
  });
  
  // Handle search input
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilter({
      ...filter,
      searchTerm: term
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilter: EventFilterType) => {
    setFilterType(newFilter);
    setFilter({
      ...filter,
      filter: newFilter
    });
  };
  
  // Handle category changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setFilter({
      ...filter,
      category: newCategory || undefined
    });
  };
  
  // Open dialog to create a new event
  const handleCreateEvent = () => {
    setDialogMode("create");
    setSelectedEvent(undefined);
    setDialogOpen(true);
  };
  
  // Open dialog to view event details
  const handleOpenEvent = (event: EventWithAttendees) => {
    setDialogMode("view");
    setSelectedEvent(event);
    setDialogOpen(true);
  };
  
  // Handle RSVP to an event
  const handleRSVP = async (eventId: string, status: EventStatus) => {
    await rsvpToEvent(eventId, status);
    if (selectedEvent?.id === eventId) {
      // Update the selected event in the dialog if it's open
      const updatedEvent = events.find(e => e.id === eventId);
      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      }
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <EventsHeader 
          canCreateEvent={Boolean(canCreateEvent)}
          onCreateEvent={handleCreateEvent}
          onSearch={handleSearch}
          searchTerm={searchTerm}
        />
        
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <EventsFilters 
              currentFilter={filterType}
              onFilterChange={handleFilterChange}
              currentCategory={category}
              onCategoryChange={handleCategoryChange}
            />
            
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "calendar" | "list")}
              className="hidden sm:block"
            >
              <TabsList>
                <TabsTrigger value="calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="mt-6">
          {viewMode === "calendar" ? (
            <EventCalendar 
              events={events}
              onEventClick={handleOpenEvent}
            />
          ) : (
            <EventsList 
              filter={filterType}
              searchTerm={searchTerm}
              onEventClick={handleOpenEvent}
            />
          )}
        </div>
        
        {/* Event Dialog for create/edit/view */}
        <EventDialog 
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          mode={dialogMode}
          event={selectedEvent}
          onCreateEvent={createEvent}
          onUpdateEvent={updateEvent}
          onDeleteEvent={deleteEvent}
          onRSVP={handleRSVP}
        />
      </div>
    </PageLayout>
  );
};

export default Events;
