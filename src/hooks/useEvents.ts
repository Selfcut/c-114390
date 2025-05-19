
import { useState, useEffect } from 'react';
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

  // Fetch events from Supabase based on filter
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('events')
        .select(`
          *,
          profiles!events_user_id_fkey (name, avatar_url, username)
        `);

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

      const { data: eventsData, error } = await query;

      if (error) throw error;

      // Get attendees count for each event
      const eventsWithAttendees = await Promise.all((eventsData || []).map(async (event: any) => {
        // Get attendee count
        const { count, error: countError } = await supabase
          .from('event_attendees')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .eq('status', 'attending');
        
        if (countError) console.error('Error getting attendee count:', countError);
        
        // Check if the current user is attending
        let userStatus: EventStatus | undefined = undefined;
        let isCreator = false;
        
        if (user) {
          isCreator = event.user_id === user.id;
          
          const { data: attendeeData } = await supabase
            .from('event_attendees')
            .select('status')
            .eq('event_id', event.id)
            .eq('user_id', user.id)
            .single();
          
          if (attendeeData) {
            userStatus = attendeeData.status as EventStatus;
          }
        }
        
        return {
          ...event,
          attendees: count || 0,
          user_status: userStatus,
          is_creator: isCreator
        };
      }));
      
      setEvents(eventsWithAttendees);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events when filter changes
  useEffect(() => {
    fetchEvents();
  }, [filter, user]);

  // RSVP to an event
  const rsvpToEvent = async (eventId: string, status: EventStatus) => {
    if (!user) {
      toast.error('You must be logged in to RSVP');
      return;
    }

    try {
      // Check if user already has an RSVP
      const { data: existingRsvp } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

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
                  : (event.user_status === 'attending' ? event.attendees - 1 : event.attendees)
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
