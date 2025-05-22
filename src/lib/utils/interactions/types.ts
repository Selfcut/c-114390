
import { supabase } from '@/integrations/supabase/client';

// Content interaction interfaces for better type safety
export interface ContentInteractions {
  hasLiked: boolean;
  hasBookmarked: boolean;
}

// Define explicit interfaces for insert operations to avoid deep type instantiation
export interface QuoteLikeInsert {
  quote_id: string;
  user_id: string;
}

export interface QuoteBookmarkInsert {
  quote_id: string;
  user_id: string;
}

export interface ContentLikeInsert {
  content_id: string;
  user_id: string;
  content_type: string;
}

export interface ContentBookmarkInsert {
  content_id: string;
  user_id: string;
  content_type: string;
}

export type InteractionType = 'like' | 'bookmark';
