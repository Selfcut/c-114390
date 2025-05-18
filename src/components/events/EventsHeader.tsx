
import React from 'react';
import { CalendarDays, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsHeaderProps {
  onCreateEvent: () => void;
}

export const EventsHeader = ({ onCreateEvent }: EventsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 stagger-fade w-full">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <CalendarDays size={28} />
        Events
      </h1>
      <Button 
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
        onClick={onCreateEvent}
      >
        <PlusCircle size={18} />
        <span>Create Event</span>
      </Button>
    </div>
  );
};
