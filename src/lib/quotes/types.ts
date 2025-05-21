
// Define the interfaces for quotes
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string | null;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  created_at: string;
  featured_date?: string | null;
  user_id: string;
}

// Extended quote with user info
export interface QuoteWithUser extends Quote {
  user: {
    id: string;
    username: string;
    name: string;
    avatar_url: string | null;
    status: string;
  };
}

// Type for submitting a new quote
export interface QuoteSubmission {
  text: string;
  author: string;
  source?: string;
  category: string;
  tags?: string[];
}

// Filter options for quotes
export interface QuoteFilterOptions {
  searchQuery?: string;
  filterTag?: string | null;
  sortOption?: QuoteSortOption;
}

// Sort options for quotes
export type QuoteSortOption = 'newest' | 'oldest' | 'most_liked' | 'most_bookmarked' | 'popular';
