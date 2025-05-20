import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Event, EventAttendee, EventWithAttendees, EventsFilter, EventStatus } from '@/types/events';

export const useEvents = (initialFilter?: Partial<EventsFilter>) => {
  const [events, setEvents] = useState<EventWithAttendees[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<EventsFilter>({
    filter: initialFilter?.filter || 'all',
    searchTerm: initialFilter?.searchTerm || '',
    category: initialFilter?.category,
    startDate: initialFilter?.startDate,
    endDate: initialFilter?.endDate,
  });
  const { user } = useAuth();

  // Fetch events function
  const fetchEvents = useCallback(async (conversationId: string = 'global', options: any = {}) => {
    setIsLoading(true);
    try {
      // Construct a basic query first
      let query = supabase.from('events').select('*');

      // Apply filters
      if (filter.searchTerm) {
        query = query.or(
          `title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%,location.ilike.%${filter.searchTerm}%`
        );
      }
      
      if (filter.category) {
        query = query.eq('category', filter.category);
      }
      
      const now = new Date().toISOString();
      
      switch (filter.filter) {
        case 'upcoming':
          query = query.gte('date', now);
          break;
        case 'past':
          query = query.lt('date', now);
          break;
        case 'attending':
          if (!user) return;
          // Get events the user is attending
          const { data: attendingEventIds } = await supabase
            .from('event_attendees')
            .select('event_id')
            .eq('user_id', user.id)
            .eq('status', 'attending');
          
          if (attendingEventIds && attendingEventIds.length > 0) {
            query = query.in('id', attendingEventIds.map(e => e.event_id));
          } else {
            // If not attending any events, return empty
            setEvents([]);
            setIsLoading(false);
            return;
          }
          break;
        case 'created':
          if (!user) return;
          query = query.eq('user_id', user.id);
          break;
        case 'all':
        default:
          // No additional filter for 'all'
          break;
      }
      
      // Apply date range filters if provided
      if (filter.startDate) {
        query = query.gte('date', filter.startDate.toISOString());
      }
      
      if (filter.endDate) {
        // Include the full end date by setting it to the end of the day
        const endOfDay = new Date(filter.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('date', endOfDay.toISOString());
      }
      
      // Order by date
      query = query.order('date', { ascending: true });

      // Execute the query
      const { data: eventsData, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      // Process events and add attendee information
      const eventsWithAttendees = await Promise.all((eventsData || []).map(async (event: any) => {
        try {
          // Get attendee count
          const { count: attendeeCount, error: countError } = await supabase
            .from('event_attendees')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .eq('status', 'attending');
          
          if (countError) {
            console.error('Error getting attendee count:', countError);
          }
          
          // Check if the current user is attending
          let userStatus: EventStatus | undefined = undefined;
          let isCreator = false;
          
          if (user) {
            isCreator = event.user_id === user.id;
            
            const { data: attendeeData, error: attendeeError } = await supabase
              .from('event_attendees')
              .select('status')
              .eq('event_id', event.id)
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (attendeeError) {
              console.error('Error checking attendance status:', attendeeError);
            }
            
            if (attendeeData) {
              userStatus = attendeeData.status as EventStatus;
            }
          }
          
          // Try to get organizer info with error handling
          let organizerName = "Unknown";
          let organizerAvatar = null;
          
          try {
            if (event.user_id) {
              const { data: organizerData, error: organizerError } = await supabase
                .from('profiles')
                .select('name, username, avatar_url')
                .eq('id', event.user_id)
                .maybeSingle();
              
              if (!organizerError && organizerData) {
                organizerName = organizerData.name || organizerData.username || "Unknown";
                organizerAvatar = organizerData.avatar_url;
              } else {
                console.log(`Could not find profile for user ID: ${event.user_id}`);
              }
            }
          } catch (e) {
            console.error("Error fetching organizer data:", e);
          }
          
          return {
            ...event,
            attendees: attendeeCount || 0,
            user_status: userStatus,
            is_creator: isCreator,
            organizer_name: organizerName,
            organizer_avatar: organizerAvatar
          };
        } catch (e) {
          console.error(`Error processing event ${event.id}:`, e);
          return {
            ...event,
            attendees: 0,
            user_status: undefined,
            is_creator: false,
            organizer_name: "Unknown",
            organizer_avatar: null
          };
        }
      }));
      
      setEvents(eventsWithAttendees);
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, [filter, user?.id]);

  // Fetch events when filter changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // RSVP to an event
  const rsvpToEvent = async (eventId: string, status: EventStatus) => {
    if (!user) {
      toast.error('You must be logged in to RSVP');
      return;
    }

    try {
      // Check if user already has an RSVP
      const { data: existingRsvp, error: findError } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (findError) {
        throw findError;
      }
      
      let result;
      
      if (existingRsvp) {
        // Update existing RSVP
        result = await supabase
          .from('event_attendees')
          .update({ status })
          .eq('id', existingRsvp.id);
      } else {
        // Create new RSVP
        result = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id,
            status
          });
      }

      if (result.error) throw result.error;
      
      // Update local state
      setEvents(currentEvents => 
        currentEvents.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                user_status: status,
                attendees: status === 'attending' 
                  ? (event.user_status !== 'attending' ? event.attendees + 1 : event.attendees) 
                  : (event.user_status === 'attending' ? Math.max(0, event.attendees - 1) : event.attendees)
              } 
            : event
        )
      );
      
      toast.success(`You are now ${status === 'attending' ? 'attending' : status} this event`);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update your RSVP');
    }
  };

  // Create a new event
  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Auto-RSVP the creator
      await supabase.from('event_attendees').insert({
        event_id: data.id,
        user_id: user.id,
        status: 'attending'
      });
      
      // Update local state with the new event
      fetchEvents(); // Re-fetch all events to get the updated list
      
      toast.success('Event created successfully');
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      return null;
    }
  };

  // Update an existing event
  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    if (!user) {
      toast.error('You must be logged in to update an event');
      return false;
    }

    try {
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId)
        .eq('user_id', user.id); // Ensure user can only update their own events

      if (error) throw error;
      
      // Update local state
      setEvents(currentEvents => 
        currentEvents.map(event => 
          event.id === eventId ? { ...event, ...eventData } : event
        )
      );
      
      toast.success('Event updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      return false;
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete an event');
      return false;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id); // Ensure user can only delete their own events

      if (error) throw error;
      
      // Update local state
      setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
      
      toast.success('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  };

  return {
    events,
    isLoading,
    filter,
    setFilter,
    rsvpToEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents
  };
};
