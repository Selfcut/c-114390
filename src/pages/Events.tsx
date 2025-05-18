
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventsFilters } from "@/components/events/EventsFilters";
import { EventsList } from "@/components/events/EventsList";
import { useAuth } from "@/lib/auth";
import { useAdminStatus } from "@/hooks/useAdminStatus";

const Events = () => {
  const { user } = useAuth();
  const { isAdmin, isModerator } = useAdminStatus();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check if user is an admin or moderator
  const canCreateEvent = user && (isAdmin || isModerator);
  
  const handleCreateEvent = () => {
    console.log("Creating new event");
    // Implementation for creating events
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <EventsHeader 
          canCreateEvent={Boolean(canCreateEvent)}
          onCreateEvent={handleCreateEvent}
          onSearch={handleSearch}
        />
        
        <div className="mt-6">
          <EventsFilters 
            currentFilter={filter}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        <div className="mt-6">
          <EventsList 
            filter={filter}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Events;
