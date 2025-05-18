
import React, { useState } from 'react';
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import Header from "@/components/Header";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventsFilters } from "@/components/events/EventsFilters";
import { EventsList } from "@/components/events/EventsList";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  return (
    <div className="flex min-h-screen bg-background">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col w-[calc(100vw-var(--sidebar-width))]">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-7xl">
            <EventsHeader onCreateEvent={() => {
              // Add your create event logic here
              alert('Create event feature coming soon');
            }} />
            <EventsFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <EventsList 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
