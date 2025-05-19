
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';
import { Event, EventWithAttendees, EventStatus } from '@/types/events';

type EventDialogMode = 'create' | 'edit' | 'view';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: EventDialogMode;
  event?: EventWithAttendees;
  onCreateEvent: (eventData: any) => Promise<Event | null>;
  onUpdateEvent: (eventId: string, eventData: Partial<Event>) => Promise<boolean>;
  onDeleteEvent: (eventId: string) => Promise<boolean>;
  onRSVP: (eventId: string, status: EventStatus) => Promise<void>;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  mode,
  event,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onRSVP
}) => {
  // Handle form submission for creating or updating events
  const handleSubmit = async (formData: any) => {
    if (mode === 'create') {
      const result = await onCreateEvent(formData);
      if (result) onClose();
    } else if (mode === 'edit' && event) {
      const updated = await onUpdateEvent(event.id, formData);
      if (updated) onClose();
    }
  };
  
  // Handle event deletion
  const handleDelete = async () => {
    if (event) {
      const deleted = await onDeleteEvent(event.id);
      if (deleted) onClose();
    }
  };
  
  // Handle RSVP status changes
  const handleRSVP = async (status: EventStatus) => {
    if (event) {
      await onRSVP(event.id, status);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Event' : 
             mode === 'edit' ? 'Edit Event' : 
             event?.title}
          </DialogTitle>
          {mode === 'create' && (
            <DialogDescription>
              Fill out the form below to create a new event.
            </DialogDescription>
          )}
        </DialogHeader>
        
        {(mode === 'create' || mode === 'edit') && (
          <EventForm
            onSubmit={handleSubmit}
            initialData={event}
            isEditing={mode === 'edit'}
            onCancel={onClose}
          />
        )}
        
        {mode === 'view' && event && (
          <EventDetails
            event={event}
            onRSVP={handleRSVP}
            onEdit={() => ({})}  // Handle in parent
            onDelete={handleDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
