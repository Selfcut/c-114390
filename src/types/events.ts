
export type EventStatus = "attending" | "interested" | "declined";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  category: string;
  image_url: string | null;
  max_attendees: number | null;
  is_featured: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  status: EventStatus;
  created_at: string;
}

export interface EventWithAttendees extends Event {
  attendees: number;
  user_status?: EventStatus;
  is_creator: boolean;
}

export type EventFilterType = "all" | "upcoming" | "past" | "attending" | "created";

export interface EventsFilter {
  filter: EventFilterType;
  category?: string;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}

export type CalendarView = "month" | "week" | "day" | "agenda";
