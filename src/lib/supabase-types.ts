
/**
 * Type definitions for database tables from Supabase
 */

export interface ResearchPaper {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  author: string;
  category: string;
  created_at: string;
  updated_at?: string;
  published_date?: string;
  likes?: number;
  views?: number;
  user_id?: string;
  image_url?: string;
  source?: string;
  source_url?: string;
  is_auto_fetched?: boolean;
  is_embedded?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  end_date?: string;
  location?: string;
  category: string;
  is_featured?: boolean;
  max_attendees?: number | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  image_url: string | null;
}

export interface ContentEmbedding {
  id: string;
  content_id: string;
  content_type: string;
  content_text: string;
  embedding: number[];
  created_at: string;
}
