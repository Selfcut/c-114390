
// Define the base QuoteSubmission type
export interface QuoteSubmission {
  text: string;
  author: string;
  source?: string;
  category: string;
  tags?: string[];
}

// Define the full Quote type that extends QuoteSubmission with server-generated fields
export interface Quote extends QuoteSubmission {
  id: string;
  user_id: string;
  likes?: number;
  comments?: number;
  bookmarks?: number;
  created_at: string;
  updated_at?: string;
  featured_date?: string;
}

// Define the filter types for fetching quotes
export type QuoteSortOption = 'newest' | 'oldest' | 'popular' | 'featured';

export interface QuotesFilter {
  page?: number;
  pageSize?: number;
  sortBy?: QuoteSortOption;
  tag?: string;
  search?: string;
  authorId?: string;
  category?: string;
}
